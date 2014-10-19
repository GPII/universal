##TODOs:
* Tell antranig to:
** Add the integration tests to all-tests.json

* Tell alex that things should be working again now
** Fix issue for Alex

* Check whether flat MM tests can run in browser again
* inverseCapabilities as browser tests
** move flat MM to the MMFramework folder
    - And get everything to pass and run again
* Merge GPII-784 with GPII-941 and get tests to pass again
* Why am i sticking the solutionsRegistry onto the request (see login function of the MM)
* JSONlint/JShint
* Do pull request for GPII-941

* implement the stuff for Guillem

##Todo round 2+
* Configs cleanup
    - all local installed, remote prefs server
    - all local cloudBased, remote prefs server
    - prefs server standalone
* support for http://registry.gpii.net/applications/some.app.id/setting8 style settings
* Lifecycle support for "active: [boolean]"
    - Update all payloads
    - Split up lifecycle actions into launch/settings separation, add update and detect whether app is running sections
* Flat MM support for PCP info
* Check at solution registry stadig fungerer som server - at queries virker
* Implement the context evaluation proper
   - /contextChanged URL support
* Implement the sending of PCP stuff to PCP
* Describe flow for changed context
* Describe flow for update to/from PCP
* Ensure that the solution id in capabilities blocks is no longer a requirement for the flat MM
* Profile code to make sure there arent unused functions
* Consider adding event descriptions for all components - ie. list all the events and tell when they are fired

##Changes to the original proposal
* inverseCapabilities block has been **renamed to inferredCommonTerms** and will be **indexed by context**, then application id
* Solution registry keyed by ID - including in the payloads sent to the MM.

##Major framework changes:
* Solutions registry keyed by solution id. solution id variable removed from the entry
* All transformations in the solutionsregistry changed to flat

andet mm:
for pcp evt lav markering i ontologien for at vide hvilke indstillinger der er vitale. 




