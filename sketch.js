let imgClosed, imgMid, imgOpen;
let wingL, wingR, bow;
let music;
let musicStarted = false;
let grass;
let rot;
let wingAngle = 0;

// eyes animation
let eyeState = 'closed';
let eyeTimer = 0;
const MID_DURATION = 120;
const OPEN_DURATION = 2000;

// raining letters
let letters = [];
const CHARS = ['あ','い','う','え','お','か','き','く','け','こ',
                'さ','し','す','な','に','ぬ','は','ひ','ほ','ま',
                '♡','♥','☆','★','✿','。','、','〜','・'];
const NUM_BEHIND = 80;
const NUM_FRONT  = 15;

function preload() {
  imgClosed = loadImage('lolitaclosedeyes.png');
  imgMid    = loadImage('lolitamideyes.png');
  imgOpen   = loadImage('lolitaopeneyes.png');
  wingL = loadImage('leftwing.png');
  wingR = loadImage('rightwing.png');
  bow   = loadImage('bow.png');
  music = loadSound('Yumeiro Patissiere OST - 21 - Kokoro mo Torokeru Madeleine.mp3');
}

function setup() {
  createCanvas(400, 600);
  grass = new yard();
  noCursor();

  // behind letters
  for (let i = 0; i < NUM_BEHIND; i++) {
    letters.push(new Letter(random(width), random(-height, height), false));
  }
  // spawn in-front letters
  for (let i = 0; i < NUM_FRONT; i++) {
    letters.push(new Letter(random(width), random(-height, height), true));
  }
}

function mousePressed() {
  // start music on very first click, loops forever
  if (!musicStarted) {
    music.loop();
    music.play();
    musicStarted = true;
  }
  
  // eye animation
  if (eyeState === 'closed') {
    eyeState = 'opening';
    eyeTimer = millis();
  }
}

function draw() {
  background("white");
  grass.update();
  wingAngle += 0.03;

  // eye state machine
  let now = millis();
  let elapsed = now - eyeTimer;
  if (eyeState === 'opening' && elapsed > MID_DURATION) {
    eyeState = 'open';
    eyeTimer = now;
  } else if (eyeState === 'open' && elapsed > OPEN_DURATION) {
    eyeState = 'closing';
    eyeTimer = now;
  } else if (eyeState === 'closing' && elapsed > MID_DURATION) {
    eyeState = 'closed';
  }

  // letters in behind
  for (let l of letters) {
    if (!l.inFront) { l.update(); l.show(); }
  }

  // left wing
  push();
  translate(width/2-130, height/2+18);
  rotate(-sin(wingAngle) * 0.3);
  image(wingL, -width/2, -height/2, width, height);
  pop();

  // right wing
  push();
  translate(width/2-20, height/2+22);
  rotate(sin(wingAngle) * 0.3);
  image(wingR, -width/2, -height/2, width, height);
  pop();

  // girl (layer based on eye state)
  if (eyeState === 'closed') {
    image(imgClosed, 0, 0, width, height);
  } else if (eyeState === 'opening' || eyeState === 'closing') {
    image(imgMid, 0, 0, width, height);
  } else if (eyeState === 'open') {
    image(imgOpen, 0, 0, width, height);
  }

  // letters in front
  for (let l of letters) {
    if (l.inFront) { l.update(); l.show(); }
  }

  // bow moise (always on top)
  imageMode(CENTER);
  image(bow, mouseX, mouseY, 250, 250);
  imageMode(CORNER);
}

// letter
class Letter {
  constructor(x, y, inFront) {
    this.x = x;
    this.y = y;
    this.inFront = inFront;
    this.speed = random(0.3, 1.0);
    this.char = random(CHARS);
    this.size = random(12, 22);
    let isPink = random() < 0.2; // 20% pink, 80% blue
    if (inFront) {
      this.col = isPink
        ? color(255, 182, 200, random(100, 150))
        : color(160, 200, 255, random(100, 150));
    } else {
      this.col = isPink
        ? color(255, 182, 200, random(160, 220))
        : color(160, 200, 255, random(160, 220));
    }
  }

  update() {
    this.y += this.speed;
    if (this.y > height + 20) {
      this.y = random(-60, 0);
      this.x = random(width);
      this.char = random(CHARS);
    }
  }

  show() {
    noStroke();
    fill(this.col);
    textSize(this.size);
    text(this.char, this.x, this.y);
  }
}

// grass/yard
function yard() {
  this.grass = [];
  this.roff = [];
  this.size = [];
  this.seg = [];
  let index = 0;
  this.population = 150;
  for (let x = 0; x < width; x += width / this.population) {
    index += 1;
    this.grass.push(x);
    this.roff.push((index * 0.065) + 0.015);
    this.size.push(random(40, 50));
    this.seg.push(0.85);
  }
  this.update = function () {
    for (let i = 0; i < this.grass.length; i++) {
      let len = this.size[i];
      push();
      translate(this.grass[i], height * 1.02);
      this.blade(len, i, len * 0.087);
      pop();
    }
  }
  this.blade = function (len, ind, weight) {
    if (ind % 2 === 0) {
      this.roff[ind] += 0.0005;
      stroke(255, 218, 224, 255);
      rot = map(noise(this.roff[ind]), 0, 1,
        -QUARTER_PI * 0.75, QUARTER_PI * 0.75);
    } else {
      this.roff[ind] += 0.0005;
      stroke(220, 240, 250, 255);
      rot = map(-sin(this.roff[ind]), -2, 1,
        -QUARTER_PI * 0.75, QUARTER_PI * 0.75);
    }
    strokeWeight(weight);
    rotate(rot);
    line(0, 0, 0, -len);
    translate(0, -len);
    if (len > 8) {
      this.blade(len * this.seg[ind], ind, weight * 0.75);
    }
  }
}