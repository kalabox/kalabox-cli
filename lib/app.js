/**
 * Magix for interacting with Kalabox apps.
 *
 * @name app
 */

'use strict';

// Intrinsic modules.
var path = require('path');

// Npm modules.
var _ = require('lodash');

// Kbox modules.
var Promise = require('./promise.js');
var core = require('./core.js');
var engine = require('./engine.js');
var registry = require('./app/registry.js');
var kbox = require('./kbox.js');
var AsyncEvents = require('./util/asyncEvents.js');
var Env = require('./app/env.js');

/*
 * Singleton instance to hold app objects by name.
 */
var _apps = {};

/**
 * Handles app registration.
 *
 * [Read more](#registry)
 */
var register = exports.register = registry.registerApp;

/*
 * Some promisified globals.
 */
var fs = Promise.promisifyAll(require('fs'));

/*
 * Pretty print an object.
 */
var pp = function(obj) {
  return JSON.stringify(obj, null, '  ');
};

/*
 * Get a list of an app's compose files.
 */
var getComposeFiles = function(app) {
  return _.uniq(app.composeCore);
};

/*
 * Return the default app compose object
 */
var getCompose = function(app) {
  return {
    compose: getComposeFiles(app),
    project: app.name
  };
};

/**
 * Load a plugin's apps.
 */
var loadPlugins = exports.loadPlugins = function(app, callback) {

  // Make sure plugins don't get loaded a second time.
  if (app.pluginsLoaded) {
    throw new Error('Plugins already loaded.');
  } else {
    app.pluginsLoaded = true;
  }

  // Init plugins with plugin info from app config.
  if (!app.config.plugins) {
    app.plugins = [];
  } else {
    app.plugins = app.config.plugins;
  }

  // Map plugins with kbox require.
  return Promise.map(app.plugins, function(plugin) {
    return kbox.require(plugin, app);
  })
  // Return.
  .nodeify(callback);

};

/**
 * Activate an app.
 */
exports.activate = function(app, callback) {
  return app.events.emit('pre-activate')
  .then(function() {
    core.deps.register('app', app);
    core.deps.register('appConfig', app.config);
    register({
      name: app.name,
      dir: app.config.appRoot
    });
  })
  .then(function() {
    if (!app.pluginsLoaded) {
      return loadPlugins(app);
    }
  })
  .then(function() {
    core.env.setEnvFromObj(
      core.deps.get('appConfig'),
      'app_config'
    );
    var appEnv = _.clone(core.deps.get('app'));
    delete appEnv.config;
    core.env.setEnvFromObj(appEnv, 'app');
  })
  .then(function() {
    return app.events.emit('post-activate');
  })
  .nodeify(callback);
};

var _create = function(name, config, results, callback) {

  // Emit pre app create event.
  return core.events.emit('pre-app-load', config)
  // Get provider.
  .then(function() {
    return engine.provider();
  })
  // Create app.
  .then(function(provider) {
    // Init.
    var app = {};
    // Name.
    app.name = name;
    // Domain
    app.domain = config.domain;
    // Environment object.
    app.env = new Env();
    // Asynchronous event emitter.
    app.events = new AsyncEvents();
    // Hostname.
    app.hostname = [name, config.domain].join('.');
    // Url.
    app.url = 'http://' + app.hostname;
    // Root.
    app.root = config.appRoot;
    // Root bind.
    app.rootBind = provider.path2Bind4U(app.root);
    // Config.
    app.config = config;
    // Answers/Results
    app.results = results || {};
    // Config home bind.
    app.config.homeBind = provider.path2Bind4U(app.config.home);
    // Load in any plugin config if its there
    app.config.pluginconfig = config.pluginconfig || {};
    // Define core kalabox compose file
    app.composeCore = [path.join(app.root, 'kalabox-compose.yml')];
    // Add an override file to compose extra if it exists
    var overrideFile = path.join(app.root, 'kalabox-compose-override.yml');
    if (fs.existsSync(overrideFile)) {
      app.composeCore.push(overrideFile);
    }

    // Return our app
    return app;
  })

  // Emit post event.
  .tap(function(app) {
    return core.events.emit('post-app-load', app);
  })

  // Return.
  .nodeify(callback);

};

