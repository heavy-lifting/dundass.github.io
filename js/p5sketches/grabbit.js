function Assets() {
  this.grassImg = null;
  this.foodImgs = [];
  this.farmerImgs = [];
  this.grabbitImgs = [];
}

Assets.prototype.loadAssets = function() {
  this.grassImg = loadImage("assets/grabbit-grass.png");
  this.foodImgs[0] = loadImage("assets/grabbit-food1.png");
  this.foodImgs[1] = loadImage("assets/grabbit-food2.png");
  this.farmerImgs[0] = loadImage("assets/grabbit-farmer-sleep1.png");
  this.farmerImgs[1] = loadImage("assets/grabbit-farmer-sleep2.png");
  this.farmerImgs[2] = loadImage("assets/grabbit-farmer-awake1.png");
  this.farmerImgs[3] = loadImage("assets/grabbit-farmer-awake2.png");
  this.grabbitImgs[0] = loadImage("assets/grabbit1.png");
  this.grabbitImgs[1] = loadImage("assets/grabbit2.png");
  this.grabbitImgs[2] = loadImage("assets/grabbit4.png");
  this.grabbitImgs[3] = loadImage("assets/grabbit3.png");
}

function Scoreboard(maxLevel) {
  this.live = 1;
  this.level = 1;
  this.maxLevel = maxLevel;
  this.won = false;
}

Scoreboard.prototype.update = function() {
  if(this.level == this.maxLevel) this.won = true;
}

Scoreboard.prototype.render = function() {
  fill(0);
  if(this.won) {
    textSize(40);
    text("woohoo ! you won :)", width / 2 - 50, height / 2 - 50);
    text("click to play again !", width / 2 - 50, height / 2);
  }
  else {
    textSize(20);
    text("Level: " + this.level, 23, 23);
    text("Food left: " + this.live, 129, 23);
  }
}

function Player() {
  this.loc = new p5.Vector(200 + (Math.random()*(width-200)), 200 + (Math.random()*(height-200)));
  this.speed = 3;
}

Player.prototype.update = function(dirs) {

  // update loc based on key states
  if(dirs[0]) this.loc.y -= this.speed;
  if(dirs[1]) this.loc.x -= this.speed;
  if(dirs[2]) this.loc.y += this.speed;
  if(dirs[3]) this.loc.x += this.speed;

  // boundary checks
  if(this.loc.x < 0) this.loc.x = 0;
  if(this.loc.x > width) this.loc.x = width;
  if(this.loc.y < 0) this.loc.y = 0;
  if(this.loc.y > height) this.loc.y = height;
}

Player.prototype.render = function(img) {
  noStroke();
  fill(0);
  imageMode(CENTER);
  if(img) image(img, this.loc.x, this.loc.y);
  else ellipse(this.loc.x, this.loc.y, 50, 50);
}

function Enemy(playerx, playery) {
  this.loc = new p5.Vector((playerx + width/2)%width, (playery + height/2)%height);
  this.vel = new p5.Vector(0, 0);
  this.awake = false;
}

Enemy.prototype.update = function(playerx, playery) {
  if(dist(this.loc.x, this.loc.y, playerx, playery) < height / 4) {
    var playerloc = new p5.Vector(playerx, playery);
    var acc = p5.Vector.sub(playerloc, this.loc);
    acc.setMag(0.1);
    this.vel.add(acc);
    this.vel.limit(3);
    this.loc.add(this.vel);
    this.awake = true;
  } else {
    this.vel.x = 0;
    this.vel.y = 0;
    this.awake = false;
  }
}

Enemy.prototype.render = function(imgs) {
  noStroke();
  fill(255, 0, 0);
  imageMode(CENTER);
  if(imgs) {
    if(this.awake == true) {
      image(imgs[2], this.loc.x, this.loc.y);
    } else {
      image(imgs[parseInt(frameCount/30)%60], this.loc.x, this.loc.y);
    }
  }
  else {
    ellipse(this.loc.x, this.loc.y, 20, 20);
  }
}

