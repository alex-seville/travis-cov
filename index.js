
/**
 * Expose `TrvsCov`.
 */

exports = module.exports =  TrvsCov;
var THRESHOLDVARNAME = "blanketThreshold",
  covThreshold=50;
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

    function hasThresholdVar(element, index, array) {
      return element.indexOf(THRESHOLDVARNAME) === 0;
    }
    var tg = runner._globals.filter(hasThresholdVar);
    if (tg.length > 0){
      try{
        covThreshold = parseFloat(tg[0].replace(THRESHOLDVARNAME,""));
      }catch(e){}
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
    process.exit(1);
  }
  
}