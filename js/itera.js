// ***prototype*** library for iterative generative procedures

// include - perlinfunction, ca, logistic (rev?),

var itera = itera || {};
(function(it) {
  "use strict";

  var logistic = function(x, r) {
    r = typeof r !== 'undefined' ? r : 0.894;
    return 4.0 * r * x * (1.0 - x);
  }

  var ca1d = function(a, r, n) {
    r = r || [0,1,0,1,1,0,1,0];
    n = n || 2;
    var b = [];
    for(var i = a.length - 1; i < (2 * a.length) - 1; i++) {
      for(var j = 0; j < r.length; j++) {
        if(a[(i-1)%a.length] === parseInt(j/(n*n)) &&
           a[i%a.length] === parseInt(j/n)%n &&
           a[(i+1)%a.length] === j%n) b[i%a.length] = r[j];
      }
    }
    return b;
  }

  var perlinfunction = function(x, f, amps) { // version containing no persistent state
    var sum = 0, ampsum = 0;
    for(var i = 0; i < amps.length; i++) {
      sum += (f(x * (i+1)) * amps[i]);
      ampsum += amps[i];
    }
    return (sum / ampsum);
  }

  var PerlinFunction = function(opt) {  // stateful version - keep ?
    var opt = opt || {};
    this.f = opt.f;
    this.amps = typeof opt.amps !== 'undefined' ? opt.amps : [1.0];
  }

  PerlinFunction.prototype = {
    get: function(x) {
      var sum = 0, ampsum = 0;
      for(var i = 0; i < this.amps.length; i++) {
        sum += (this.f(x * (i+1)) * this.amps[i]);
        ampsum += this.amps[i];
      }
      return (sum / ampsum);
    }
  }

  it.logistic = logistic;
  it.ca1d = ca1d;
  it.perlinfunction = perlinfunction;
  it.PerlinFunction = PerlinFunction;

})(itera);
