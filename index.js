/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-gitlab-pages',
  includedCommands: function() {
    return {
      'gitlab-pages:init': require("./lib/commands/init"),
      'gitlab-pages:commit': require('./lib/commands/commit')
    };
  }
};
