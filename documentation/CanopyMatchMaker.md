# Canopy Match Maker

The canopy matchmaker uses three different metrics to decide the best configuration of the device
* Explicit priorities from NP set, and implicit priorities from application specific settings
* Canopy matching based on how closely the user's preferences matches the capabilities of a solution.
* Solution types

Broadly, the match making algorithm used by the canopy match maker is as follows:
1. Augmentation of the payload:
    * Add inferred common terms to the preferences set
    * Add information about solution types/categories to each solution
    * Add an ontologized ISO24751 version of the NP set
    * In the ISO-24751 ontology, calculate and add leaves (EL-paths) of preferences and of the capabilities of solutions
3. Decide solution disposition for each context by:
    * Further augment solution entries with priority information:
        * Extract explicit solution priorities from user's NP set
        * Add implicit solution priorities based on the presence of application specific settings in the user NP set
    * Dispose solutions based on priority (see below for more details)
    * For tied solutions, dispose based on canopy matching (see below for more details)

More details are given below on solution types, as well as the two disposition methods used (priority and canopy).

## Solution Types:
To ensure that several conflicting solutions (e.g. two screenreaders) are not launched, "Types" are calculated for each solution, based on the capabilities they have (and in the future, on their explicitly stated types). The inference of solution type based on capabilities is based on the "apptology" tranformation, from the "flat" format into a solution type ontology. In the matchmaking process, each time a solution is 'accepted', any other conflicting solutions (i.e. of the same type) will be rejected.

The apptology is described in more details here: [Apptology.md](Apptology.md).

## Disposing from prioriy:
Explicit priorities are declared in the NP sets metadata section and will always be a floating point value of 1024 or more. Implicit priorities are deduced from application specific settings. When a user has application specific settings for a solution a priority of 512 is set for that solution.

Goes through all solutions from high priority to low. If a solution already has a disposition, it is ignored. Else it will be selected (accepted). Any solution with the same type, but a lower priority (or no priority) will be rejected. If there are two or more solutions of the same priority _and_ the same type (even partly), these will be considered a "tie". All lower-priority solutions of this type will still be rejected. The tied solutions will have their current disposition and priority removed and left to be disposed by some other disposal algorithm.

## Disposing from Canopy
The Canopy matching strategy is used for deciding how to dispose solutions in case no priorities are available or there is a priority-tie between two applications of the same type. 

* The canopy approach is based on a vectorial "fitness measure" of a solution plus a lexicographical ordering
* It is similar to the strategy used in resolving CSS rules.
* It depends on a hierarchical ontology for the user's preferences (and solution capability).

 For each user preference, we calculate how "deeply" a solution is able to accommodate it - i.e. a "prefix-depth". For example, a user preference in some fictive ontology could be "VisualAlternatives.ScreenReader.SpeechSettings.PitchOnCapitals", and a screenreader might be able to support some settings within "VisualAlternatives.ScreenReader.SpeechSettings", but not "PitchOnCapitals" in particular. So for this particular preference, the solution matches with a prefix-depth of -1 (falls 1 short of fully matching the preference el-path). The general strategy of the Canopy Match Maker is then, based on how deeply the solution is able to accomodate each of the user preferences, to calculate a "canopy" of best coverage and select solutions based on that.

### The canopy algorithm:
*Calculating fitness vector for a solution*
* Convert user preferences to leaves (array of el-paths)
* Compute capabilities of solution
* Compute vector of prefix depths for each leaf el path from NP set
* Sort vector in descending order of fitness ("fitness vector")
* Rank solutions by fitness using lexicographic ordering 

*The canopy matching*
* Compute fitness vectors for each solution and sort in rank order
* Initialise “canopy” giving value –Infinity to each profile leaf path
* For each solution, “raise the canopy” by setting the canopy value to the maximum of its old value and solution value
  * For each solution which “raised the canopy” at any leaf, accept it. Reject any solution of the same type.
  * For each solution which did not raise the canopy, reject it


