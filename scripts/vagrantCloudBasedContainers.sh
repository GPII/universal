#
# This scripts deploys an environment for end-to-end tests based on Docker
# containers. It was initially developed to support CI.
#
# It builds a Docker image for GPII/universal and uses it to start two
# components: the Preferences Server and the Flow Manager.
#
# It also starts a CouchDB container and loads the CouchDB data into
# it, so tests running against the GPII components will have access to the
# latest test data.
#
# This script can be executed multiple times to create a new Docker image
# and deploy fresh containers every time.
#
# https://issues.gpii.net/browse/GPII-2470

# This script accepts an option "--no-rebuild" indicating to only start
# docker containers without rebuilding the universal docker image. If this
# option is not provided, the old docker containers will be removed and the
# universal docker image will be rebuilt.
# Example command to build from the scratch: ./vagrantCloudBasedContainers.sh
# Example command not to rebuild: ./vagrantCloudBasedContainers.sh --no-rebuild

if  [ "$1" == "--no-rebuild" ]; then
    NO_REBUILD=true
fi

UNIVERSAL_IMAGE=vagrant-universal

# The following SHA256 is guaranteed to be a revison on github, and recent.  It
# is not guaranteed to be the latest revision that is used in production; it
# could be an even later revision.  It is sufficient for the tests.  It is
# written to the file "gpii-revision.json" at the root universal folder.
# See the Dockerfile.
GITFULLREV="$(git rev-parse @{upstream})"

COUCHDB_IMAGE=couchdb:2.3.1
COUCHDB_PORT=5984
COUCHDB_HEALTHCHECK_DELAY=2
COUCHDB_HEALTHCHECK_TIMEOUT=30
if [ "$NO_REBUILD" == "true" ] ; then
    CLEAR_INDEX=
else
    CLEAR_INDEX='true'
fi

UNIVERSAL_DIR="/home/vagrant/sync/universal"
STATIC_DATA_DIR="$UNIVERSAL_DIR/testData/dbData"
BUILD_DATA_DIR="$UNIVERSAL_DIR/build/dbData/snapset"

DATALOADER_COUCHDB_URL="http://couchdb:${COUCHDB_PORT}/gpii"
DATASOURCE_HOSTNAME="http://couchdb"
DATALOADER_CMD="/app/scripts/deleteAndLoadSnapsets.sh"
PRODTESTS_CMD="npm run test:productionConfig"

GPII_PREFERENCES_CONFIG="gpii.config.preferencesServer.standalone.production"
GPII_PREFERENCES_PORT=9081

GPII_FLOWMANAGER_CONFIG="gpii.config.cloudBased.flowManager.production"
GPII_CLOUD_FLOWMANAGER_PORT=9082
GPII_LOCAL_FLOWMANAGER_PORT=8080
GPII_FLOWMANAGER_TO_PREFERENCESSERVER_URL="http://preferences:${GPII_PREFERENCES_PORT}"

# The URL to point to the flow manager docker container, only used by running the production config tests
GPII_CLOUD_URL="http://flowmanager:9082"

# The URLs to test the readiness of each docker container
COUCHDB_VIEW_URL="http://localhost:$COUCHDB_PORT/gpii/_design/views/_view/findPrefsSafeByGpiiKey?key=%22carla%22&include_docs=true"
CARLA_PREFERENCES_URL="http://localhost:$GPII_PREFERENCES_PORT/preferences/carla"
GPII_FLOWMANAGER_READY_URL="http://localhost:$GPII_CLOUD_FLOWMANAGER_PORT/ready"

# Remove old containers (exit code is ignored)
docker rm -f couchdb 2>/dev/null || true
docker rm -f preferences 2>/dev/null || true
docker rm -f flowmanager 2>/dev/null || true
docker rm -f productionConfigTests 2>/dev/null || true

if [ "$NO_REBUILD" != "true" ] ; then
    # Remove old image (exit code is ignored)
    docker rmi -f $UNIVERSAL_IMAGE 2>/dev/null || true

    # Build image
    docker build --build-arg gitFullRev="$GITFULLREV" -t $UNIVERSAL_IMAGE .
fi

# Start the CouchDB container
docker run -d -p $COUCHDB_PORT:$COUCHDB_PORT --name couchdb $COUCHDB_IMAGE

# Wait for CouchDB
wget -O /dev/null --retry-connrefused --waitretry=$COUCHDB_HEALTHCHECK_DELAY --read-timeout=20 --timeout=1 --tries=$COUCHDB_HEALTHCHECK_TIMEOUT http://localhost:$COUCHDB_PORT

# Load the CouchDB data
docker run --rm --link couchdb -v $STATIC_DATA_DIR:/static_data -e GPII_STATIC_DATA_DIR=/static_data -v $BUILD_DATA_DIR:/build_data -e GPII_SNAPSET_DATA_DIR=/build_data -e GPII_COUCHDB_URL=$DATALOADER_COUCHDB_URL -e GPII_CLEAR_INDEX=$CLEAR_INDEX $UNIVERSAL_IMAGE $DATALOADER_CMD

# Wait for the CouchDB views become accessible. Accessing the view URL forced the view index to build which take time.
# The URL returns 500 when the index is not ready, so use "--retry-on-http-error" option to continue retries at 500 response code.
wget -O /dev/null --retry-connrefused --waitretry=10 --read-timeout=20 --timeout=1 --tries=30 --retry-on-http-error=500 $COUCHDB_VIEW_URL

# Start the preferences server container
docker run -d -p $GPII_PREFERENCES_PORT:$GPII_PREFERENCES_PORT --name preferences --link couchdb -e NODE_ENV=$GPII_PREFERENCES_CONFIG  -e GPII_PREFERENCESSERVER_LISTEN_PORT=$GPII_PREFERENCES_PORT -e GPII_DATASOURCE_HOSTNAME=$DATASOURCE_HOSTNAME -e GPII_DATASOURCE_PORT=$COUCHDB_PORT $UNIVERSAL_IMAGE

# Wait for the preferences server container to be ready
wget -O /dev/null --retry-connrefused --waitretry=10 --read-timeout=20 --timeout=1 --tries=30 $CARLA_PREFERENCES_URL

# Start the flow manager container (the CBFM)
docker run -d -p $GPII_CLOUD_FLOWMANAGER_PORT:$GPII_CLOUD_FLOWMANAGER_PORT --name flowmanager --link couchdb --link preferences -e NODE_ENV=$GPII_FLOWMANAGER_CONFIG -e GPII_FLOWMANAGER_LISTEN_PORT=$GPII_CLOUD_FLOWMANAGER_PORT -e GPII_DATASOURCE_HOSTNAME=$DATASOURCE_HOSTNAME -e GPII_DATASOURCE_PORT=$COUCHDB_PORT -e GPII_FLOWMANAGER_TO_PREFERENCESSERVER_URL=$GPII_FLOWMANAGER_TO_PREFERENCESSERVER_URL $UNIVERSAL_IMAGE

# Wait for the flow manager container to be ready
wget -O /dev/null --retry-connrefused --waitretry=10 --read-timeout=20 --timeout=1 --tries=30 $GPII_FLOWMANAGER_READY_URL

# Start the container to run production config tests
docker run --name productionConfigTests --link flowmanager --link couchdb -e GPII_CLOUD_URL=$GPII_CLOUD_URL -e GPII_FLOWMANAGER_LISTEN_PORT=$GPII_LOCAL_FLOWMANAGER_PORT -e GPII_COUCHDB_URL=$DATALOADER_COUCHDB_URL $UNIVERSAL_IMAGE $PRODTESTS_CMD
