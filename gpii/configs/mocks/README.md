This directory contains variants of the configs in the outer directory, with the settings handler definitions
replaced by mocks. This makes them suitable for testing from the bare universal repository, without the risk
of failures caused by missing platform-specific settings handlers, or any corruption to the outer machine's state.
