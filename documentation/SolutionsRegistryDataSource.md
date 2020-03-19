# Solutions Registry Data Source

The solutions registry data source provides a RESTful means of fetching
solutions registries via the [FlowManager](FlowManager.md) in order to determine
which solutions are available and appropriate for a user's preferences.  A
solution is an application, such as the NVDA screen reader, or an operating
system feature, such as the Windows high contrast theme set using a system
control panel.  Each solution supports a set of preferences and describes how
to configure the solution, launch it, reset it, and stop it.

The solutions are listed in `JSON` files called "solutions registries".  The
structure of a solutions registry is documented in
[SolutionsRegistryFormat](SolutionsRegistryFormat.md).  Since solutions are
frequently specific to an operating system, or "platform", there are separate
solution registries for each platform.  Examples of platforms are Windows,
GNOME-Linux, MacOS, and Android.

The SolutionsRegistryDataSource is a component that loads and caches
solutions registries when the GPII starts up, and then serves solutions to the
rest of the system upon request.  The flow manager coordinates retrieval of
solutions, user preferences, device information, and so on, passing these to the
[MatchMaker Framework](MatchMakerFramework.md) and [LifecycleManager](LifecycleManager.md).

There are two initialization workflows with respect to solutions registries
depending on whether the flow manager is running in the cloud or locally on the
client device.  This are described in the following two sections.

## Cloud Based Flow Manager

The solutions registries are included in the distribution of `gpii-universal`
along with the other components of the GPII -- the flow manager, lifecycle
manager and so on.  The Cloud Base FlowManager is a central service for GPII
clients, and these clients run on a variety of platforms.  As such, the
platform that the Cloud Based FlowManager is executing on is irrelevant in
terms of providing solutions for the client.  When a request for a solutions
registry is made, the flow manager needs to have access to all platform
solutions in order to respond with the solutions relevant to a particular
client.

The solutions registries are loaded from the local file system at system
startup.  Here, "local" refers to the file system associated with machine that 
the Cloud Base FlowManager is running on.  The SolutionsRegistryDataSource is a
subcomponent of the flow manager, and there is a sequence of operations and
events that occurs during its instantiation:

1. `loadSolutions.loadFromLocalDisk`,
  * The solutions registry files are loaded from the local file system,
2. `loadSolutions.solutionsLoaded`
  * Fires a `solutionsRegistryReady` event.

The `solutionsRegistryReady` informs the flow manager that its
SolutionsRegistryDataSource is ready to provide solutions upon request.

## Local Flow Manager

As in the case of the Cloud Based FlowManager, the solutions registries are
included in the distribution of GPII for the client.  However, they are not
updated as frequently as those in the cloud.  In particular, the solutions
registry may be stale for the platform that the client is running on.  However,
the registry associated with the latest version of the cloud based GPII is 
available in `gpii-universal`'s source code repository (github), and can be
downloaded from there.  In this regard, the Cloud Based FlowManager provides a
`/revision` end-point that responds with the full `SHA256` of the revision of
the source associated with the latest solutions registries.

The SolutionsRegistryDataSource associated with the Local FlowManager uses the
initialized following sequence of events and operations at startup:

1. `loadSolutions.loadFromLocalDisk`,
  * The solutions registry files are loaded from the local file system,
2. `loadSolutions.getRevision`,
  * Make an http request of the Cloud Based FlowManager for the revision of the
   source code of the GPII used by the cloud,
3. `loadSolutions.loadFromRepository`,
  * Make an http request of the source code respository, passing:
    * the platform ID associated with the OS that the client is runing on, e.g.
    "darwin",
    * the revision fetched at the previous step,
  * The solutions registry corresponding to the platform and revision provided is
 downloaded from the source code repository and overlays the one fetched from
 the local file system at the first step.
4. `loadSolutions.solutionsLoaded`
 * Fires a `solutionsRegistryReady` event

The above sequence is embeded within the Local FlowManager's `flowManagerReady`
startup interlock such that all initialition is completed before the GPII client
responds to user interactions.

Note that both the `getRevision` and/or the `loadFromRepository` steps could
fail.  In that case, the latest solutions registry for the client platform will
not be downloaded and cached within the client.  When solutions for the client
platform are requested, the SolutionsRegistryDataSource uses a fallback where
the solutions loaded from the local file system during the first
`loadFromLocalDisk` step are provided.
