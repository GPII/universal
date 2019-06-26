#!/bin/sh
GPII_APP_DIR=${GPII_APP_DIR:-"/app"}

GPII_STATIC_DATA_DIR=${GPII_STATIC_DATA_DIR:-"${GPII_APP_DIR}/testData/dbData"}
GPII_PREFERENCES_DATA_DIR=${GPII_PREFERENCES_DATA_DIR:-"${GPII_APP_DIR}/testData/preferences"}
GPII_SNAPSET_DATA_DIR=${GPII_SNAPSET_DATA_DIR:-"${GPII_APP_DIR}/build/dbData/snapset"}

DATALOADER_JS="${GPII_APP_DIR}/scripts/deleteAndLoadSnapsets.js"
CONVERT_JS="${GPII_APP_DIR}/scripts/convertPrefs.js"

log() {
  echo "$(date +'%Y-%m-%d %H:%M:%S') - $1"
}

warm_indices(){
  log "Warming indices..."

  for view in $(curl -s "${GPII_COUCHDB_URL}/_design/views/" | jq -r '.views | keys[]'); do
    curl -fsS "${GPII_COUCHDB_URL}/_design/views/_view/${view}" >/dev/null
  done

  log "Finished warming indices..."
}

# Verify variables
if [ -z "${GPII_COUCHDB_URL}" ]; then
  echo "GPII_COUCHDB_URL environment variable must be defined"
  exit 1
fi

GPII_COUCHDB_URL_SANITIZED=$(echo "${GPII_COUCHDB_URL}" | sed -e 's,\(://\)[^/]*\(@\),\1<SENSITIVE>\2,g')

log 'Starting'
log "CouchDB: ${GPII_COUCHDB_URL_SANITIZED}"
log "Clear index: ${GPII_CLEAR_INDEX}"
log "Static: ${GPII_STATIC_DATA_DIR}"
log "Build: ${GPII_SNAPSET_DATA_DIR}"
log "Working directory: $(pwd)"

# Check we can connect to CouchDB
GPII_COUCHDB_URL_ROOT=$(echo "${GPII_COUCHDB_URL}" | sed 's/[^\/]*$//g')
COUCHDB_HEALTHCHECK_RETRIES=30
COUCHDB_HEALTHCHECK_DELAY=2
log "Checking that CouchDB is ready..."
for i in `seq 1 $COUCHDB_HEALTHCHECK_RETRIES`
do
    RET_CODE=$(curl --write-out '%{http_code}' --silent --output /dev/null "${GPII_COUCHDB_URL_ROOT}/_up")
    if [ "$RET_CODE" = '200' ]; then
        break
    fi
    sleep $COUCHDB_HEALTHCHECK_DELAY
done
if [ "$RET_CODE" != '200' ]; then
    log "[ERROR] Failed to connect to CouchDB: ${GPII_COUCHDB_URL_SANITIZED}"
    exit 1
fi

# Create build dir if it does not exist
if [ ! -d "${GPII_SNAPSET_DATA_DIR}" ]; then
  mkdir -p "${GPII_SNAPSET_DATA_DIR}"
fi

# Convert preferences json5 to GPII keys and preferences safes
if [ -d "${GPII_PREFERENCES_DATA_DIR}" ]; then
  node "${CONVERT_JS}" "${GPII_PREFERENCES_DATA_DIR}" "${GPII_SNAPSET_DATA_DIR}" snapset
  if [ "$?" != '0' ]; then
    log "[ERROR] ${CONVERT_JS} failed (exit code: $?)"
    exit 1
  fi
else
  log "GPII_PREFERENCES_DATA_DIR ($GPII_PREFERENCES_DATA_DIR) does not exist, nothing to convert"
fi

# Initialize (possibly clear) data base
if [ "${GPII_CLEAR_INDEX}" == 'true' ]; then
  log "Deleting database at ${GPII_COUCHDB_URL_SANITIZED}"
  if ! curl -fsS -X DELETE "${GPII_COUCHDB_URL}"; then
    log "Error deleting database"
  fi
fi

log "Creating database at ${GPII_COUCHDB_URL_SANITIZED}"
if ! curl -fsS -X PUT "${GPII_COUCHDB_URL}"; then
  log "Database already exists at ${GPII_COUCHDB_URL_SANITIZED}"
fi

# Submit data
node "${DATALOADER_JS}" "${GPII_COUCHDB_URL}" "${GPII_STATIC_DATA_DIR}" "${GPII_SNAPSET_DATA_DIR}"
err=$?
if [ "${err}" != '0' ]; then
  log "${DATALOADER_JS} failed with exit status ${err}"
  exit "${err}"
fi

# Warm Data
warm_indices
