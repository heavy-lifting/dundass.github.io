var vjaz = vjaz || {};
(function(vj) {

  var PixelProcessor = function() {
    this.pix = [];
    // the one that applies same process to all hue vals and can reference other pixels
  }

  var Cucumber = function() {
    this.slices = 10;
    this.sliceHues = [];
    this.sliced = 0;
    this.slicesRotating = 0;
    this.loc = new p5.Vector(0, 0);
  }

  Cucumber.prototype = {
    render: function(img, palette) {
      push();
      translate(width / 4, height / 2);
      for(var i = 0; i < this.slices; i++) {
        var wdt = width / 100;
        colorMode(HSB, 255);
        // noStroke();
        // fill(109, 112, 202);
        // rect(this.loc.x + i * wdt, this.loc.y, wdt, height / 10);
        strokeWeight(20);
        stroke(109, 150, 172);
        noFill();
        ellipse(this.loc.x + i * wdt, this.loc.y, 1, height / 10);
      }
      pop();
    }
  }

  vj.Cucumber = Cucumber;
})(vjaz);
