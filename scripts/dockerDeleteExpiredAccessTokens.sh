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

GPII_UNIVERSAL_IMAGE=${GPII_UNIVERSAL_IMAGE:-"vagrant-universal"}
GPII_APP_DIR=${GPII_APP_DIR:-"/app"}
GPII_COUCHDB_CONTAINER=${GPII_COUCHDB_CONTAINER:-"couchdb"}
GPII_COUCHDB_URL=${GPII_COUCHDB_URL:-"http://couchdb:5984/gpii"}
DELETE_ALL_FLAG=${DELETE_ALL_FLAG:-""}

GPII_COUCHDB_URL_SANITIZED=$(echo "${GPII_COUCHDB_URL}" | sed -e 's,\(://\)[^/]*\(@\),\1<SENSITIVE>\2,g')

DELETE_ACCESS_TOKENS_CMD="node ${GPII_APP_DIR}/scripts/deleteExpiredAccessTokens.js ${GPII_COUCHDB_URL} ${DELETE_ALL_FLAG}"

log() {
  echo "$(date +'%Y-%m-%d %H:%M:%S') - $1"
}

log "Delete expired access tokens: starting..."
log "Universal docker image: ${GPII_UNIVERSAL_IMAGE}"
log "CouchDB docker container: ${GPII_COUCHDB_CONTAINER}"
log "CouchDB: ${GPII_COUCHDB_URL_SANITIZED}"
log "Delete all flag: ${DELETE_ALL_FLAG}"

docker run --rm --link $GPII_COUCHDB_CONTAINER $GPII_UNIVERSAL_IMAGE $DELETE_ACCESS_TOKENS_CMD

