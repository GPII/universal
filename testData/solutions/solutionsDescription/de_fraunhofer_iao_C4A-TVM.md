# Ticket Vending Machine (TVM)

## Details

* __Name__: Ticket Vending Machine
* __Id__: de.fraunhofer.iao.C4A-TVM
* __Platform__: Web
* __Contact__: Jasmin Link <Jasmin.Link@iao.fraunhofxx.de>

## Description
The _Cloud4all Ticket Vending Machine_ is a piece of software designed to run on a physical ticket vending machine.
Internally, it is a web site that runs on Microsoft Internet Information Services (IIS).
The back end connects to the Online Flow Manager instead of relying on a locally installed GPII real-time framework, which is why the platform of the application is not "Windows" but "Web".

The application supports six application-specific terms; see the description in the [spreadsheet with settings for the SP3 solutios](https://docs.google.com/spreadsheets/d/1uaZV4mBze4udTlEikT30ApmE7CaO46eM0GLT0HVUESg/edit#gid=37) (check the TVM tab).


## Integration
The application-specific terms that map to common terms are covered by transformers; these transformers have unit tests (see below). 
The application has its own settings handler to deal with the payload returned by the Online Flow Manager.


## Testing
The Ticket Vending machine comes along with a few acceptance tests that aim to verify the correct transformation of common terms. 
There is also an acceptance test that uses only application-specific terms (see the preference set tvm_applicationSpecific_01).

### Acceptance tests

Run the acceptance tests located at universal's _tests/platform/cloud/AcceptanceTests_tvm.js_

### Integration Testing

As mentioned above, a preference set containing only application-specific terms is available at universal's _testData/preferences/tvm_applicationSpecific_01.json_.

However, at this point in time, the ticket vending machine can only be tested by Fraunhofer IAO.

