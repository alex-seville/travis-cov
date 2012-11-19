
var fs = require("fs"),
    PACKAGE_KEY = "travis-cov",
    THRESHOLD_KEY = "threshold",
    GLOBAL_KEY = "global",
    LOCAL_KEY = "local",
    travisCov = require("./travisCov").travisCov;


/**
 * Expose `TrvsCov`.
 */

exports = module.exports =  TrvsCov;

/**
 * Initialize a new TrvsCov reporter.
 * Threshold defaults to 50, but you can pass it a custom threshold
 * by putting "blanketThreshold<number>" as a global variable
 * in the runner.  The value of the global variable is not used,
 * but rather we parse the variable name itself
 * Not ideal, but it works.
 *
 * @param {Runner} runner
 * @api public
 */

function TrvsCov(runner) {
  runner.on('end', function(){
    var cov = global._$jscoverage || {},
      options = {};

    var path = process.cwd() + '/package.json';

    var exists = fs.existsSync(path);
    if (exists){
        var userPkg = JSON.parse(fs.readFileSync(path, 'utf8'));
        
        if (userPkg && userPkg.scripts && userPkg.scripts[PACKAGE_KEY]){
          var userOpts = userPkg.scripts[PACKAGE_KEY];
          options.threshold = userOpts[THRESHOLD_KEY] || options.threshold;
          options.global = userOpts[GLOBAL_KEY] || options.global;
          options.local = userOpts[LOCAL_KEY] || options.local;
        }
    }
    travisCov.check(cov,options);
  });
}

