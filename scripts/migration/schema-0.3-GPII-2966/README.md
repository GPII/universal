# Data Migration and Verification for GPII-2966 Deployment

This directory contains the data migration for GPII-2966. This migration is not required
for operation, but removes a now unused field. (for current and future use). That field is
the `password` field on `prefsSafe` document types. At the time of writing, this field
should most likely be `null` throughout the database given it was never exercised by any
code.

## Scripts for testing

1. createSimulatedGpiiKeys.js

    This script creates simulated GPII keys and their corresponding prefs safes in schema version 0.1 format. It
    creates documents in batches of a given number. For example, for creating 1000 GPII keys in batches of 100, this
    script will generate 100 new GPII keys and their corresponding prefs safes each time to send to CouchDB /_bulk_docs
    to create. This is to avoid the potential memory overflow at creating a large number of GPII keys in one shot. An example to create 50K GPII keys in batches of 50:
    ```
    node scripts/migration/schema-0.3-GPII-2966/createSimulatedGpiiKeys.js http://localhost:25984 50000 50
    ```

## Scripts for deployment

1. migration-step1.js

    Run this script **before** deploying the new universal docker image from the universal root directory. Removes the
    `password` field from preference safes.. An example:
    ```
    node scripts/migration/schema-0.3-GPII-2966/migration-step1.js http://localhost:25984
    ```

2. migration-step2.js

    Run this script **after** deploying the new universal docker image from the universal root directory.
    Updates the `schemaVersion` of all documents in the database to 0.3 and touches the `timestampUpdated`
    value.
    ```
    node scripts/migration/schema-0.3-GPII-2966/migration-step2.js http://localhost:25984 5000
    ```

3. verify.js

    Run this script **after** the data migration completes. It checks if all documents have been migrated. An example of verifying
    in batches of 5000 documents in one batch:
    ```
    node scripts/migration/schema-0.3-GPII-2966/verify.js http://localhost:25984 5000
    ```