// Enemy.prototype.reset = function(playerx, playery) {
//   this.loc = new p5.Vector(width / 4 + Math.random() * width / 2, height / 4 + Math.random() * height / 2);
//   while(dist(this.loc.x, this.loc.y, playerx, playery) < 50) {
//       this.loc = new p5.Vector(width / 4 + Math.random() * width / 2, height / 4 + Math.random() * height / 2);
//   }
// }

function Food() {
  this.loc = new p5.Vector(35+(Math.random() * width-35), 35+(Math.random() * height-35));
  this.eaten = true;
}

Food.prototype.render = function(img) {
  if(this.eaten == false) {
    noStroke();
    fill(0, 255, 0);
    rectMode(CENTER);
    if(img) image(img, this.loc.x, this.loc.y);
    else rect(this.loc.x, this.loc.y, 50, 50);
  }
}

Food.prototype.reset = function(playerx, playery) {
  this.loc = new p5.Vector(35+(Math.random() * width-35), 35+(Math.random() * height-35));
  while(dist(this.loc.x, this.loc.y, playerx, playery) < width / 4) {
      this.loc = new p5.Vector(35+(Math.random() * width-35), 35+(Math.random() * height-35));
  }
}

function Grabbit() {
  this.assets = new Assets();
  this.assets.loadAssets();
  this.maxFood = 11;
  this.player = new Player();
  this.board = new Scoreboard(this.maxFood);
  this.foods = [];
  for(var i = 0; i < this.maxFood; i++) this.foods[i] = new Food();
  this.enemy = new Enemy(this.player.loc.x, this.player.loc.y);
  this.foods[0].eaten = false;
  this.wasd = [false, false, false, false];
}

Grabbit.prototype.update = function() {
  this.player.update(this.wasd);
  this.enemy.update(this.player.loc.x, this.player.loc.y);
  this.board.update();
  for(var i = 0; i < this.foods.length; i++) {
    // food dist
    if(dist(this.player.loc.x, this.player.loc.y, this.foods[i].loc.x, this.foods[i].loc.y) < 50) {
      if(this.foods[i].eaten == false) this.board.live--;
      this.foods[i].eaten = true;
      if(this.board.live <= 0) this.levelUp();
    }
  }
  // enemy dist
  if(dist(this.player.loc.x, this.player.loc.y, this.enemy.loc.x, this.enemy.loc.y) < 50) {
    this.levelDown();
  }
}

Grabbit.prototype.render = function() {
  imageMode(CORNER);
  image(this.assets.grassImg, 0, 0);
  this.player.render(this.assets.grabbitImgs[0]);
  for(var i = 0; i < this.foods.length; i++) this.foods[i].render(this.assets.foodImgs[1]);
  this.enemy.render(this.assets.farmerImgs);
  this.board.render();
}

Grabbit.prototype.reset = function() {
  this.board.won = false;
  for(var i = 0; i < this.foods.length; i++) {
    if(this.board.level > 1) this.levelDown();
  }
}

Grabbit.prototype.levelUp = function() {
  this.board.level++;
  this.board.live = this.board.level;
  for(var i = 0; i < this.foods.length; i++) {
    this.foods[i].reset(this.player.loc.x, this.player.loc.y);
    if(i < this.board.level && this.board.level < this.foods.length) this.foods[i].eaten = false;
    else if(i >= this.board.level) this.foods[i].eaten = true;
  }
  var r = parseInt(Math.random()*this.foods.length);
  this.enemy.loc.x = this.foods[r].loc.x + (-5 + Math.random() * 10);
  this.enemy.loc.y = this.foods[r].loc.y + (-5 + Math.random() * 10);
}

Grabbit.prototype.levelDown = function() {
  if(this.board.level > 1) this.board.level--;
  for(var i = 0; i < this.foods.length; i++) {
    this.foods[i].reset(this.player.loc.x, this.player.loc.y);
    if(i < this.board.level && this.board.level < this.foods.length) this.foods[i].eaten = false;
    else if(i >= this.board.level) this.foods[i].eaten = true;
  }
  this.board.live = this.board.level;
  var r = parseInt(Math.random()*this.foods.length);
  this.enemy.loc.x = this.foods[r].loc.x + (-5 + Math.random() * 10);
  this.enemy.loc.y = this.foods[r].loc.y + (-5 + Math.random() * 10);
}
