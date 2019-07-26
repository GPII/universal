# Data Migration and Verification for GPII-4014 Deployment

The scripts in this directory are used during GPII-4014 deployment to perform the data migration and the data verification afterwards. See [GPII-4014](https://issues.gpii.net/browse/GPII-4014) for deploy details.

## How to use these scripts
Assuming the document IDs for NOVA client credentials are "clientCredential-nova1" and "clientCredential-nova2":

1. migration-step1.js

 Run this script **before** deploying the new universal docker image from the universal root directory. It migrates all client credential documents. An example:
```
node scripts/migration/GPII-4014/migration-step1.js http://localhost:25984/gpii "clientCredential-nova1" "clientCredential-nova2"
```

2. migration-step2.js

 Run this script **after** deploying the new universal docker image from the universal root directory. It updates all "schemaVersion" and "timestampUpdated" values. An example:
```
node scripts/migration/GPII-4014/migration-step2.js http://localhost:25984/gpii
```

3. verify.js

 Run this script **after** the data migration completes. It checks if all documents have been migrated. An example:
```
node scripts/migration/GPII-4014/verify.js http://localhost:25984/gpii "clientCredential-nova1" "clientCredential-nova2"
```
