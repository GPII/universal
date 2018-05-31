# Canopy Match Maker

The canopy matchmaker uses three different metrics to decide the best configuration of the device
* Explicit priorities from preference set, and implicit priorities from application specific settings
* Canopy matching based on how closely the user's preferences matches the capabilities of a solution.
* Solution types

Broadly, the match making algorithm used by the canopy match maker is as follows:
1. Augmentation of the payload:
    * Add inferred common terms to the preference set
    * Add information about solution types/categories to each solution
    * Add an ontologized ISO24751 version of the preference set
    * In the ISO-24751 ontology, calculate and add leaves (EL-paths) of preferences and of the capabilities of solutions
3. Decide solution disposition for each context by:
    * Further augment solution entries with priority information:
        * Extract explicit solution priorities from user's preference set
        * Add implicit solution priorities based on the presence of application specific settings in the user preference set
    * Dispose solutions based on priority (see below for more details)
    * For tied solutions, dispose based on canopy matching (see below for more details)

More details are given below on solution types, as well as the two disposition methods used (priority and canopy).

## Solution Types:
To avoid that two conflicting solutions of the same time are run, the canopy matchmaker uses Solution Types, as described in [Match Maker Framework](MatchMakerFramework.md) under the section on utilities and concepts.

## Disposing from priority:
If the user explicitly or implicitly has specified priorities in terms of applications, this will be used to select the relevant solutions. Priorities can be inferred from application specific settings, or they can be explicitly stated by the user. More information on disposition from priority can be found in [Match Maker Framework](MatchMakerFramework.md) under the utilities and concepts section.

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
* Compute vector of prefix depths for each leaf el path from preference set
* Sort vector in descending order of fitness ("fitness vector")
* Rank solutions by fitness using lexicographic ordering

*The canopy matching*
* Compute fitness vectors for each solution and sort in rank order
* Initialise “canopy” giving value –Infinity to each profile leaf path
* For each solution, “raise the canopy” by setting the canopy value to the maximum of its old value and solution value
  * For each solution which “raised the canopy” at any leaf, accept it. Reject any solution of the same type.
  * For each solution which did not raise the canopy, reject it
