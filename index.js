
var fs = require("fs"),
    options = {
      threshold: 50, //defaults to 50%
      global: true,
      local: false
    },
    PACKAGE_KEY = "travis-cov",
    THRESHOLD_KEY = "threshold",
    GLOBAL_KEY = "global",
    LOCAL_KEY = "local";


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
    var cov = global._$jscoverage || {};

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
    var totals =[];
    for (var filename in cov) {
      var data = cov[filename];
      reportFile( data);
    }
    var totalHits = 0;
    var totalSloc = 0;
    totals.forEach(function(elem){
      totalHits += elem[0];
      totalSloc += elem[1];
    });
    var globCoverage = totalHits / totalSloc * 100;
    if (options.global && globCoverage < options.threshold){
      console.log("Code coverage below threshold: "+globCoverage+ " < "+options.threshold);
      process.exit(1);
    }
  });
}

function reportFile( data) {
  var ret = {
    coverage: 0,
    hits: 0,
    misses: 0,
    sloc: 0
  };
  data.source.forEach(function(line, num){
    num++;
    if (data[num] === 0) {
      ret.misses++;
      ret.sloc++;
    } else if (data[num] !== undefined) {
      ret.hits++;
      ret.sloc++;
    }
  });
  ret.coverage = ret.hits / ret.sloc * 100;

  if (options.local && ret.coverage < options.threshold){
    console.log("Code coverage below threshold: "+ret.coverage+ " < "+options.threshold);
    process.exit(1);
  }
  return [ret.hits,ret.sloc];
  
}