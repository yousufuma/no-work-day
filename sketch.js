let pg;
let textTexture;
let boxSize = 260;
let t;
let hu = 0;

let indexWord = 0;
let words = ["NO WORK TODAY"];

function setup() {
  createCanvas(450, 800, WEBGL);
  colorMode(HSB, 255);
  pg = createGraphics(100, 100);
  // gl.clearColor(0, 0, 0, 0)
  strokeWeight(0);
  textTexture = createGraphics(boxSize, boxSize);
  textTexture.background(255);
  textTexture.textSize(30);
  textTexture.colorMode(HSB, 225);
}

function draw() {
  textTexture.fill(hu % 255, 255, 255);
  // background("purple");

  let wave = sin(frameCount * 0.05 + 350) * 3;
  textTexture.background(0, 20);
  textTexture.translate(0, wave);
  for (let i = 0; i <= 30; i++) {
    textTexture.fill(20, (i / 30) * 255, 255);
    textTexture.text(words[indexWord], 0, i * 50);
  }

  push();
  rotateX(radians(65));
  rotateZ(radians(45));
  push();
  rotateX(frameCount * 0.005);
  texture(textTexture);
  box(boxSize);
  pop();
  pop();

  t += 50;
  hu += 0.1;
}