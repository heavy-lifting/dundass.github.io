function OctaveCurve(f) {
  this.f = f;
  this.amps = [1.0];
}

OctaveCurve.prototype.get = function(x) {
  var sum = 0, ampsum = 0;
  for(var i = 0; i < this.amps.length; i++) {
    sum += (this.f(x * (i+1)) * this.amps[i]);
    ampsum += this.amps[i];
  }
  return (sum / ampsum);
}

// var oct = new OctaveCurve( function(x) { return Math.sin(x/20); } );
// oct.amps = [0.3,0.0,0.7];
// var out = [];
//
// for(var j = 0; j < 128; j++) {
//   out[j] = oct.get(j);
// }
//
// out.forEach(x => console.log(x));
