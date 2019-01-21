# GPII Data Model

GPII uses CouchDB to store data in JSON documents when GPII runs in the production configuration. In development
configuration, CouchDB-compatible PouchDB is used for the data storage.

The two GPII components that read and write data from the data storage are Preferences Server and Authorization Server.

The details of the GPII data model can be found [here](https://wiki.gpii.net/w/Keys,_KeyTokens,_and_Preferences).

## Preference Safes Overview

In this section we discuss the CouchDB documents for all the data associated with a users preferences safe. This
includes their preference sets, keys, full login credentials, and a minimal amount of metadata for the user,
such as name and email.  Currently, this consists of three document types: `prefsSafe`, `gpiiKey`,
`gpiiCloudSafeCredential`.

### Preference Safes

Preference Safes consist of a single primary document of type `prefsSafe`. These contain some optional metadata such
as `name` and `email`, and the `preferences` section which contains the users preference sets. This is the central
document for a safe, any documents relating to a safe should have a property `prefsSafeId` which contains the id of
the preferences safe.

An example document:

```json
    {
        "_id": "prefsSafe-7",
        "type": "prefsSafe",
        "schemaVersion": "0.1",
        "prefsSafeType": "user",
        "name": null,
        "email": null,
        "preferences": {
            "flat": {
                "name": "bit of stuff",
                "contexts": {
                    "gpii-default": {
                        "name": "Default preferences",
                        "preferences": {
                            "http://registry.gpii.net/common/onScreenKeyboard/enabled": true
                        },
                        "metadata": []
                    }
                },
                "metadata": []
            }
        },
        "timestampCreated": "2017-12-14T19:55:11.641Z",
        "timestampUpdated": null
    }
```

### Key-in Documents

When users key-in to the GPII using a USB stick, NFC card, or other mechanism, the unique `gpiiKey` on the device will
be matched to the CouchDB `_id` on a document with type `gpiiKey`. This document contains the important fields `prefsSafeId`
and `prefsSetId` linking it to the safe, and to a specific preference set within that safe to key in with.

An example document:

```json
    {
        "_id": "np_tiny",
        "type": "gpiiKey",
        "schemaVersion": "0.1",
        "prefsSafeId": "prefsSafe-7",
        "prefsSetId": "gpii-default",
        "revoked": false,
        "revokedReason": null,
        "timestampCreated": "2017-12-14T19:55:11.641Z",
        "timestampUpdated": null,
        "timestampRevoked": null
    }
```

### Login Documents

In order to have full permissions to edit all aspects of their preferences safe, users must login to their safe using a
username and password. The current implementation of this is backed by the `gpii-express-user` library which creates
records in the same format as native CouchDB accounts and manages password hashing, unlocking, etc.  In order to avoid
making changes to this external library, we introduce a document type 'gpiiCloudSafeCredential' which tracks the native
record that is created by `gpii-express-user`. Note that the `gpiiExpressuserId` entries are prefixed with `org.couch.db.user:`
which is the convention for both internal CouchDB users and users created with gpii-express-user.

An example document:

```json
    {
        "_id": "8f3085a7-b65b-4648-9a78-8ac7de766997",
        "type": "gpiiCloudSafeCredential",
        "schemaVersion": "0.1",
        "prefsSafeId": "prefsSafe-7",
        "gpiiExpressUserId": "org.couch.db.user:prefs7user"
    }
```

For reference, the internal account record for the above looks as follows:

```json
    {
        "_id": "org.couch.db.user:prefs7user",
        "name": "prefs7user",
        "type": "user",
        "email": null,
        "roles": [],
        "username": "prefs7user",
        "verified": true,
        "iterations": 10,
        "password_scheme": "pbkdf2",
        "salt": "7cf6961e6ded3bd25732e5466512d116bf9908ba9629d4ed060a03a965e5341d",
        "derived_key": "e8bd265e7d82fd0f662e9ddaaf2e75acb294da1b",
        "verification_code": "618fa72aa62af282704b556e34957a79"
    }
```

`gpii-express-user` handles the lookup of unique names when attempting to unlock a user with a password.
This means that in the above example, the login username for preferences safe `prefsSafe-7` would be `prefs7user`.
This also means that it could be possible for a preferences safe to have more than one `gpiiCloudSafeCredential`
similar to how it can have more than one `gpiiKey`. This allows flexibility for the addition, management, and revokation
of key-in and log-in methods.

### Future Document Types

In the future we may add additional document types, or sub-types for other features such as CAS or single sign-on
authentication. For any documents that add information to a preferences safe, the most important thing is that they
have a `prefsSafeId` attribute. In general, we want to avoid having documents several linkages away from the primary
preferences safe document. In the case of `gpii-express-user` above we have 1 extra hop to avoid modifying the external
library, but in general, the document relations should be kept as simple as possible.