/**
 * Creates an app.
 * @memberof app
 * @arg {string} name - The name of the app.
 * @arg {Object} config - An app config object.
 * @arg {function} callback - Callback function called when the app is created
 * @arg {error} callback.error - An error if any.
 * @arg {Object} callback.app - The instantiated app object.
 * @prop {string} name - String name of the application.
 * @prop {string} domain - The domain name. -> appName.kbox
 * @prop {string} url - URL of the app.
 * @prop {string} appRoot - Root directory for the app.
 * @prop {Object} config - The app's config object.
 * @prop {object<array>} plugins - List of the app's plugins.
 * @prop {object<array>} components - List of the app's components.
 * @example
 * kbox.app.create(config.appName, config, function(err, app) {
 *  callback(err, app);
 * });
 */
var create = exports.create = function(name, config, results, callback) {
  if (_apps[name]) {
    // Return cached app.
    return kbox.Promise.resolve(_apps[name]).nodeify(callback);
  } else {
    // Create app, cache it, and return it.
    return _create(name, config, results, callback)
    .tap(function(app) {
      _apps[name] = app;
    })
    .nodeify(callback);
  }
};

/**
 * Lists all the users apps known to Kalabox.
 * @memberof app
 * @static
 * @method
 * @arg {function} callback - Callback called when query for apps is complete.
 * @arg {error} callback.error
 * @arg {app<Array>} callback.apps - Array of apps.
 * @example
 * kbox.app.list(function(err, apps) {
 *   if (err) {
 *     throw err;
 *   } else {
 *     apps.forEach(function(app) {
 *       console.log(app.name);
 *     });
 *   }
 * });
 */
var list = exports.list = function(opts, callback) {

  if (callback === undefined && typeof opts === 'function') {
    callback = opts;
    opts = null;
  }

  opts = opts || {useCache: true};

  // Get list of app names.
  return registry.getApps(opts)
  // Map list of app names to list of apps.
  .then(function(apps) {
    return Promise.map(apps, function(app) {
      var config = core.config.getAppConfig(app.dir);
      return create(app.name, config);
    })
    .all();
  })
  // Validate list of apps, look for duplicates.
  .tap(function(apps) {
    // Group apps by app names.
    var groups = _.groupBy(apps, function(app) {
      return app.name;
    });
    // Find a set of duplicates.
    var duplicates = _.find(groups, function(group) {
      return group.length !== 1;
    });
    // If a set of duplicates were found throw an error.
    if (duplicates) {
      throw new Error('Duplicate app names exist: ' + pp(duplicates));
    }
    // Pass the apps on to the each
    return apps;
  })
  // Return.
  .nodeify(callback);

};

/**
 * Returns whether an app is running or not
 * @todo : document this better
 */
exports.isRunning = function(app, callback) {

  // Check if our engine is up
  return engine.isUp()

  // If we are up check for containers running for an app
  // otherwise return false
  .then(function(isUp) {

    // Engine is up so lets check if the app has running containers
    if (isUp) {

      // Get list of containers
      return engine.list(app.name)

      // Reduce containers to a true false running value
      .reduce(function(isRunning, container) {
        return (isRunning) ? true : engine.isRunning(container.id);
      }, false);

    }

    // Engine is down so nothing can be running
    else {
      return false;
    }

  })

  .nodeify(callback);

};

/**
 * Get an app object from an app's name.
 * @static
 * @method
 * @arg {string} appName - App name for the app you want to get.
 * @arg {function} callback - Callback function called when the app is got.
 * @arg {error} callback.error - Error from getting the app.
 * @arg {app} callback.app - App object.
 * @example
 * kbox.app.get('myapp', function(err, app) {
 *   if (err) {
 *     throw err;
 *   } else {
 *     console.log(app.config);
 *   }
 * });
 */
