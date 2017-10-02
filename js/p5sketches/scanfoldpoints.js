function ScanFoldPoints() {
  this.loc = 0; // loc of center
  this.tar = 0; // target loc of center
  this.p = []; // point locs array
  this.trig1 = 0;    //0 = sin, 1 = cos, 2 = tan, 3 = atan
  this.trig2 = 1;
  this.reloadCount = 0; // num times visual has cycled
  this.hue = 150;
  this.sat = 200;
  this.t_mult1 = 0.04;  // trig result reduction
  this.t_mult2 = 0.04;
}

ScanFoldPoints.prototype.update = function() {
	var d = 0, trig = 0, a = 0;
	for(var i = 0; i < this.p.length; i++) {
		for(var j = 0; j < this.p.length; j++) {
			d = dist(this.p[i].x, this.p[i].y, width - this.p[j].x, this.p[j].y);
			if(this.reloadCount % 2 == 0) a = d / this.p[i].y;
			else a = d / this.p[j].y;
			switch(this.trig1) {
  			case 0:  trig = Math.sin(a);  break;
  			case 1:  trig = Math.cos(a);  break;
  			case 2:  trig = Math.tan(a);  break;
  			case 3:  trig = Math.atan(a);  break;
			}
			this.p[i].x += (this.t_mult1 * trig);
			if(this.reloadCount % 3 <= 1) a = d / this.p[i].x;
			else a = d / this.p[j].x;
			switch(this.trig2) {
  			case 0:  trig = Math.sin(a);  break;
  			case 1:  trig = Math.cos(a);  break;
  			case 2:  trig = Math.tan(a);  break;
  			case 3:  trig = Math.atan(a);  break;
			}
			this.p[i].y += (this.t_mult2 * trig);
		}
	}
}


ScanFoldPoints.prototype.initRand = function() {
	randomSeed(1);
	for(var i = 0; i < this.p.length; i++) {
		this.p[i].x = this.loc.x + random(-50, 50);  this.p[i].y = this.loc.y + random(-250, 250);
	}
}

ScanFoldPoints.prototype.initHorizontal = function() {
	for(var i = 0; i < this.p.length; i++) {
		this.p[i].x = 400 + (-i * i);  this.p[i].y = -150 + (frameCount % 300) + sq(1);
	}
}

ScanFoldPoints.prototype.initMotion = function() {
	randomSeed(frameCount % 10000);

	this.loc = createVector(random(-width / 2, width / 2), random(-height / 2, -height / 4));
	this.tar = createVector(this.loc.x * -1, random(height / 4, height / 2));

	if(Math.random() > 0.5) {
		this.loc.y *= -1;
		this.tar.y *= -1;
	}
}

ScanFoldPoints.prototype.randomiseTrigMappings = function() {
  // assigns a new non-linear coordinate behaviour
	this.trig1 = int(Math.random() * 4); // used to be (int)random(4) in ScanFoldPoints.java
	this.trig2 = int(Math.random() * 4);
	this.t_mult1 = 0.02 + (Math.random() * 0.06);
	this.t_mult2 = 0.02 + (Math.random() * 0.06);
}

ScanFoldPoints.prototype.drawParticles = function(index) {
	push();
  noiseSeed(99);
	translate(width / 2, height / 2);
	strokeWeight(2);
	colorMode(HSB);
	for(var i = 0; i < this.p.length; i++) {
		stroke((this.loc.x / 4) + ((70 * noise(index)) - 10), this.sat, 255);
		point(this.p[i].x, this.p[i].y);
	}
	pop();
}

ScanFoldPoints.prototype.render = function() {
  background(0);
	this.loc.x = lerp(this.loc.x, this.tar.x, 0.01);
	this.loc.y = lerp(this.loc.y, this.tar.y, 0.01);
	if(dist(this.loc.x, this.loc.y, this.tar.x, this.tar.y) < 2.) {
		this.initMotion();
		this.reloadCount++;
		if(this.reloadCount % 3 == 0) this.randomiseTrigMappings();
		this.hue = 100 + (Math.random() * 100);
		//this.sat = 20 + (Math.random() * 180);
	}
	this.initRand();
	for(var i = 0; i < 100; i++) {
		this.update();
		this.drawParticles(i);
	}
}

ScanFoldPoints.prototype.initi = function() {
  this.loc = createVector(0, 0);
  this.tar = createVector(0, 0);
	this.initMotion();
  for(var i = 0; i < 40; i++) {
    this.p[i] = createVector(-150 + (Math.random() * 300), -150 + (Math.random() * 300));
  }
}
