v0.12.0-alpha23
==================

#### Breaking changes

#### Enhancements

#### New Features

* Updated our development process with new contribution guidelines and standards [#1236](https://github.com/kalabox/kalabox/issues/1236)

#### Bug fixes

* Added kbox.app.exists and kbox.app.nextAppName in [#1235](https://github.com/kalabox/kalabox/issues/1235) for use in [#1258](https://github.com/kalabox/kalabox/issues/1258)

* Changed syncthing rescan interval to always be 2 seconds. [#1199](https://github.com/kalabox/kalabox/issues/1199)

* Implemented app specific status messages. [#1255](https://github.com/kalabox/kalabox/issues/1255)

* Changed metrics to report email associated with an app if possible. [#44](https://github.com/kalabox/kalabox-internal-issues/issues/44)

* Changed syncthing to try starting if a restart has failed to put it in the up state. This was usually encountered when running multiple app actions in the GUI. [#1228](https://github.com/kalabox/kalabox/issues/1228)
