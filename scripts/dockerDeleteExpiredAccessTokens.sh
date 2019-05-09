#!/bin/sh

# Copyright 2019 OCAD University
# 
# Licensed under the New BSD license. You may not use this file except in
# compliance with this License.
# 
# You may obtain a copy of the License at
# https://github.com/GPII/universal/blob/master/LICENSE.txt

# This script provide as way to run the node script that deletes expired access
# tokens (GPII App Installation Authorization records) from CouchDB using a
# docker image of gpii-universal

GPII_APP_DIR=${GPII_APP_DIR:-"/app"}
GPII_COUCHDB_URL=${GPII_COUCHDB_URL:-"http://couchdb:5984/gpii"}
DELETE_ALL=${DELETE_ALL:-""}

GPII_COUCHDB_URL_SANITIZED=$(echo "${GPII_COUCHDB_URL}" | sed -e 's,\(://\)[^/]*\(@\),\1<SENSITIVE>\2,g')
GPII_COUCHDB_URL_ROOT=$(echo "${GPII_COUCHDB_URL}" | sed 's/[^\/]*$//g')
COUCHDB_HEALTHCHECK_DELAY=2
COUCHDB_HEALTHCHECK_RETRIES=30

DELETE_ACCESS_TOKENS_JS="${GPII_APP_DIR}/scripts/deleteExpiredAccessTokens.js"

log() {
  echo "$(date +'%Y-%m-%d %H:%M:%S') - $1"
}

log "Delete expired access tokens: starting..."
log "CouchDB: ${GPII_COUCHDB_URL_SANITIZED}"
log "Delete all flag: ${DELETE_ALL}"

log "Waiting for couchdb to be ready"
for ((i=0; i<$COUCHDB_HEALTHCHECK_RETRIES; i++));
do
    RET_CODE=$(curl --write-out '%{http_code}' --silent --output /dev/null "${GPII_COUCHDB_URL_ROOT}/_up")
    if [ "$RET_CODE" = '200' ]; then
        break
    fi
    sleep $COUCHDB_HEALTHCHECK_DELAY
done

node ${DELETE_ACCESS_TOKENS_JS} ${GPII_COUCHDB_URL} ${DELETE_ALL}
RET_CODE=$?
if [ "${RET_CODE}" != '0' ]; then
  log "${DELETE_ACCESS_TOKENS_JS} failed with exit code ${RET_CODE}, exiting"
fi
exit "${RET_CODE}"
