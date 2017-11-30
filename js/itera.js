// ***prototype*** library for iterative generative procedures

// include - perlinfunction, ca, logistic (rev?), iterativecolor (generalised)

var itera = itera || {};
(function(it) {
  "use strict";

  var createArray = function(length) {
    var arr = new Array(length || 0),
        i = length;
    if(arguments.length > 1) {
      var args = Array.prototype.slice.call(arguments, 1);
      while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }
    return arr;
  }

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

  var CA2D = function(opt) {
    var opt = opt || {};
    this.numStates = opt.numStates;
    this.sizeX = opt.sizeX;
    this.sizeY = opt.sizeY === 'undefined' ? opt.sizeX : opt.sizeY;
    this.cells = createArray(this.sizeX, this.sizeY);
    this.buffer = createArray(this.sizeX, this.sizeY);
    // for(var i = 0; i < this.sizeX; i++) {
    //   for(var j = 0; j < this.sizeY; j++) {
    //     this.cells[i][j] = 0;
    //   }
    // }
    this.ruleset = [];
    for(var i = 0; i < this.numStates * 8; i++) this.ruleset[i] = 0;
    this.genCount = 0;
  }

  CA2D.prototype = {
    states: function(p) {
      var r = 0;
      for(var i = 0; i < this.sizeX; i++) {
        for(var j = 0; j < this.sizeY; j++) {
          r = Math.random();
          if(r < p) this.cells[i][j] = 1 + parseInt(Math.random() * (this.numStates - 1));
          else this.cells[i][j] = 0;
        }
      }
    },
    rules: function(p) {
      this.ruleset[0] = 0;
      var r = 0, r2 = 0;
      for(var i = 1; i < this.ruleset.length; i++) {
        this.ruleset[i] = 0;
        r = Math.random();
        if(r < p) {
          r2 = Math.random();
          for(var j = 0; j < this.numStates - 1; j++) {
            if(r2 > j / this.numStates && r2 < (j + 1) / this.numStates) this.ruleset[i] = j + 1;
          }
        }
      }
    },
    update: function() {
      var tot = 0;
      for(var i = this.sizeX-1; i < (2 * this.sizeX) - 1; i++) {
        for(var j = this.sizeY-1; j < (2 * this.sizeY) - 1; j++) {
          // this.buffer[i%this.sizeX][j%this.sizeY] = 0;
          tot = 0;
          for(var k = -1; k < 2; k++) {
            for(var l = -1; l < 2; l++) {
              if((k === 0 && l === 0) === false) tot += this.cells[(i+k)%this.sizeX][(j+l)%this.sizeY];
            }
          }
          for(var r = 0; r < this.ruleset.length; r++) {
            if(tot === r) this.buffer[i%this.sizeX][j%this.sizeY] = this.ruleset[r];
            // else b[i%this.sizeX][j%this.sizeY] = this.cells[i%this.sizeX][j%this.sizeY];
          }
        }
      }
      this.cells = this.buffer;
      this.genCount++;
    }
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
  it.CA2D = CA2D;
  it.PerlinFunction = PerlinFunction;

})(itera);
