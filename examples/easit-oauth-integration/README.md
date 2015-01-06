This directory contains configuration and driver files for the EASIT4ALL OAuth 2
integration demonstration. The initial datastore for the OAuth authorization server
is held in EasitTestOauthDatastore.js. To start up the cloud-based flow manager
secured by these records, simply type

    node driver.js
    
from this directory. The endpoints exposed will be the ones as documented in http://wiki.gpii.net/w/GPII_OAuth_2_Guide