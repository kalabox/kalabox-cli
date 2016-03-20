
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
   * creating it
   */
  events.on('pre-create-configure', function(config) {

    // Only run if this is a php app
    if (config.type === 'php') {

      // Get the created app type
      var created = kbox.core.deps.get('argv').payload.pop();

      // Get the framework and version in various ways
      // For drupal
      if (_.includes(created, 'drupal')) {
        config.pluginconfig.php.framework = 'drupal';
        config.pluginconfig.php.version = created.replace('drupal', '');
      }

      // For wordpress
      else if (created === 'wordpress') {
        config.pluginconfig.php.framework = 'wordpress';
        config.pluginconfig.php.version = '4';
      }

      // Get relevant config options
      var prod = kbox.util.yaml.toJson(path.join(__dirname, 'config.yml'));
      var locked = kbox.core.deps.get('globalConfig').locked;

      // Set a version
      config.version = (!locked) ? prod.url.dev : prod.url.prod;

    }

  });

};
