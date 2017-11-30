var vjaz = vjaz || {};
(function(vj) {

  var ease = function(val, tar, e) {
    var d = Math.abs(val - tar);
    if(d > 0.0001) val += (d * e);
    return val;
  }

  var PixelProcessor = function(sizeX, sizeY) {
    this.hues = [];
    for(var i = 0; i < sizeX * sizeY; i++) this.hues[i] = 0;
    this.op = function(x, y) { return 0; };
    // the one that applies same process to all hue vals and can reference other pixels
  }

  PixelProcessor.prototype = {
    set: function(f) {
      this.op = f;
    },
    render: function() {
      this.hues = this.hues.map(this.op);
    }
  }

  var Formulate = function(numRects, numLayers) {
    this.numRects = numRects;
    this.numLayers = numLayers;
    this.leng = 19;
    this.lengTar = 19;
  }

  Formulate.prototype = {
    modrects: function(n) {
      this.numRects += n;
      this.numRects = this.numRects < 0 ? 0 : this.numRects;
    },
    resize: function(s) {
      this.lengTar += s;
    },
    render: function(t) {
      t = t === 'undefined' ? frameCount / 30.0 : t;
      this.leng = ease(this.leng, this.lengTar, 0.1);
      for(var i = 0; i < this.numLayers; i++) {
        for(var j = 0; j < this.numRects; j++) {
          push();
          // colorMode();
          rectMode(CENTER);
          translate(width / 2, height / 2);
          var r = (t + ((i-1) * t / 3)) + (j * 2 * Math.PI / this.numRects);
          rotate(-r);
          noStroke();
          fill(70, 140, 250);
          var y = ((i+1) * height / 7) + (Math.sin(t) * height / 25);
          var xs = this.leng * height / 340;
          var ys = height / this.leng;
          rect(0, y, xs, ys);
          rotate(2 * r);
          fill(140, 250, 240);
          rect(0, y, xs, ys);
          pop();
        }
      }
    }
  }

  function BreathingEye() {
    this.rotateFactor = 250;
  }

  BreathingEye.prototype = {
    render: function(t) {
      t = t === 'undefined' ? frameCount / 30.0 : t;
      var sin1 = (width / 10) * sin(t - 90) + (width / 10);
      var sin2 = (width / 15) * sin(t + 160) + (width / 15);

      push();
      translate(width / 2, height / 2);
      noStroke();
      rotate(t * this.rotateFactor);
      colorMode(RGB, 255);
      fill(sin1, sin2, 255 - sin1, 100);
      ellipse(sin2 + 20, sin1, 10, sin1);

      if(sin1 > (width / 10)) {
        fill(sin1, sin2, 255 - sin1, 100);
        ellipse(sin2 + (width / 20), sin1, (sin1 - (width / 10)) * 0.66, (sin1 - (width / 10)) * 0.66);
        fill(0, 10);
        rect(0, 0, width, height);
      }
      pop();
    }
  }

  var ColorCA2D = function(ca) {
    this.ca = ca;
  }

  ColorCA2D.prototype = {
    render: function() {
      colorMode(HSB, 255);
      rectMode(CORNER);
      // noStroke(); fill(0, 90); rect(0, 0, width, height);
      if(frameCount % 1 === 0) this.ca.update();

      for(var i = 0; i < this.ca.sizeX; i++) {
        for(var j = 0; j < this.ca.sizeY; j++) {
          noStroke();
          if(this.ca.cells[i][j] > 0) fill(255 - (this.ca.cells[i][j] * 255 / this.ca.numStates), 255, 255);
          else fill(0);
          rect(i * width / this.ca.sizeX, j * height / this.ca.sizeY, width / this.ca.sizeX, height / this.ca.sizeY);
        }
      }
    }
  }

  var Cucumber = function() {
    this.slices = 20;
    this.sliceImgIndex = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    this.sliced = 0;
    this.slicesRotating = 0;
    this.colorSpeed = 10;
    this.colorDepth = 4;
    this.loc = new p5.Vector(0, 0);
  }

  Cucumber.prototype = {
    render: function(imgs, palette) {
      push();
      translate(width / 5, height / 3);
      for(var i = 0; i < this.slices; i++) {
        var wdt = width / 70;
        var hgt = i < parseInt(this.slices / 2) ? (i+1) * height * 0.4 / this.slices : height / 5;
        colorMode(HSB, 255);
        strokeWeight(20);
        // stroke(109, 150, 172);
        var colScroll = parseInt(palette.length/this.colorDepth);
        colScroll = colScroll ? colScroll : 1;
        var colSpeed = parseInt(i+frameCount/this.colorSpeed);
        colSpeed = colSpeed ? colSpeed : 1;
        stroke(palette[colSpeed%colScroll]);
        noFill();
        var rot = i >= this.slices - this.slicesRotating ? hgt : 0;
        var sep = i >= this.slices - this.sliced ? 2 : 1;
        this.sliceImgIndex[i] = (sin(frameCount/40) > -0.01 && sin(frameCount/40) < 0.01) ? parseInt(random(imgs.length)) : this.sliceImgIndex[i];
        ellipse(this.loc.x + i * wdt * sep, this.loc.y, 1 + rot * sin(frameCount/(40+i)), hgt);
        imageMode(CENTER);
        image(imgs[this.sliceImgIndex[i]], this.loc.x + i * wdt * sep, this.loc.y, 0.1 + rot * sin(frameCount/(40+i)), hgt);
      }
      pop();
    }
  }

  var Particle = function(x, y, s) {
    this.loc = new p5.Vector(x, y);
    this.vel = new p5.Vector(random(-1,1), random(-1,1));
    this.acc = new p5.Vector(0, 0);
    this.maxVel = 0.1;
    this.size = typeof s === 'undefined' ? 30 : s;
    this.life = 100;
    this.decay = 0;
  }

  Particle.prototype = {
    update: function() {
      this.vel.add(this.acc);
      this.vel.limit(this.maxVel);
      this.loc.add(this.vel);
      this.acc.mult(0);
      this.life - this.decay;
    },
    apply: function(force) {
      this.acc.add(force);
    },
    display: function(col) {
      strokeWeight(this.size);
      stroke(col);
      point(this.loc.x, this.loc.y);
    },
    displayImage: function(img) {
      imageMode(CENTER);
      image(img, this.loc.x, this.loc.y, this.size, this.size);
    }
  }

  var WateryParticles = function(n) {
    this.particles = [];
    for(var i = 0; i < n; i++) this.particles.push(new Particle(width / 2 + random(-100,100), height / 2 + random(-100,100)));
    this.wrap = true;
    this.drag = 0.001;
  }

  WateryParticles.prototype = {
    add: function(n, x, y) {
      n = typeof n === 'undefined' ? 1 : n;
      x = typeof x === 'undefined' ? 0 : x;
      y = typeof y === 'undefined' ? 0 : y;
      for(var i = 0; i < n; i++) this.particles.push(new Particle(x, y));
    },
    remove: function(n) {
      n = typeof n === 'undefined' ? 1 : n;
      this.particles.splice(0, n);
    },
    apply: function(x, y) {
      var force = new p5.Vector(x, y);
      for(var i = 0; i < this.particles.length; i++) {
        this.particles[i].apply(force);
      }
    },
    attract: function(x, y, damp) {
      damp = typeof damp === 'undefined' ? 0.1 : damp;
      var v = new p5.Vector(x, y);
      for(var i = 0; i < this.particles.length; i++) {
        v.x = x; v.y = y;
        v.sub(this.particles[i].loc);
        v.setMag(damp);
        this.particles[i].acc.add(v);
      }
    },
    repel: function(x, y, damp) {
      damp = typeof damp === 'undefined' ? 0.1 : damp;
      var v = new p5.Vector(x, y);
      for(var i = 0; i < this.particles.length; i++) {
        v.x = x; v.y = y;
        v.sub(this.particles[i].loc);
        v.mult(-1);
        v.setMag(damp);
        this.particles[i].acc.add(v);
      }
    },
    edges: function() {
      if(this.wrap) {
        for(var i = 0; i < this.particles.length; i++) {
          this.particles[i].loc.x = this.particles[i].loc.x < 0 ? width - 1 : this.particles[i].loc.x;
          this.particles[i].loc.y = this.particles[i].loc.y < 0 ? height - 1 : this.particles[i].loc.y;
          this.particles[i].loc.x %= width;
          this.particles[i].loc.y %= height;
        }
      }
    },
    speed: function(s, p) {
      p = typeof p === 'undefined' ? 1 : p;
      for(var i = 0; i < this.particles.length; i++) {
        if(Math.random() < p) this.particles[i].maxVel = s;
      }
    },
    size: function(s, p) {
      p = typeof p === 'undefined' ? 1 : p;
      for(var i = 0; i < this.particles.length; i++) {
        if(Math.random() < p) this.particles[i].size = s;
      }
    },
    update: function() {
      for(var i = this.particles.length - 1; i >= 0; i--) {
        var spd = this.particles[i].vel.mag();
        var dragMag = this.drag * spd * spd;
        var d = this.particles[i].vel.copy();
        d.mult(-1);
        d.setMag(dragMag);
        this.particles[i].apply(d);
        // var friction = this.particles[i].vel.copy();
        // friction.normalize();
        // friction.mult(-1);
        // friction.mult(this.drag);
        // this.particles[i].apply(friction);
        this.particles[i].update();
        this.edges();
        if(this.particles[i].life <= 0) this.particles.splice(i, 1);
      }
    },
    render: function(col) {
      for(var i = 0; i < this.particles.length; i++) {
        this.update();
        typeof col.length !== 'undefined' ? this.particles[i].display(col[i%col.length]) :
                                    ( typeof col === 'undefined' ? this.particles[i].display(255) : this.particles[i].display(col) );
        // typeof col === 'undefined' ? this.particles[i].display(255) : this.particles[i].display(col);
      }
    },
    renderImage: function(img) {
      for(var i = 0; i < this.particles.length; i++) {
        this.update();
        img.length !== 'undefined' ? this.particles[i].displayImage(img[i%img.length]) : this.particles[i].displayImage(img);
      }
    }
  }

  vj.ease = ease;
  vj.Formulate = Formulate;
  vj.BreathingEye = BreathingEye;
  vj.ColorCA2D = ColorCA2D;
  vj.Cucumber = Cucumber;
  vj.Particle = Particle;
  vj.WateryParticles = WateryParticles;
})(vjaz);
