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

  var Particle = function(x, y, s) {
    this.loc = new p5.Vector(x, y);
    this.vel = new p5.Vector(random(-1,1), random(-1,1));
    this.acc = new p5.Vector(0, 0);
    this.maxVel = 3;
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
    this.drag = 0.00;
  }

  WateryParticles.prototype = {
    add: function(n) {
      n = typeof n === 'undefined' ? 1 : n;
      for(var i = 0; i < n; i++) this.particles.push(new Particle());
    },
    remove: function(n) {
      n = typeof n === 'undefined' ? 1 : n;
      this.particles.splice(0, n);
    },
    apply: function(force) {
      for(var i = 0; i < this.particles.length; i++) {
        this.particles[i].apply(force);
      }
    },
    attract: function(att, damp) {
      damp = typeof damp === 'undefined' ? 0.1 : damp;
      for(var i = 0; i < this.particles.length; i++) {
        var v = att.copy();
        v.sub(this.particles[i].loc);
        v.setMag(damp);
        this.particles[i].acc.add(v);
      }
    },
    repel: function(rep) {
      for(var i = 0; i < this.particles.length; i++) {

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
        col.length ? this.particles[i].display(col[i%col.length]) :
                     ( typeof col === 'undefined' ? this.particles[i].display(255) : this.particles[i].display(col) );
        // typeof col === 'undefined' ? this.particles[i].display(255) : this.particles[i].display(col);
      }
    },
    renderImage: function(img) {
      for(var i = 0; i < this.particles.length; i++) {
        this.update();
        img.length ? this.particles[i].displayImage(img[i%img.length]) : this.particles[i].displayImage(img);
      }
    }
  }

  vj.Cucumber = Cucumber;
  vj.Particle = Particle;
  vj.WateryParticles = WateryParticles;
})(vjaz);
