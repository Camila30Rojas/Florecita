
let mariposita;
let video;
let faceMesh;
let targetX;
let targetY;
let currentX;
let currentY;
let hasFace = false;
let neutralFaceX = null;
let neutralFaceY = null;
let baseX;
let baseY;
let isProcessingFaceMesh = false;
let lastFaceMeshRun = 0;
const FACE_MESH_INTERVAL_MS = 60;

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
  pixelDensity(1);
  frameRate(30);
  video = createCapture(VIDEO);
  video.size(320, 240);
  video.hide();

  targetX = width / 2;
  targetY = height / 2;
  currentX = targetX;
  currentY = targetY;
  baseX = targetX;
  baseY = targetY;

  mariposita = new Mariposita(currentX, currentY, 100);

  faceMesh = new FaceMesh({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
  });

  faceMesh.setOptions({
    maxNumFaces: 1,
    refineLandmarks: false,
    minDetectionConfidence: 0.6,
    minTrackingConfidence: 0.6,
  });

  faceMesh.onResults(handleFaceResults);
}

async function runFaceMeshIfNeeded() {
  if (isProcessingFaceMesh) {
    return;
  }

  if (!video || !video.elt || video.elt.readyState < 2) {
    return;
  }

  if (millis() - lastFaceMeshRun < FACE_MESH_INTERVAL_MS) {
    return;
  }

  isProcessingFaceMesh = true;
  lastFaceMeshRun = millis();

  try {
    await faceMesh.send({ image: video.elt });
  } finally {
    isProcessingFaceMesh = false;
  }
}

function handleFaceResults(results) {
  if (!results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) {
    hasFace = false;
    return;
  }

  const landmarks = results.multiFaceLandmarks[0];
  const facePoint = landmarks[1] || landmarks[0];
  const faceCenterX = facePoint.x;
  const faceCenterY = facePoint.y;

  if (neutralFaceX === null || neutralFaceY === null) {
    neutralFaceX = faceCenterX;
    neutralFaceY = faceCenterY;
  }

  const offsetX = (neutralFaceX - faceCenterX) * width * 5;
  const offsetY = (faceCenterY - neutralFaceY) * height * 5;

  targetX = constrain(baseX + offsetX, 0, width);
  targetY = constrain(baseY + offsetY, 0, height);
  hasFace = true;
}

function draw() {
  background('#c8a2c8');

  runFaceMeshIfNeeded();

  push();
  translate(width, 0);
  scale(-1, 1);
  tint(255, 90);
  image(video, 0, 0, width, height);
  noTint();
  pop();

  currentX = lerp(currentX, targetX, 0.45);
  currentY = lerp(currentY, targetY, 0.45);

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

