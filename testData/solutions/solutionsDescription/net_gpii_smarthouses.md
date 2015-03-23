# Smart House

## Details

* __Name__: Smart House
* __Id__: net.gpii.smarthouses
* __Platform__: Web
* __Contact__: Evgeni Tsakov <etsakov@asteasolutions.com>

## Description
The Smart House Online Simulation is a web application which goal is to investigate the capability of the “auto-personalization from profile” (APfP).

Useful links:

  * [Smart House Online Simulation](https://smarthouse.remex.hdm-stuttgart.de)
  * [Smart House wiki](http://wiki.gpii.net/w/Smart_House_Online_Simulation)

## Integration
The solution is used by the simulation itself to map the common terms in a preferences set to application-specific ones.

## Testing
The Smart House online simulation comes along with a couple of acceptance tests which aim to confirm the correct transformation of common terms. You can also test the simulation online.

### Acceptance tests

Run the acceptance tests located at universal's _tests/platform/cloud/AcceptanceTests_smarthouses.js_

### Smart House Online Testing
The simulation can be tested online. This is the expected behavior

* Open the [Smart House Online Simulation](https://smarthouse.remex.hdm-stuttgart.de)
* Select the __Living room__, then the __Multimedia system__
* Click the __menu__ button on the TV remote
* Click __Sample users__
* In the text field labeled _"My key token"_ enter the name of a preferences set (in this case __sammy__) and press _"Log in"_
* The font size of the TV menu should be set to __24px__ and a __black-white__ high contrast theme should be applied
