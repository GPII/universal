== TODO and notes:
What should be the structure of the documentation - keep it at root level


##TODOs:
1. Flat MM remaining:
    * Flat MM doesn't work for application specific settings (in particular empty blocks)
    * Write tests
    * Write documentation for the Flat MM

* What format should the online flowmanager expect as input, and what should it shoot as output **LEAVE AS IS -- leave a note in the documentation that the payloads are simplified/legacy purposes - and that in the future we could easily imagine that users would want the context information**
* Which of the following should be implemented for the new MM framework to make it in:
    - Non-hardcoded context evaluator **no**
    - /contextChanged URL support **no**
    - Sending of PCP settings to PCP **no**
    - canopy matchmaker **leave it with it's own testcases**
    - Configs cleanup **do a bit of cleaning - dont delete - just do "this is untrusted and most likely broken" txt files for each**
        + All local installed, except for RB/ST MM
        + Local cloudBased
        + all local installed, remote prefs server
        + all local cloudBased, remote prefs server
        + prefs server standalone
    - support for http://registry.gpii.net/applications/some.app.id/setting8 style settings **ignore for now**
    - Lifecycle support for "active: [boolean]" **wait with this one**
    - Flat MM support for PCP info **wait with this one**
* What to do with update **https://code.stypi.com/kaspermarkus/MM%20stuff/MM%20Output.js l 22-35 style**
* Document how to start up the system in all local and cloudbased FM mode

* Check at solution registry stadig fungerer som server - at queries virker
* slet matchmaker folder helt
* Get the canopy matchmaker working again
* Code comments/review changes
* JSONlint/JShint
* Make sure all the tests are added to the all-tests file (both node+web)
* Consider adding event descriptions for all components - ie. list all the events and tell when they are fired
* Clean up configs
* Ensure top-level cloud based configs
* get remaining tests working:
    - update
2. Copy over and ensure that canopy MM tests are still passing
3. Add readme on canopy MM

* Implement the context evaluation proper
* Implement the sending of PCP stuff to PCP
* Describe flow for changed context
* Describe flow for update to/from PCP
* Ensure that the solution id in capabilities blocks is no longer a requirement for the flat MM
* Ensure that "save" works in cloudbased mode
* Profile code to make sure there arent unused functions
* Support for the http://registry.gpii.net/applications/some.app.id/setting8 conversion into opague blocks (or vice versa)

##Changes to the original proposal
* inverseCapabilities block has been **renamed to inferredCommonTerms** and will be **indexed by context**, then application id
* Solution registry keyed by ID - including in the payloads sent to the MM.

##Major framework changes:
* Solutions registry keyed by solution id. solution id variable removed from the entry
* All transformations in the solutionsregistry changed to flat

andet mm:
for pcp evt lav markering i ontologien for at vide hvilke indstillinger der er vitale. 




