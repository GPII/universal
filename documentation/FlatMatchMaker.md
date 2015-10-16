##Flat Matchmaker

### Motivation and Description
This is a very simple reference matchmaker written by the architecture team when building the initial architecture. It was created to ensure that the framework was able to support the various aspects of the matchmaking process, to make available some potentially more globally useful functionality to the matchmaker teams, have a base matchmaker that could be used while the development of the more sophisticated matchmakers was being done. 

###Handling of inferred common terms
The origin of the inferred common terms are ignored - instead they are all merged together and then added to the set of user preferences. If an inferred common term duplicates an already existing common term in the preference set, the origin (non-inferred) value is used. Similarly, if the same common terms appears in several places in the inferred common terms section, the value of the first occurrence of the common term will be used.

###Selection of solutions to configure and launch
This involves four steps:

1. Finding the leaves of all the (common term) preferences - 'leaves' meaning all the keys of the preferences set that holds a primitive as it's value.

2. Finding all the capabilities of the solutions on the machine. The capabilities are taken from two sources, both part of the solutions registry entry of each solution:
    * Those explicitly expressed in the solution entry's `capabilitities` block
    * The input-paths, as calculated from the solution entry's `capabilitiesTransformations` block.

3. Knowing what preferences the user has (in common terms) and what capabilities each solution has, the flat matchmaker now simply selects those solutions that have a cabability matching a user preference.

4. To this set of solutions is added any solution present on the device for which the user has application-specific preferences.
