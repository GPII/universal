# Solutions Registry Data Source

The solutions registry data source provides a RESTful means of fetching
solutions registries via the [FlowManager](FlowManager.md) in order to determine
which solutions are available and appropriate for a user's preferences.  A
solution is an application, such as the NVDA screen reader, or an operating
system feature set using a control panel, such as the Windows high contrast
theme.  Each solution entry in the registry declares a set of preferences that
it supports and describes how to configure the solution, launch it, reset it,
and stop it.

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
client device.  The Cloud Based Flow Manager uses a Solutions Registry Data
Source implemented to run in that context, whereas the Local Flow Manager uses a
Solutions Registry Data Source appropriate for running on client machines.
These two scenarios are described in the following two sections.

## Cloud Based Flow Manager Solutions Registry Data Source

With respect to the Cloud Based Flow Manager, the solutions registries are
included in the distribution of `gpii-universal` along with the other components
of the GPII -- the flow manager, lifecycle manager and so on.  The Cloud Based
FlowManager is a central service for GPII clients, and these clients run on a
variety of platforms.  As such, the platform that the Cloud Based FlowManager is
executing on is irrelevant in terms of providing solutions for the client.  When
a request for a solutionsvregistry is made, the flow manager needs to have
access to all platform solutions in order to respond with the solutions relevant
to a particular client.

Here, the SolutionsRegistryDataSource component loads the solutions
registries from the local file system at system startup.  In this context,
"local" refers to the file system associated with machine that the Cloud Based
Flow Manager is running on.  The SolutionsRegistryDataSource is a
subcomponent of the flow manager, and the sequence of operations and
events that occur during its instantiation are:

<ol>
<li><code>loadSolutions.loadFromLocalDisk</code>,
  <ul>
  <li>The solutions registry files are loaded from the local file system,</li>
  </ul>
</li>
<li><code>loadSolutions.solutionsLoaded</code>
  <ul>
  <li>Fires a <code>solutionsRegistryReady</code> event.</li>
  </ul>
</li>
</ol>

The `solutionsRegistryReady` informs the flow manager that its
SolutionsRegistryDataSource is ready to provide solutions upon request.

## Local Flow Manager Solutions Registry Data Source

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
following sequence of events and operations at startup:

<ol>
<li><code>loadSolutions.loadFromLocalDisk</code>,
  <ul>
  <li>The solutions registry files are loaded from the local file system,</li>
  </ul>
</li>
<li><code>loadSolutions.getRevision</code>,
  <ul>
  <li>Make an http request of the Cloud Based FlowManager for the revision of
      the source code of the GPII used by the cloud,
  </li>
  </ul>
</li>
<li><code>loadSolutions.loadFromRepository</code>,
  <ul>
  <li>Make an http request of the source code respository, passing:
    <ul>
    <li>the platform ID associated with the OS that the client is runing on,
        e.g. "darwin",
    </li>
    <li>the revision fetched at the previous step,</li>
    </ul>
  </li>
  <li>The solutions registry corresponding to the platform and revision provided
      is downloaded from the source code repository and overlays the one fetched
      from the local file system at the first step.
  </li>
  </ul>
</li>
<li><code>loadSolutions.solutionsLoaded</code>
  <ul>
  <li>Fires a <code>solutionsRegistryReady</code> event</li>
  </ul>
</li>
</ol>

The above sequence is embeded within the Local FlowManager's `flowManagerReady`
startup interlock such that all initialization is completed before the GPII
client responds to user interactions.

Note that both the `getRevision` and/or the `loadFromRepository` steps could
fail.  In that case, the latest solutions registry for the client platform will
not be downloaded and cached within the client.  When solutions for the client
platform are requested, the SolutionsRegistryDataSource uses a fallback where
the solutions loaded from the local file system during the first
`loadFromLocalDisk` step are provided.

Further note that the `getRevision` step feeds its result into the
`loadFromRepository` step.  The revision is necessary to fetch the
correct solutions registry from the repository. If a developer wants to avoid
that, they can set the `cloudURL` of the `GpiiRevisionRequester` to `null`,
effectively stopping the entire sequence.  No solutions registry will be
downloaded from the repository in that case.
