
var fs = require("fs"),
    covThreshold=50, //defaults to 50%
    PACKAGE_KEY = "travis-cov-threshold";

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
        covThreshold = JSON.parse(fs.readFileSync(path, 'utf8'))[PACKAGE_KEY] || covThreshold;
    }

    for (var filename in cov) {
      var data = cov[filename];
      reportFile(filename, data);
    }
  });
}

function reportFile(filename, data) {
  var ret = {
    filename: filename,
    coverage: 0,
    hits: 0,
    misses: 0,
    sloc: 0,
    source: {}
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

  if (ret.coverage < covThreshold){
    console.log("Code coverage below threshold: "+ret.coverage+ " < "+covThreshold);
    process.exit(1);
  }
  
}