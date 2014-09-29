== TODO and notes:





##TODOs:
* URL /token doesn't work
* get remaining tests workign:
    - Save
    - update
    - token
Flat MM remaining:
* Flat MM doesn't work for application specific settings (in particular empty blocks)
* Write tests
* supplement preferences with the ones inverse
* Write documentation for the Flat MM

* Check at solution registry stadig fungerer som server - at queries virker
* slet matchmkaser folder helt
* Support for the http://registry.gpii.net/applications/some.app.id/setting8 conversion into opague blocks (or vice versa)
* Meta data sections - kommer de hen hvor de skal?
* Get the canopy matchmaker working again
* Copy over copyrights from documents - currently original authors are not there
* check and remove duplicate components and odd refs between flowmanger files (in particular check lifecycle manager and context manager)
* Describe flow for changed context
* Describe flow for update to/from PCP
* Profile code to make sure there arent unused functions
* Code comments
* JSONlint/JShint
* review code
* Make sure all the tests are added to the all-tests file (both node+web)
* Consider adding event descriptions for all components - ie. list all the events and tell when they are fired
* Implement the context evaluation proper
* Implement the sending of PCP stuff to PCP
* Ensure that the solution id in capabilities blocks is no longer a requirement for the flat MM


##Changes to the original proposal
* inverseCapabilities block has been **renamed to inferredCommonTerms** and will be **indexed by context**, then application id
* Solution registry keyed by ID - including in the payloads sent to the MM.

##Major framework changes:
* Solutions registry keyed by solution id. solution id variable removed from the entry
* All transformations in the solutionsregistry changed to flat
* 




