The version of Infusion included in this folder was created using a custom build from the infusion master branch:

https://github.com/fluid-project/infusion/commit/82e259f30ff482feef056fa2a2d4d6c397b7f8a6

commit#: 82e259f30ff482feef056fa2a2d4d6c397b7f8a6

```
    grunt custom --include="tooltip" --exclude="jQuery, framework, normalize" --name="tooltip" --source=true
```

The following directories were stripped out of the build since they contain code that is included in the infusion-tooltip.js file or is not required:

* gpii/node_modules/gpii-oauth2/gpii-oauth2-authz-server/public/lib/infusion/src/components
* gpii/node_modules/gpii-oauth2/gpii-oauth2-authz-server/public/lib/infusion/src/lib/jquery/ui/jQueryUICoreDependencies.json
* gpii/node_modules/gpii-oauth2/gpii-oauth2-authz-server/public/lib/infusion/src/lib/jquery/ui/jQueryUIWidgetsDependencies.json
* gpii/node_modules/gpii-oauth2/gpii-oauth2-authz-server/public/lib/infusion/src/lib/jquery/ui/js/
* gpii/node_modules/gpii-oauth2/gpii-oauth2-authz-server/public/lib/infusion/src/lib/jquery/ui/css/fl-theme-bw
* gpii/node_modules/gpii-oauth2/gpii-oauth2-authz-server/public/lib/infusion/src/lib/jquery/ui/css/fl-theme-by
* gpii/node_modules/gpii-oauth2/gpii-oauth2-authz-server/public/lib/infusion/src/lib/jquery/ui/css/fl-theme-coal
* gpii/node_modules/gpii-oauth2/gpii-oauth2-authz-server/public/lib/infusion/src/lib/jquery/ui/css/fl-theme-dglg
* gpii/node_modules/gpii-oauth2/gpii-oauth2-authz-server/public/lib/infusion/src/lib/jquery/ui/css/fl-theme-hc
* gpii/node_modules/gpii-oauth2/gpii-oauth2-authz-server/public/lib/infusion/src/lib/jquery/ui/css/fl-theme-hci
* gpii/node_modules/gpii-oauth2/gpii-oauth2-authz-server/public/lib/infusion/src/lib/jquery/ui/css/fl-theme-lgdg
* gpii/node_modules/gpii-oauth2/gpii-oauth2-authz-server/public/lib/infusion/src/lib/jquery/ui/css/fl-theme-mist
* gpii/node_modules/gpii-oauth2/gpii-oauth2-authz-server/public/lib/infusion/src/lib/jquery/ui/css/fl-theme-slate
* gpii/node_modules/gpii-oauth2/gpii-oauth2-authz-server/public/lib/infusion/src/lib/jquery/ui/css/fl-theme-wb
* gpii/node_modules/gpii-oauth2/gpii-oauth2-authz-server/public/lib/infusion/src/lib/jquery/ui/css/fl-theme-yb
