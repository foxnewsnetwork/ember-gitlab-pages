'use strict';

var RSVP = require('rsvp');
var runCommand = require('../ember-gitlab-pages/run-command');

module.exports = {
  name: 'gitlab-pages:init',
  aliases: ['gl-pages:init'],
  description: 'prepares a pages branch to store your gitlab pages',
  works: 'insideProject',

  availableOptions: [{
    name:         'message',
    type:         String,
    default:      'initial commit to gitlab pages',
    description:  'The commit message to include with the build, must be wrapped in quotes.'
  }, {
    name:         'branch',
    type:         String,
    default:      'pages',
    description:  'The git branch to push your pages to'
  }],

  run: function(options, rawArgs) {
    var ui          = this.ui;
    var root        = this.project.root;
    var execOptions = { cwd: root };

    function createOrphanPages() {
      return runCommand('git checkout --orphan ' + options.branch, execOptions);
    }

    function removeTrash() {
      var regexStr = "\.gitignore|\.git|\.gitlab-ci\.yml|node_modules|bower_components|(^[.]{1,2}/?$)";
      var bashCmd = "ls -a | grep -vE '" + regexStr + "'";
      var rmCmd = 'rm -rf `bash -c "' + bashCmd + '"`';
      return runCommand(rmCmd, execOptions);
    }

    function addAndCommit() {
      return runCommand('git add -A && git commit -m "' + options.message + '"', execOptions)
    }

    function returnToPreviousCheckout() {
      return runCommand('git checkout -', execOptions);
    }

    return createOrphanPages()
    .then(removeTrash)
    .then(addAndCommit)
    .then(returnToPreviousCheckout)
    .then(function() {
      var branch = options.branch;
      if (branch == "pages") {
        ui.write("Initialized. Now you're ready to run gitlab-pages:commit on branch " + branch);
      } else {
        ui.write("Initialized. Be sure to edit your .gitlab-ci.yml to ensure only: -" + branch);
      }
    });
  }
};

