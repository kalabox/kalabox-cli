'use strict';

module.exports = function(kbox) {
  // Load CLI tasks for this plugin.
  require('./lib/tasks.js')(kbox);
};
