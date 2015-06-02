##Transformer

### Description
The transformer component of the core framework is a supportive component for the fluid.infusions transformation capabilities. It is responsible for supporting transformations in the core framework that aren't directly achievable using the Infusion transformation framework.

The responsibilities worth highlighting for this component are:

### Translation from matchmaker output to lifecycle manager input
One of the functionalities of the transformer is to translate from the matchmaker/context manager output into the format required by the lifecycle manager. For this the function `gpii.transformer.toLifecycleFormat` should be used. See detailed documentation in code comments.

### Regular transformation functions
The transformer also contains useful transformation functions that do not qualify to become part of the general Infusion framework but are useful for GPII. These are:

* `gpii.transformer.quantize` as described here: [http://wiki.gpii.net/w/Architecture_-_Available_transformation_functions#Mapping_a_continuous_range_into_discrete_values_.28gpii.transformer.quantize.29](http://wiki.gpii.net/w/Architecture_-_Available_transformation_functions#Mapping_a_continuous_range_into_discrete_values_.28gpii.transformer.quantize.29)
