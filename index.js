
/**
 * Expose `LCov`.
 */

exports = module.exports = LCov;

/**
 * Initialize a new LCOV reporter.
 * File format of LCOV can be found here: http://ltp.sourceforge.net/coverage/lcov/geninfo.1.php
 * The reporter is built after this parser: https://raw.github.com/SonarCommunity/sonar-javascript/master/sonar-javascript-plugin/src/main/java/org/sonar/plugins/javascript/coverage/LCOVParser.java
 *
 * @param {Runner} runner
 * @api public
 */

function LCov(runner) {
  runner.on('end', function(){
    var cov = global._$jscoverage || {};

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

  if (ret.coverage < 50){
    process.exit(1);
  }
  
}