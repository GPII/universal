## Canopy Match Maker

The Canopy Match Maker is a matchmaker implementing a matching strategy based on the concept of a canopy. The matchmaker depends on a hierarchical ontology for the users preferences. For each user preference, the canopy matchmaker calculates how "deeply" a solution is able to accommodate it. For example, a user preference in some fictive ontology could be "VisualAlternatives.ScreenReader.SpeechSettings.PitchOnCapitals", and a screenreader might be able to support the setting within "VisualAlternatives.ScreenReader.SpeechSettings", but not "PitchOnCapitals" in particular. The general strategy of the Canopy Match Maker is then to, based on how deeply the solution is able to accomodate the user preferences, to calculate a "canopy" of best coverage and select solutions based on that.

### Match Making process used by the canopy matchmaker:

The process matching used by the canopy matchmaker consists of the following steps - some of which are shared by the flat matchmaker.

1. Add the inferred common terms to the preferences set
2. Add information about solution categories