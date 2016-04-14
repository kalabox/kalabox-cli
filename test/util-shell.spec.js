'use strict';

// Setup chai.
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
//var expect = chai.expect;
chai.should();

// Node modules.
var util = require('util');

// Load kbox modules.
//var Promise = require('../lib/promise.js');
var shell = require('../lib/util/shell.js');

describe('shell', function() {

  describe('#exec', function() {

    /*
     * Make sure a succesful command returns stdout.
     */
    it('should return a promise resolved to stdout', function() {

      return shell.exec(['echo', 'foo'])
      .should.become('foo\n');

    });

    /*
     * Make sure a failed command returns a corrently formatted error.
     */
    it('should return a fail object when it is rejected.', function() {

      var cmd = ['not-a-real-cmd'];

      var expected = util.format(
        //'cmd: %s, code: %s, err: %s, stdout: %s',
        'code: %serr:%s: %s\n',
        '127',
        '/bin/sh: ' + cmd.join(' '),
        'command not found'
      );

      return shell.exec(['not-a-real-cmd']).should.be.rejectedWith(expected);

    });

    /*
     * Make sure the environment is injected correctly.
     */
    it('should inject the environment correctly', function() {

      process.env.unicornRainbows = 'on fleek';
      process.env.catName = 'potato';

      var mockApp = {
        env: {
          getEnv: function() {
            return {
              favoriteColor: 'blue',
              catName: 'molly'
            };
          }
        }
      };

      var opts = {
        app: mockApp
      };

      return shell.exec(['env'], opts).should.eventually
      .match(/favoriteColor=blue\n/)
      .match(/catName=molly\n/)
      .match(/unicornRainbows=on fleek\n/);

    });

  });

});