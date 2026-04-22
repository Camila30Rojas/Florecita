
let mariposita;
let video;
let faceMesh;
let camera;
let targetX;
let targetY;
let currentX;
let currentY;
let hasFace = false;

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

    fill(123, 63, 0);
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

    // 3 petalo
    fill(135, 206, 235);
    rotate(-5 / 6);
    ellipse(-23, 176, 81, 155);
    fill(255, 255, 255);
    push();
    translate(-23, 176);
    rotate(frameCount * 0.1);
    ellipse(0, 0, 20, 20);
    pop();

    // 3 petalo
    fill(173, 216, 230);
    rotate(2 / 6);
    ellipse(111, 346, 75, 120);
    fill(255, 255, 255);
    push();
    translate(111, 346);
    rotate(frameCount * 0.1);
    ellipse(0, 0, 20, 20);
    pop();

    // 2 petalo
    fill(173, 216, 230);
    rotate(6 / 6);
    ellipse(230, 164, 75, 120);
    fill(255, 255, 255);
    push();
    translate(230, 164);
    rotate(frameCount * 0.1);
    ellipse(0, 0, 20, 20);
    pop();

    pop();
  }
}

function setup() {
  createCanvas(400, 400);
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  targetX = width / 2;
  targetY = height / 2;
  currentX = targetX;
  currentY = targetY;

  mariposita = new Mariposita(currentX, currentY, 100);

  faceMesh = new FaceMesh({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
  });

  faceMesh.setOptions({
    maxNumFaces: 1,
    refineLandmarks: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
  });

  faceMesh.onResults(handleFaceResults);

  camera = new Camera(video.elt, {
    width: 640,
    height: 480,
    onFrame: async () => {
      await faceMesh.send({ image: video.elt });
    },
  });

  camera.start();
}

function handleFaceResults(results) {
  if (!results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) {
    hasFace = false;
    return;
  }

  const landmarks = results.multiFaceLandmarks[0];
  let minX = 1;
  let minY = 1;
  let maxX = 0;
  let maxY = 0;

  for (const point of landmarks) {
    minX = min(minX, point.x);
    minY = min(minY, point.y);
    maxX = max(maxX, point.x);
    maxY = max(maxY, point.y);
  }

  const faceCenterX = (minX + maxX) / 2;
  const faceCenterY = (minY + maxY) / 2;

  targetX = map(faceCenterX, 0, 1, 0, width);
  targetY = map(faceCenterY, 0, 1, 0, height);
  hasFace = true;
}

function draw() {
  background('#c8a2c8');

  currentX = lerp(currentX, targetX, 0.15);
  currentY = lerp(currentY, targetY, 0.15);

  mariposita.x = currentX;
  mariposita.y = currentY;
  mariposita.show();

  if (!hasFace) {
    fill(255);
    noStroke();
    textSize(14);
    textAlign(CENTER, TOP);
    text('Activa la camara y coloca tu rostro frente al sensor', width / 2, 12);
  }
}

