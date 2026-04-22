let mariposita;
let video;
let faceMesh;
let targetX;
let targetY;
let currentX;
let currentY;
let previousX;
let previousY;
let trailDX = 0;
let trailDY = 0;
let hasFace = false;
let isProcessingFaceMesh = false;
let lastFaceMeshRun = 0;

const FACE_MESH_INTERVAL_MS = 60;
const FLOW_STATE = {
  INIT: 'Inicializando',
  CAMERA_READY: 'Camara lista',
  SEARCHING_FACE: 'Buscando rostro...',
  FACE_DETECTED: 'Rostro detectado',
  ERROR: 'Error',
};

let appStatus = FLOW_STATE.INIT;

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
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  frameRate(30);

  video = createCapture(VIDEO, () => {
    appStatus = FLOW_STATE.CAMERA_READY;
  });

  video.size(320, 240);
  video.elt.setAttribute('playsinline', '');
  video.hide();

  resetTrackingToCenter();
  createMaripositas();

  if (typeof FaceMesh === 'undefined') {
    appStatus = `${FLOW_STATE.ERROR}: FaceMesh no cargo`;
    return;
  }

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
  appStatus = FLOW_STATE.SEARCHING_FACE;
}

function resetTrackingToCenter() {
  targetX = width / 2;
  targetY = height / 2;
  currentX = targetX;
  currentY = targetY;
  previousX = currentX;
  previousY = currentY;
  trailDX = 0;
  trailDY = 0;
}

function createMaripositas() {
  const flowerSize = constrain(min(width, height) * 0.25, 80, 180);
  mariposita = new Mariposita(width / 2, height / 2, flowerSize);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  createMaripositas();
  resetTrackingToCenter();
}

async function runFaceMeshIfNeeded() {
  if (isProcessingFaceMesh) {
    return;
  }

  if (!video || !video.elt || video.elt.readyState < 2) {
    return;
  }

  if (!faceMesh) {
    return;
  }

  if (millis() - lastFaceMeshRun < FACE_MESH_INTERVAL_MS) {
    return;
  }

  isProcessingFaceMesh = true;
  lastFaceMeshRun = millis();

  try {
    await faceMesh.send({ image: video.elt });
    appStatus = hasFace ? FLOW_STATE.FACE_DETECTED : FLOW_STATE.SEARCHING_FACE;
  } catch (error) {
    appStatus = `${FLOW_STATE.ERROR}: FaceMesh`; 
  } finally {
    isProcessingFaceMesh = false;
  }
}

function handleFaceResults(results) {
  if (!results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) {
    hasFace = false;
    appStatus = FLOW_STATE.SEARCHING_FACE;
    return;
  }

  const landmarks = results.multiFaceLandmarks[0];
  const facePoint = landmarks[1] || landmarks[0];
  const faceCenterX = facePoint.x;
  const faceCenterY = facePoint.y;

  const mirrorX = 1 - faceCenterX;
  targetX = constrain(map(mirrorX, 0, 1, 0, width), 0, width);
  targetY = constrain(map(faceCenterY, 0, 1, 0, height), 0, height);
  hasFace = true;
  appStatus = FLOW_STATE.FACE_DETECTED;
}

function drawSingleMariposita() {
  const trailBoost = 11;
  const safeMargin = 50;

  const x = constrain(currentX + trailDX * trailBoost, safeMargin, width - safeMargin);
  const y = constrain(currentY + trailDY * trailBoost, safeMargin, height - safeMargin);

  mariposita.x = x;
  mariposita.y = y;
  mariposita.show();
}

function draw() {
  background('#c8a2c8');

  runFaceMeshIfNeeded();

  currentX = lerp(currentX, targetX, 0.55);
  currentY = lerp(currentY, targetY, 0.55);

  const frameDX = currentX - previousX;
  const frameDY = currentY - previousY;
  trailDX = lerp(trailDX, frameDX, 0.75);
  trailDY = lerp(trailDY, frameDY, 0.75);

  drawSingleMariposita();

  previousX = currentX;
  previousY = currentY;

  if (!hasFace) {
    fill(255);
    noStroke();
    textSize(20);
    textAlign(CENTER, CENTER);
    text('Coloca tu rostro frente a la camara para activar el movimiento', width / 2, height / 2);
  }

  fill(255);
  noStroke();
  textSize(12);
  textAlign(LEFT, BOTTOM);
  text(appStatus, 10, height - 10);
}

