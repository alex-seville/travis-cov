(typeof exports !== "undefined" ? exports : window).travisCov = (function(){   
    var main = {
      check: function(cov){
        var totals =[];
        for (var filename in cov) {
          var data = cov[filename];
          this.reportFile( data);
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
      },
      reportFile: function( data) {
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
  };
  return main;
})();