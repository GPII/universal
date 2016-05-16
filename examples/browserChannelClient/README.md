This directory contains a tiny sample client for the browserChannel socket.io connection
as described in [../documentation/BrowserChannel.md](../documentation/BrowserChannel.md).

After running 

    npm install
    
in this directory, start the main GPII with 

    node gpii.js gpii/configs cloudBased.production.json

and then run this client with 

    node browserChannelClient.js
    
Output will be as follwos:

    $ node browserChannelClient.js
    ## Socket connected
    ## Received the following settings: null