exports.get = function(appName, callback) {

  // Get list of apps.
  return list()
  // Find an app that matches the given app name.
  .then(function(apps) {
    var app = _.find(apps, function(app) {
      return app.name === appName;
    });
    if (!app) {
      throw new Error('App "' + appName + '" does not exist.');
    }
    return app;
  })
  // Return.
  .nodeify(callback);

};

/**
 * Uninstalls an app's components except for the data container.
 * @memberof app
 * @static
 * @method
 * @arg {Object} app - App object you want to uninstall.
 * @arg {function} callback - Callback called when the app has been uninstalled.
 * @arg {Array} callback.errors - Array of errors from uninstalling components.
 * @example
 * kbox.app.uninstall(app, function(err) {
 *   if (err) {
 *     throw err;
 *   } else {
 *     console.log('App uninstalled.');
 *   }
 * });
 */
var uninstall = exports.uninstall = function(app, callback) {

  // Report to metrics.
  return Promise.try(function() {
    return kbox.metrics.reportAction('uninstall');
  })
  // Emit pre event.
  .then(function() {
    return app.events.emit('pre-uninstall');
  })
  // Kill components.
  .then(function() {
    return engine.destroy(getCompose(app));
  })
  // Emit post event.
  .then(function() {
    return app.events.emit('post-uninstall');
  })
  // Return.
  .nodeify(callback);

};

/**
 * Attempts to clean up corrupted apps. This will compare the appRegistry
 * with kbox.list to determine apps that may have orphaned containers. If
 * those apps do have orphaned containers then we remove those containers
 * and finally the corrupted app from the appRegisty.
 * @memberof app
 * @static
 * @method
 * @arg {function} callback - Callback called when the app has been rebuilt.
 * @arg {Array} callback.errors - Error from cleaning app.
 * @example
 * kbox.app.cleanup(function(errs) {
 *   if (err) {
 *     throw err;
 *   } else {
 *     console.log('PURIFICATION COMPLETE!');
 *   }
 * });
 */
var cleanup = exports.cleanup = function(callback) {

  // Get all our containers
  return list()

  .map(function(app) {
    // we need to swap out hypens for nothings
    return app.name.replace(/-/g, '');
  })

  // Filter out non-app containers
  .then(function(apps) {
    return Promise.filter(engine.list(), function(container) {
      return container.kind === 'app' && !_.includes(apps, container.app);
    });
  })

  // Stop containers if needed
  .tap(function(containers) {
    return engine.stop(containers);
  })

  // Kill containers if needed
  .tap(function(containers) {
    return engine.destroy(containers);
  })

  // Return.
  .nodeify(callback);

};

/**
 * Starts an app's components.
 * @memberof app
 * @static
 * @method
 * @arg {Object} app - App object you want to start.
 * @arg {function} callback - Callback called when the app has been started.
 * @arg {Array} callback.errors - Array of errors from starting components.
 * @example
 * kbox.app.start(app, function(errs) {
 *   if (errs) {
 *     throw errs;
 *   } else {
 *     console.log('App started.');
 *   }
 * });
 */
var start = exports.start = function(app, callback) {

  kbox.core.log.status('Starting.');

  // Report to metrics.
  return kbox.metrics.reportAction('start')
  // Make sure we are in a clean place before we get dirty
  .then(function() {
    kbox.core.log.status('Cleaning up.');
    return cleanup();
  })
  // Emit pre start event.
  .then(function() {
    kbox.core.log.status('Running pre start tasks.');
    return app.events.emit('pre-start');
  })
  // Start core containers
  .then(function() {
    kbox.core.log.status('Starting containers.');
    return engine.start(getCompose(app));
  })
  // Emit post start event.
  .then(function() {
    kbox.core.log.status('Running post start tasks.');
    return app.events.emit('post-start');
  })
  // Return.
  .nodeify(callback);

};

/**
 * Stops an app's components
 * any other apps running.
 * @memberof app
 * @static
 * @method
 * @arg {Object} app - App object you want to stop.
 * @arg {function} callback - Callback called when the app has been stopped.
 * @arg {Array} callback.errors - Array of errors from stopping components.
 * @example
 * kbox.app.stop(app, function(errs) {
 *   if (errs) {
 *     throw errs;
 *   } else {
 *     console.log('App stopped.');
 *   }
 * });
 */
