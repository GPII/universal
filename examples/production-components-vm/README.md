The contents of this directory provide a way to deploy CouchDB along with the Preferences Server and Flow Manager using production configurations in a Virtual Machine. 

To start the VM, use command: ``vagrant up``

Once the VM is started, you will be able to access each service using the following ports on your host operating system:

* ``5984``: CouchDB
* ``8081``: Preferences Server
* ``8082``: Flow Manager

To stop the VM, use command: ``vagrant halt``
