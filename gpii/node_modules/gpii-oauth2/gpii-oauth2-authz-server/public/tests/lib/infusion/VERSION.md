The version of Infusion included in this folder was created by copying the infusion master branch:

https://github.com/fluid-project/infusion/commit/df5f8cfabf815a4086b778e73125c3c952dda4ec

commit#: df5f8cfabf815a4086b778e73125c3c952dda4ec

After the copy, the following actions were performed:

1. In the root directory, only keep this sub-directory:

* tests/

2. In the tests/ directory, the following directories were stripped out of the copy since they contain code that is not required or is included in node_modules/infusion or gpii/node_modules/gpii-oauth2/gpii-oauth2-authz-server/public/lib/infusion:

* tests/all-tests.html
* tests/component-tests/
* tests/framework-tests/
* tests/lib/jQuery-LICENSE.txt
* tests/lib/qunit
* tests/lib/README
* tests/manual-tests/
* tests/node-tests/
* tests/test-core/