var stop = exports.stop = function(app, callback) {

  kbox.core.log.status('Stopping.');

  // Report to metrics.
  return kbox.metrics.reportAction('stop')
  // Make sure we are in a clean place before we get dirty
  .then(function() {
    kbox.core.log.status('Cleaning up.');
    return cleanup();
  })
  // Emit pre event.
  .then(function() {
    kbox.core.log.status('Running pre stop tasks.');
    return app.events.emit('pre-stop');
  })
  // Stop components.
  .then(function() {
    kbox.core.log.status('Stopping containers.');
    return engine.stop(getCompose(app));
  })
  // Emit post event.
  .then(function() {
    kbox.core.log.status('Running post stop tasks.');
    return app.events.emit('post-stop');
  })
  // Return.
  .nodeify(callback);

};

/**
 * Stops and then starts an app's components.
 * @static
 * @method
 * @arg {Object} app - App object you want to restart.
 * @arg {function} callback - Callback called when the app has been restarted.
 * @arg {Array} callback.errors - Array of errors from restarting components.
 * @example
 * kbox.app.restart(app, function(errs) {
 *   if (errs) {
 *     throw errs;
 *   } else {
 *     console.log('App Restarted.');
 *   }
 * });
 */
exports.restart = function(app, callback) {

  // Stop app.
  return stop(app)
  // Start app.
  .then(function() {
    return start(app);
  })
  // Return.
  .nodeify(callback);

};

/**
 * Uninstalls an app's components including the data container, and removes
 * the app's code directory.
 * @static
 * @method
 * @arg {Object} app - App object you want to uninstall.
 * @arg {function} callback - Callback called when the app has been uninstalled.
 * @arg {Array} callback.errors - Array of errors from uninstalling components.
 * @example
 * kbox.app.destroy(app, function(err) {
 *   if (err) {
 *     throw err;
 *   } else {
 *     console.log('App destroyed.');
 *   }
 * });
 */
exports.destroy = function(app, callback) {

  kbox.core.log.status('Destroying.');

  // Report to metrics.
  return Promise.try(function() {
    return kbox.metrics.reportAction('destroy');
  })
  // Emit pre event.
  .then(function() {
    kbox.core.log.status('Running pre destroy tasks.');
    return app.events.emit('pre-destroy');
  })
  // Make sure app is stopped.
  .then(function() {
    kbox.core.log.status('Stopping.');
    return stop(app);
  })
  // Uninstall app.
  .then(function() {
    kbox.core.log.status('Uninstalling.');
    return uninstall(app);
  })
  // Remove from appRegistry
  .then(function() {
    return registry.removeApp({name: app.name});
  })
  // Emit post event.
  .then(function() {
    kbox.core.log.status('Running post destroy tasks.');
    return app.events.emit('post-destroy');
  })
  // Return.
  .nodeify(callback);

};

/**
 * Rebuilds an apps containers. This will stop an app's containers, remove all
 * of them except the data container, pull down the latest versions of the
 * containers as specified in the app's kalabox.json. You will need to run
 * `kbox start` when done to restart your app.
 * @static
 * @method
 * @arg {Object} app - App object you want to rebuild.
 * @arg {function} callback - Callback called when the app has been rebuilt.
 * @arg {Array} callback.errors - Error from rebuilding components.
 * @example
 * kbox.app.rebuild(app, function(errs) {
 *   if (err) {
 *     throw err;
 *   } else {
 *     console.log('App rebuilt!.');
 *   }
 * });
 */
exports.rebuild = function(app, callback) {

  // Stop app.
  return stop(app)
  // Uninstall app.
  .then(function() {
    return app.events.emit('pre-rebuild');
  })
  .then(function() {
    return uninstall(app);
  })
  // Repull/build components.
  .then(function() {
    return engine.build(getCompose(app));
  })
  // Emit post event.
  .then(function() {
    return app.events.emit('post-rebuild');
  })
  // Install app.
  .then(function() {
    return start(app);
  })
  // Return.
  .nodeify(callback);

};
