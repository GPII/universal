== TODO and notes:





##TODOs:
* Get inferredSettings tests working again
* 3) Finalize flow of the components - then start writing tests
* Write tests for the flat MM
* Flat MM: supplement preferences with the ones inverse
* flat MM: Write documentation for the Flat MM
* Currently matchmakerframework is a kettle app... it shouldn't have to be but seems to be misbehaving if not on callbacks when getting solutions  registry entry. -- or should it? Same with LFM
* Check at solution registry stadig fungerer som server - at queries virker
* Move MM utilities fil et andet sted hen
* slet matchmkaser folder helt
* Flat MM doesn't work for application specific settings (in particular empty blocks)
* Support for the http://registry.gpii.net/applications/some.app.id/setting8 conversion into opague blocks (or vice versa)
* Meta data sections - kommer de hen hvor de skal?
* Get the canopy matchmaker working again
* Copy over copyrights from documents - currently original authors are not there
* Get the cloudbased flow manager and related process to work
* check and remove duplicate components and odd refs between flowmanger files (in particular check lifecycle manager and context manager)
* Fix events/listeners in general
* Describe flow for user login
* Describe flow for user logout
* Describe flow for changed context
* Describe flow for update to/from PCP
* Profile code to make sure there arent unused functions
* Remove relevant parts of the MM utilities file to the MM framework
* Code comments
* JSONlint/JShint
* review code
* Make sure all the tests are added to the all-tests file (both node+web)
* Consider adding event descriptions for all components - ie. list all the events and tell when they are fired
* Implement the context evaluation proper

##Changes to the original proposal
* inverseCapabilities block has been **renamed to inferredCommonTerms** and will be **indexed by context**, then application id
* Solution registry keyed by ID - including in the payloads sent to the MM.

##Major framework changes:
* Solutions registry keyed by solution id. solution id variable removed from the entry
* All transformations in the solutionsregistry changed to flat





