v0.12.0-alpha23
==================

#### Breaking changes

#### Enhancements

* Added `python`, `make` and `g++` to the `kalabox\cli` image. [#1263](https://github.com/kalabox/kalabox/issues/1263)

#### New Features

* Updated our development process with new contribution guidelines and standards [#1236](https://github.com/kalabox/kalabox/issues/1236)

#### Bug fixes

* Added kbox.app.exists and kbox.app.nextAppName in [#1235](https://github.com/kalabox/kalabox/issues/1235) for use in [#1258](https://github.com/kalabox/kalabox/issues/1258)

* Changed syncthing rescan interval to always be 2 seconds. [#1199](https://github.com/kalabox/kalabox/issues/1199)

* Implemented app specific status messages. [#1255](https://github.com/kalabox/kalabox/issues/1255)

* Changed syncthing to try starting if a restart has failed to put it in the up state. This was usually encountered when running multiple app actions in the GUI. [#1228](https://github.com/kalabox/kalabox/issues/1228)

* Changed app destroy action to remove the app's directory. [#1232](https://github.com/kalabox/kalabox/issues/1232)

* Added kalabox-ui plugin which manages a token container to enable app state and events via docker events stream. [#1160](https://github.com/kalabox/kalabox/issues/1160)

* Disregard hyphens when checking if an app already exists with app.exists(appName).
