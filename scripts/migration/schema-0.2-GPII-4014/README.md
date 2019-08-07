# Data Migration and Verification for GPII-4014 Deployment

The scripts in this directory are used during GPII-4014 deployment to perform the data migration and the data verification afterwards. See [GPII-4014](https://issues.gpii.net/browse/schema-0.2-GPII-4014) for deploy details.

## How to use these scripts

### Scripts for testing

1. createSimulatedGpiiKeys.js

 This script creates simulated GPII keys and their corresponding prefs safes in schema version 0.1 format. It
 creates documents in batches of a given number. For example, for creating 1000 GPII keys in batches of 100, this
 script will generate 100 new GPII keys and their corresponding prefs safes each time to send to CouchDB /_bulk_docs
 to create. This is to avoid the potential memory overflow at creating a large number of GPII keys in one shot. An example to create 50K GPII keys in batches of 50:
 ```
 node scripts/migration/schema-0.2-GPII-4014/createGpiiKeys.js http://localhost:25984 50000 50
 ```

### Scripts for deployment

Assuming the document IDs for NOVA client credentials are "clientCredential-nova1" and "clientCredential-nova2":

1. migration-step1.js

 Run this script **before** deploying the new universal docker image from the universal root directory. It migrates all client credential documents. An example:
```
node scripts/migration/schema-0.2-GPII-4014/migration-step1.js http://localhost:25984 "clientCredential-nova1" "clientCredential-nova2"
```

2. migration-step2.js

 Run this script **after** deploying the new universal docker image from the universal root directory. It updates all "schemaVersion" and "timestampUpdated" values. An example:
```
node scripts/migration/schema-0.2-GPII-4014/migration-step2.js http://localhost:25984
```

3. verify.js

 Run this script **after** the data migration completes. It checks if all documents have been migrated. An example:
```
node scripts/migration/schema-0.2-GPII-4014/verify.js http://localhost:25984 "clientCredential-nova1" "clientCredential-nova2"
```
