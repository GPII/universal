#!/bin/sh -ex
#
# This scripts deploys an environment for end-to-end tests based on Docker
# containers. It was initially developed to support CI.
#
# It builds a Docker image for GPII/universal and uses it to start two 
# components: the Preferences Server and the Flow Manager.
#
# It also starts a CouchDB container and loads the Preferences data into
# it, so tests running against the GPII components will have access to the
# latest test data.
#
# This script can be executed multiple times to create a new Docker image
# and deploy fresh containers every time.
# 
# https://issues.gpii.net/browse/GPII-2470

UNIVERSAL_IMAGE=vagrant-universal

COUCHDB_IMAGE=couchdb
COUCHDB_PORT=5984
COUCHDB_HEALTHCHECK_DELAY=5
COUCHDB_HEALTHCHECK_TIMEOUT=30

DATALOADER_IMAGE="gpii/preferences-dataloader"
DATALOADER_CLEAR_INDEX=1
DATALOADER_COUCHDB_URL="http://couchdb:${COUCHDB_PORT}/preferences"

PREFERENCES_CONFIG="gpii.config.preferencesServer.standalone.production"
PREFERENCES_DATASOURCE_URL="http://couchdb:${COUCHDB_PORT}/preferences/%userToken"
PREFERENCES_DIR="/home/vagrant/sync/universal/testData/preferences"
PREFERENCES_PORT=9081

FLOWMANAGER_CONFIG="gpii.config.cloudBased.flowManager.production"
FLOWMANAGER_PREFERENCES_URL="http://preferences:${PREFERENCES_PORT}/preferences/%userToken"
FLOWMANAGER_PORT=9082


# Remove old containers (exit code is ignored)
docker rm -f couchdb 2>/dev/null || true
docker rm -f preferences 2>/dev/null || true
docker rm -f flowmanager 2>/dev/null || true

# Remove old image (exit code is ignored)
docker rmi -f $UNIVERSAL_IMAGE 2>/dev/null || true

# Build image
docker build -t $UNIVERSAL_IMAGE .

# Start containers and load preferences data
docker run -d -p $COUCHDB_PORT:$COUCHDB_PORT --name couchdb $COUCHDB_IMAGE

# Wait for CouchDB
sleep $COUCHDB_HEALTHCHECK_DELAY
curl --retry $COUCHDB_HEALTHCHECK_TIMEOUT --retry-delay 1 --retry-connrefused http://localhost:$COUCHDB_PORT

docker run -d -p $PREFERENCES_PORT:$PREFERENCES_PORT --name preferences --link couchdb -e NODE_ENV=$PREFERENCES_CONFIG -e GPII_PREFERENCES_DATASOURCE_URL=$PREFERENCES_DATASOURCE_URL -e GPII_PREFERENCES_LISTEN_PORT=$PREFERENCES_PORT $UNIVERSAL_IMAGE
docker run -d -p $FLOWMANAGER_PORT:$FLOWMANAGER_PORT --name flowmanager --link preferences -e NODE_ENV=$FLOWMANAGER_CONFIG -e GPII_FLOWMANAGER_PREFERENCES_URL=$FLOWMANAGER_PREFERENCES_URL -e GPII_FLOWMANAGER_LISTEN_PORT=$FLOWMANAGER_PORT $UNIVERSAL_IMAGE
docker run --rm --link couchdb -v $PREFERENCES_DIR:/data -e PREFERENCES_DIR=/data -e COUCHDB_URL=$DATALOADER_COUCHDB_URL -e CLEAR_INDEX=$DATALOADER_CLEAR_INDEX $DATALOADER_IMAGE

