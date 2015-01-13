The version of Infusion included in this folder was created using a custom build from the infusion master branch:

https://github.com/fluid-project/infusion/commit/df5f8cfabf815a4086b778e73125c3c952dda4ec

commit#: df5f8cfabf815a4086b778e73125c3c952dda4ec

```
    grunt custom --include="tooltip" --exclude="jQuery, framework, normalize" --name="tooltip" --source=true
```

The following directories were stripped out of the build since they contain code that is included in the infusion-tooltip.js file or is not required:

* gpii/node_modules/gpii-oauth2/gpii-oauth2-authz-server/public/lib/infusion/src/components
* gpii/node_modules/gpii-oauth2/gpii-oauth2-authz-server/public/lib/infusion/src/lib/jquery/ui/jQueryUICoreDependencies.json
* gpii/node_modules/gpii-oauth2/gpii-oauth2-authz-server/public/lib/infusion/src/lib/jquery/ui/jQueryUIWidgetsDependencies.json
* gpii/node_modules/gpii-oauth2/gpii-oauth2-authz-server/public/lib/infusion/src/lib/jquery/ui/js/
