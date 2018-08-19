var vutils = vutils || {};
(function(vj) {

  var ease = function(val, tar, e) {
    var d =  tar - val;
    if(Math.abs(d) > 0.00001) val += (d * e);
    return val;
  }

  var lerp = function(val, tar, inc) {
    var d = val - tar;
    if(Math.abs(d) >= inc) {
      if(d < 0) val += inc;
      else if(d > 0) val -= inc;
    }
    return val;
  }

  var getPalette = function(img) {
    // make this independent of p5 ! or incorporate this func into vjaz.js ...
    var d = pixelDensity();
    img.loadPixels();
    var pix = img.pixels.map(x => x * 1.5); // um.... not always gna be the case
    var c = [];
    for(var i = 0; i < pix.length; i += 4) {
      c.push(pix[i] + ' ' + pix[i+1] + ' ' + pix[i+2]);
    }
    c.sort();
    var tally = [];
    for(var i = 0; i < c.length; i++) {
      // how t f do u work this out ??
    }
  }

  vj.ease = ease;
  vj.lerp = lerp;
  vj.getPalette = getPalette;
})(vutils);
