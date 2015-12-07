
var fs = require("fs"),
    path = require("path"),
    PACKAGE_KEY = "travis-cov",
    THRESHOLD_KEY = "threshold",
    GLOBAL_KEY = "global",
    LOCAL_KEY = "local",
    REMOVE_KEY = "removeKey",
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
        options = {},
        userOpts;

    var configPath = process.env.TRAVIS_COV_CONFIG;
    if (configPath) {
      configPath = path.resolve(configPath);
      if (fs.existsSync(configPath)) {
        userOpts = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      }
    }

    if (!userOpts) {
      var pkgPath = path.resolve('package.json');
      if (fs.existsSync(pkgPath)){
        var userPkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

        if (userPkg){
          var scripts = userPkg.scripts
            , config = userPkg.config;


          if (scripts && scripts[PACKAGE_KEY]){
            console.warn(pkgPath + ': `scripts["travis-cov"]` is deprecated. Please migrate to `config["travis-cov"]`.\n');
            userOpts = scripts[PACKAGE_KEY];
          } else if (config && config[PACKAGE_KEY]){
            userOpts = config[PACKAGE_KEY];
          }
        }
      }
    }

    if (userOpts){
      options.threshold = userOpts[THRESHOLD_KEY] || options.threshold;
      options.global = userOpts[GLOBAL_KEY] || options.global;
      options.local = userOpts[LOCAL_KEY] || options.local;
      options.removeKey = userOpts[REMOVE_KEY];
    }

    if (typeof options.removeKey !== 'undefined'){
      //blanket specific
      delete cov[options.removeKey];
    }

    travisCov.check(cov,options);
  });

  runner.on('fail', function(test,err){
    console.log('Tests failed.\n');
    if (err){
      var message = err.message || ''
        , stack = err.stack || message
        , index = stack.indexOf(message) + message.length
        , msg = stack.slice(0, index)
        , actual = err.actual
        , expected = err.expected
        , escape = true;


      console.log(msg + stack);
    }
    process.exit(1);
  });
}

