'use strict';

var runCommand = require('../ember-gitlab-pages/run-command');
var RSVP = require('rsvp');

module.exports = {
  name: 'gitlab-pages:commit',
  aliases: ['gl-pages:commit'],
  description: 'Build the test app for production and commit it into a git branch',
  works: 'insideProject',

  availableOptions: [{
    name:         'message',
    type:         String,
    default:      'new gitlab pages version',
    description:  'The commit message to include with the build, must be wrapped in quotes.'
  }, {
    name:         'environment',
    type:         String,
    default:      'production',
    description:  'The ember environment to create a build for'
  }, {
    name:         'branch',
    type:         String,
    default:      'pages',
    description:  'The git branch to push your pages to'
  }, {
    name:         'build-path',
    type:         'Path',
    default:      'dist',
    description:  'The dir where your build command will deposit the finished files'
  }, {
    name:         'npm-build',
    type:         Boolean,
    default:      false,
    description:  "Should I use 'ember build' or 'npm run build'?"
  }],

  run: function(options, rawArgs) {
    var ui          = this.ui;
    var root        = this.project.root;
    var execOptions = { cwd: root };

    function buildApp() {
      var env = options.environment;
      if (options.npmBuild) {
        return runCommand('npm run build', execOptions);
      } else {
        return runCommand('ember build --environment=' + env, execOptions);
      }
    }

    function checkoutGhPages() {
      return runCommand('git checkout ' + options.branch, execOptions);
    }

    function cleanStale() {
      return runCommand("rm -rf public || echo 'nothing stale is present'", execOptions);
    }

    function move() {
      var dist = options.buildPath;
      return runCommand('mv ' + dist + ' public', execOptions);
    }

    function addAndCommit() {
      return runCommand('git add -A && git commit -m "' + options.message + '"', execOptions)
    }

    function returnToPreviousCheckout() {
      return runCommand('git checkout -', execOptions);
    }

    return buildApp()
      .then(checkoutGhPages)
      .then(cleanStale)
      .then(move)
      .then(addAndCommit)
      .then(returnToPreviousCheckout)
      .then(function() {
        var branch = options.branch;
        ui.write('Done. All that\'s left is to git push the ' + branch +
          ' branch.\nEx: git push origin ' + branch + ':' + branch +'\n');
      });
  }
};