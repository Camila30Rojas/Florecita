letMariposita; 

function setup() {
  createCanvas(640, 480);
  Mariposita = new Mariposita (width /2 , height / 2, 100);
}

function draw() {
  background(100, 149, 237);
  Mariposita .show();
}

class Mariposita {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
  }
 
  show() {
       const yMove = sin(frameCount * 0.05) * 15;
    const scaleFactor = this.size / 100;

    push();
    translate(this.x, this.y + yMove);
    scale(scaleFactor);
    translate(-195, -200);

    fill(200, 162, 100);
    ellipse(195, 200, 40, 40);

    stroke(255, 255, 255);
    strokeWeight(19);
    ellipse(195, 135, 45, 50);

    // 2 petalo
    fill(135, 206, 235);
    rotate(4 / 6);
    ellipse(292, -65, 81, 155);
    fill(255, 255, 255);
    push();
    translate(292, -65);
    rotate(frameCount * 0.1);
    ellipse(0, 0, 20, 20);
    pop();

    // 3 petalo
    fill(123, 63, 0);
    rotate(-4 / 6);
    ellipse(195, 245, 50, 165);

    // 3
  }
}