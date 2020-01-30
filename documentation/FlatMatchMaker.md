# Flat Matchmaker

## Motivation and Description

This is a very simple reference matchmaker written by the architecture team when building the initial architecture. It
was created to ensure that the framework was able to support the various aspects of the matchmaking process, to make
available some potentially more globally useful functionality to the matchmaker teams, have a base matchmaker that could
be used while the development of the more sophisticated matchmakers was being done.

## Selection of solutions to configure and launch

This involves four steps:

1. Finding the leaves of all the (common term) preferences - 'leaves' meaning all the keys of the preference set that
   holds a primitive as it's value.
2. Finding all the capabilities of the solutions on the machine. The capabilities are taken from two sources, both part
   of the solutions registry entry of each solution:
    * Those explicitly expressed in the solution entry's `capabilitities` block
    * The input-paths, as calculated from the solution entry's `capabilitiesTransformations` block.
3. Knowing what preferences the user has (in common terms) and what capabilities each solution has, the flat matchmaker
   now simply selects those solutions that have a capability matching a user preference.
4. Any solution present on the device for which the user has application-specific preferences is added.
5. Apply [Apptology](Apptology.md) to select only one solution from each solution type.
