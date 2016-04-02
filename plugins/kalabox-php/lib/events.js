
'use strict';

module.exports = function(kbox) {

  // Node modules
  var path = require('path');

  // NPM modules
  var _ = require('lodash');

  // Load some boxmods
  var events = kbox.core.events.context('29b1da3b-e0d0-49e3-a343-ea558a21c6e2');

  /*
   * Add some other important things to our kalabox.yml before
   * configin it
   */
  events.on('pre-create-configure', function(data) {

    // Grab the config from teh data
    var config = data.config;
    var results = data.results;

    // Only run if this is a php app
    if (config.type === 'php') {

      // Get the created app type
      var created = results._type;

      // Get the framework and version in various ways
      // For drupal
      if (_.includes(created, 'drupal')) {
        config.pluginconfig.php.framework = 'drupal';
        config.pluginconfig.php.version = created.replace('drupal', '');
        config.pluginconfig.php.image = [
          config.pluginconfig.php.framework,
          config.pluginconfig.php.version
        ].join(':');
      }

      // For wordpress
      else if (created === 'wordpress') {
        config.pluginconfig.php.framework = 'wordpress';
        config.pluginconfig.php.version = '4';
        config.pluginconfig.php.image = [
          config.pluginconfig.php.framework,
          config.pluginconfig.php.version
        ].join(':');
      }

      // For backdrop
      else if (created === 'backdrop') {
        config.pluginconfig.php.framework = 'backdrop';
        config.pluginconfig.php.version = '1';
        config.pluginconfig.php.image = 'backdrop/' + [
          config.pluginconfig.php.framework,
          config.pluginconfig.php.version
        ].join(':');
      }

      // Get relevant config options
      var prod = kbox.util.yaml.toJson(path.join(__dirname, 'config.yml'));
      var locked = kbox.core.deps.get('globalConfig').locked;

      // Set a version
      config.version = (!locked) ? prod.url.dev : prod.url.prod;

    }

  });

};
