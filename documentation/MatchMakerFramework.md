# Matchmaker Framework

The matchmaker framework is a component and a set of utitilities that can run either locally or remotely depending on
the configuration. Together with the actual matchmaker, it is respnosible for deciding how the users device should be
configured based on their preferences, current context and the solution registry data. More specifically, the matchmaker
framework has the following responsibility:

* Doing the preprocessing - that is, preparing and augmenting the input payload for the specific matchmaker
* Making the decision of which matchmaker to call, and then call that matchmaker (for example the
  [Flat MatchMaker](FlatMatchMaker.md))
* Doing the post-processing - that is, taking the return payload from the matchmakers, parse it and pass it on in the
  login (or other) flow.
* Generally providing utilities that can be used by matchmaker implementations.

## Configuration

The matchmaker framework itself is not a Kettle app, but it expect at least matchmaker implementation to be available on
a URL. The available matchmaker implementation should be provided in the options block under a `matchMakers` directive.
Here, matchmaker implementation can be listed by some identifier (key) and an object with a `{ url: "SOME URL" }` object
each. For example the options of having two matchmakers available, where the default one will be on port 8081 will be
done like:

```json
{
    "type": "my.matchmakerframework.config",
    "options": {
        "distributeOptions": {
            "untrusted.development.matchMakers": {
                "record": {
                    "default": {
                        "url": "http://localhost:8081"
                    },
                    "otherMM": {
                        "url": "http://localhost:8084"
                    }
                },
                "target": "{that flowManager}.options.matchMakers"
            }
        }
    }
}

```

## Detailed Description:

### Main steps of the matchMaker frameworks matching process

1. The matchmaking process is triggered by the `processMatch` event of the FlowManager. The actual matchmaking flow is
   dictated by a combination of the priorities in `gpii.flowmanager.processmatch.priorities`, and the `processMatch`
   listeners (which are different depending on whether the system runs in trusted or untrusted mode)
* Preprocess:
  * Triggered when the initial data has been collected (preferences, context, solution registry entries, etc)
  * Augments the MatchMaker input with inferred common terms (see under important utilities/functions in this document)
  * TODO: _Full solutions registry is currently being used when inferring common terms. This is because the users
    preference set might contain e.g. Linux app preferences, even if the user is logging into a windows box. We then
    need the linux solutions registry entries to get information (if available) about how to transform the linux app
    preferences into common terms (that in turn can be translated into app settings for windows)._
* matchMakerDispatcher:
  * Sends the matchmaker input data to the actual matchmaker. _While there is functionality in place for allowing
    multiple matchmakers, the system is currently hardcoded to use the “default” one, which is the Flat matchmaker in
    all the default configs_.
  * A promise is returned, which will contain the original matchmaker input along with the response from the matchmaker
    in a block keyed by `matchMakerOutput`.
  * The return payload is built in: `gpii.matchMakerFramework.utils.buildReturnPayload`

### Important utilities and concepts in the MatchMaker Framework

**The Flat Matchmaker**: While this is not part of the matchmaker framework, it is important to mention the Flat
MatchMaker, which is an (the only) implementation of a matchmaker, which uses most of the utilities described in this
document. It is described in details here:
[https://github.com/GPII/universal/blob/master/documentation/FlatMatchMaker.md](./FlatMatchMaker.md)

**Solution Types**: To ensure that several conflicting solutions (e.g. two screenreaders) are not launched, "Types" can
be calculated for each solution, based on the capabilities they have (and in the future, on their explicitly stated
types). The inference of solution type based on capabilities is based on the "apptology" tranformation, from the "flat"
format into a solution type ontology. In the matchmaking process, each time a solution is 'accepted', any other
conflicting solutions (i.e. of the same type) will be rejected. Adding solution type information can be done via the
`gpii.matchMakerFramework.utils.addSolutionTypeInformation` function.

The apptology is described in more details here: [Apptology.md](Apptology.md).

**Common Term Inference**: If the solution registry entry for a solution has an `inverseCapabilitiesTransformations`
block specified, or does not have a `capabilitiesTransformations` (in which case, the system attempts to automatically
calculate the inverses), the matchmaker framework can infer common terms from application specific settings. This
means, that if the user has application specific settings for e.g. windows magnifier, the equivalent common term
preferences can be inferred and used in the matchmaking process (e.g. finding the relevant settings for the linux
magnifier). The inference happens via the `gpii.matchMakerFramework.utils.inferCommonTerms` function, and if these
should be merged with an preference set, this can be done via the
`gpii.matchMakerFramework.utils.addInferredCommonTerms` function. It is worth stressing two things: The use of inferred
common terms is not mandatory in a matchmaking flow, but available via the above functions, and something which _is_
being used in the flat matchmaker. Secondly, there is no metadata generated saying that the common terms are
inferred, meaning that once added to an preference set, the matchmaker has no way of knowing whether the term was
originally in the preference set or was inferred.

Also, hte full solutions registry is currently being used when inferring common terms. This is because the users
preference set might contain e.g. Linux app preferences, even if the user is logging into a windows box. We then need
the linux solutions registry entries to get information (if available) about how to transform the linux app preferences
into common terms (that in turn can be translated into app settings for windows). This should be changed into a more
dynamically loaded solution registry fetching based on the users application settings, once the solutions registry has
been turned into a queriable service.

**gpii.matchmakerframework.utils.disposeSolution:** In many ways the “Heart” of the matchmaking process. It is
responsible for adding priorities, augmenting the solution and preference data and finally passing it to some
disposition (matchmaker) strategy that is passed as a parameter. In more details the following happens:

1. The solutions are run through `gpii.matchMakerFramework.utils.expandSolutions` augmenting them to, besides the
   original solution registry data, a skeleton of the solutions capabilities is built is built - i.e. a hierarchical
   object matching the solutions capabilities.
2. Next solution priorities are added to each solution according to application settings via
   `gpii.matchMakerFramework.utils.expandSolutions`. That is, if a user has any application settings the solution is
   considered to have a priority of 512.
3. Following this, explicit priorities of the users preference set is added to each solution. That is, if a user has
   application priorities in their metadata, this is added. These values will always be above 1024, and hence take priority
   (overwrite) the implicit priorities from the step above.
4. A leaves structure of the preferences is calculated in the `gpii.matchMakerFramework.utils.computeLeaves` function.
   This is a structure with a key for each preference in an EL-path format and a value of true. This, in conjunction with
   the solutions skeleton is useful for looking up matches via fluids' getPath functionality.
5. Once all this data has been prepared, the information is sent to the strategy (e.g. flat MatchMakers algorithm)
6. Finally a disposition is assigned to each solution based on the output of the strategy.

**Preference filtering:** When using a the untrusted flowmanager, security dictates that no "irrelevant" or unnused
preferences of settings should be sent to the local device. Since the users preference set does need to be sent to the
local device for use in the PSP, a filtering needs to happen, to ensure that the only settings reaching the local
device are those that have been used to configure the device. This filtering can be done using the
`gpii.matchMakerFramework.utils.filterPreferencesForSolution` function.

**matchMakerDispatcher:** Sends the matchmaker input data to the actual matchmaker. While there is functionality in
place for allowing multiple matchmakers, the system is currently hardcoded to use the “default” one, which is the
Flat matchmaker.

A promise is returned, which will contain the original matchmaker input along with the matchmaker response in a block
keyed by matchMakerOutput

The dispatching happens in the function `gpii.matchMakerFramework.matchMakerDispatcher`.
