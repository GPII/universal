##Flat Match Maker

### Motivation and Description
This is a very simple reference matchmaker written by the architecture team when building the initial architecture. It was created to ensure that the framework was able to support the various aspects of the matchmaking process, to make available some potentially more globally useful functionality to the match maker teams, have a base matchmaker that could be used while the development of the more sophisticated matchmakers was being done.

###Handling of inferred common terms

The origin of the inferred common terms are ignored - instead they are all merged together and then added to the set of user preferences. If an inferred common term duplicates an already existing common term in the preference set, the origin (non-inferred) value is used. Similarly, if the same common terms appears in several places in the inferred common terms section, the value of the first occurrence of the common term will be used.