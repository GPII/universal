#!/bin/sh

STATIC_DATA_DIR=${STATIC_DATA_DIR:-/home/node/universal/testData/dbData}
BUILD_DATA_DIR=${BUILD_DATA_DIR:-/home/node/universal/build/dbData/snapset}

log() {
  echo "$(date +'%Y-%m-%d %H:%M:%S') - $1"
}

warm_indices(){
  log "Warming indices..."

  for view in $(curl -s $COUCHDB_URL/_design/views/ | jq -r '.views | keys[]'); do
    curl -fsS $COUCHDB_URL/_design/views/_view/$view >/dev/null
  done

  log "Finished warming indices..."
}

# Verify variables
if [ -z "$COUCHDB_URL" ]; then
  echo "COUCHDB_URL environment variable must be defined"
  exit 1
fi

if [ ! -d "$STATIC_DATA_DIR" -o ! "$(ls -A $STATIC_DATA_DIR/*.json)" ]; then
  echo "STATIC_DATA_DIR ($STATIC_DATA_DIR) does not exist or does not contain data, using universal's 'testData/dbData' as the default"
  STATIC_DATA_DIR=./testData/dbData
fi

if [ ! -d "$BUILD_DATA_DIR" -o ! "$(ls -A $BUILD_DATA_DIR/*.json)" ]; then
  echo "BUILD_DATA_DIR ($BUILD_DATA_DIR) does not exist or does not contain data, using universal's 'build/dbData/snapset' as the default"
  BUILD_DATA_DIR=./build/dbData/snapset
fi

COUCHDB_URL_SANITIZED=`echo "$COUCHDB_URL" | sed -e 's,\(://\)[^/]*\(@\),\1<SENSITIVE>\2,g'`

log "Starting"
log "CouchDB: $COUCHDB_URL_SANITIZED"
log "Clear index: $CLEAR_INDEX"
log "Static: $STATIC_DATA_DIR"
log "Build: $BUILD_DATA_DIR"
log "Working directory: `pwd`"

# Set up universal
git clone --depth 1 https://github.com/GPII/universal.git
cd universal

npm install json5
npm install fs
npm install rimraf
npm install mkdirp
npm install infusion
rm -f package-lock.json
node scripts/convertPrefs.js testData/preferences/ build/dbData/snapset/ snapset

# Initialize (possibly clear) data base
if [ ! -z "$CLEAR_INDEX" ]; then
  log "Deleting database at $COUCHDB_URL_SANITIZED"
  if ! curl -fsS -X DELETE "$COUCHDB_URL"; then
    log "Error deleting database"
  fi
fi

log "Creating database at $COUCHDB_URL_SANITIZED"
if ! curl -fsS -X PUT "$COUCHDB_URL"; then
  log "Database already exists at $COUCHDB_URL_SANITIZED"
fi

# Submit data
node scripts/deleteAndLoadSnapsets.js $COUCHDB_URL $STATIC_DATA_DIR $BUILD_DATA_DIR
err=$?
if [ $err != 0 ]; then
  log "deleteAndLoadSnapsets.js failed with $err, exiting"
  exit $err
fi

# Warm Data
warm_indices
