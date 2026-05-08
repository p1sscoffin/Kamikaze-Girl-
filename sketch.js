let grass;
let rot; 
function setup() {
  createCanvas(400, 600);
  grass = new yard();
}
function draw() {
  background("white");
  grass.update();
}
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
    this.size.push(random(15, 25));          
    this.seg.push(0.85);
  }
  this.update = function () {
    for (let i = 0; i < this.grass.length; i++) {
      let len = this.size[i];
      push();
      translate(this.grass[i], height * 1.02);
      this.blade(len, i, len * 0.25);       // ✅ pass starting weight
      pop();
    }
  }
  this.blade = function (len, ind, weight) { // ✅ accept weight param
    if (ind % 2 === 0) {
      this.roff[ind] += 0.0005;            
      stroke(198, 232, 245, 255);
      rot = map(noise(this.roff[ind]), 0, 1,
        -QUARTER_PI * 0.75, QUARTER_PI * 0.75);
    } else {
      this.roff[ind] += 0.0005;            
      stroke(255, 218, 224, 255);
      rot = map(-sin(this.roff[ind]), -2, 1,
        -QUARTER_PI * 0.75, QUARTER_PI * 0.75);
    }
    strokeWeight(weight);                   // ✅ use weight instead of fixed size
    rotate(rot);
    line(0, 0, 0, -len);
    translate(0, -len);
    if (len > 8) {
      this.blade(len * this.seg[ind], ind, weight * 0.6); // ✅ taper each segment
    }
  }
}