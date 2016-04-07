var RSVP = require('rsvp');
var exec = require('child_process').exec;

function runCommand(/* child_process.exec args */) {
  var args = Array.prototype.slice.call(arguments);

  var lastIndex = args.length - 1;
  var lastArg   = args[lastIndex];
  var logOutput = false;
  if (typeof lastArg === 'boolean') {
    logOutput = lastArg;
    args.splice(lastIndex);
  }

  return new RSVP.Promise(function(resolve, reject) {
    var cb = function(err, stdout, stderr) {
      if (logOutput) {
        if (stderr) {
          console.log(stderr);
        }

        if (stdout) {
          console.log(stdout);
        }
      }

      if (err) {
        return reject(err);
      }

      return resolve();
    };

    args.push(cb);
    exec.apply(exec, args);
  }.bind(this));
}

module.exports = runCommand;