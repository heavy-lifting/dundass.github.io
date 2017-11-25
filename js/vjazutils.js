var vjutils = vjutils || {};
(function(vj) {

  var getPalette = function(img) {
    var d = pixelDensity();
    img.loadPixels();
    var pix = img.pixels.map(x => x * 1.5);
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

  vj.getPalette = getPalette;
})(vjutils);
