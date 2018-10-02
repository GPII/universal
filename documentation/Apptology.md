# The Apptology

To allow [the flat matchmaker](./FlatMatchMaker.md) to distinguish what type of application a solution is (and hence
avoid launching two of the same types of applications), the Apptology was introduced.

The apptology is an ontology that expresses what type of application a solution is (or what principal roles a solution
is to fullfil), such as "screenReader", "magnifier", etc. There is nothing in the apptology preventing a solution from
being of multiple types (e.g. both a screenreader and magnifier).

The file that defines the mapping between the application type and common terms is located at
[flat-apptology.json5](../testData/ontologies/mappings/flat-apptology.json5).

Note that while the apptology can be used to describe any type or capability of a solution, it should only be used to
express mutually exclusive application types. So, for example, it only makes sense that a single screenreader is running
on the system at any given time, whereas it is ok for multiple text-editors to be running on the system at the same
time. The reason for this is that the flat matchmaker uses the apptology to decide which applications to launch on the
system, or more specifically, when two solutions are conflicting in their capabilities/roles and only one should be
launched. A more detailed description of the Flat Matchmaker flow can be found here: [Flat Matchmaker
Documentation](FlatMatchMaker.md).

There are several known and serious issues with the apptology and its current usage, amongst others that it doesn't
express how to turn on and off certain features of a solution, which could affect its role (or solution type) - such as
turning off the voice in a combined screenreader/magnifier. The issues are described in this JIRA:
[GPII-1998](https://issues.gpii.net/browse/GPII-1998)
