(typeof exports !== "undefined" ? exports : window).travisCov = (function(){
    var main = {
      check: function(cov,userOptions){
        var options = {
          threshold: 50, //defaults to 50%
          global: true,
          local: false
        };

        if (userOptions){
          options.threshold = userOptions.threshold || options.threshold;
          options.threshold = userOptions.global || options.global;
          options.threshold = userOptions.local || options.local;
        }

        var totals =[];
        for (var filename in cov) {
          var data = cov[filename];
          totals = this.reportFile( data,options);
        }
        var totalHits = 0;
        var totalSloc = 0;
        totals.forEach(function(elem){
          totalHits += elem[0];
          totalSloc += elem[1];
        });
        var globCoverage = totalHits / totalSloc * 100;
        console.log("global coverage:"+globCoverage);
        if (options.global && (globCoverage < options.threshold || isNaN(globCoverage))){
          console.log("Code coverage below threshold: "+globCoverage+ " < "+options.threshold);
          if (typeof process !== "undefined"){
            process.exit(1);
          }
          return false;
          
        }
        return true;
      },
      reportFile: function( data,options) {
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
          if (typeof process !== "undefined"){
            process.exit(1);
          }
          //need to figure out
        }
        return [ret.hits,ret.sloc];
        
      }
  };
  return main;
})();