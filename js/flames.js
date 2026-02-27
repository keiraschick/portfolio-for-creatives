// ===== Setup =====
const canvas = document.getElementById("bouncingCanvas");
const ctx = canvas.getContext("2d");
let shapes = [];

canvas.width = window.innerWidth;
canvas.height = 860;

const wordmark = document.getElementById("wordmarkAnimation");
const wordmarkArea = document.getElementById("wordmarkArea");

wordmarkArea.addEventListener("click", () => {
  spawnFlame();
});

// where the mouth is inside the original SVG file
const MOUTH = { x: 420, y: 80 };
const SVG_W = 1022.25;
const SVG_H = 294.66;

const flameImages = [
  "assets/branding-images/Flame_green.svg",
  "assets/branding-images/Flame_green.svg",
  "assets/branding-images/Flame_blue.svg",
  "assets/branding-images/Flame_purple.svg",
  "assets/branding-images/Flame_green.svg",
];

// ===== Shape Class =====
class Shape {
  constructor(x, y, radius, imageSrc) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.image = new Image();
    this.image.src = imageSrc;
    this.vx = (Math.random() - 0.5) * 5;
    this.vy = (Math.random() - 0.5) * 5;
    this.birth = Date.now();
    this.life = 10000;
  }

  update() {
    if (this.x + this.radius > canvas.width || this.x - this.radius < 0)
      this.vx *= -1;
    if (this.y + this.radius > canvas.height || this.y - this.radius < 0)
      this.vy *= -1;

    this.x += this.vx;
    this.y += this.vy;
  }

  draw() {
    ctx.drawImage(
      this.image,
      this.x - this.radius,
      this.y - this.radius,
      this.radius * 2,
      this.radius * 2
    );
  }
}

// ===== Mouth Position in Screen Coordinates =====
function getMouthPosition() {
  const rect = wordmark.getBoundingClientRect();

  const scaleX = rect.width / SVG_W;
  const scaleY = rect.height / SVG_H;

  return {
    x: rect.left + MOUTH.x * scaleX,
    y: rect.top + MOUTH.y * scaleY,
  };
}

// ===== Spawn Flame =====
function spawnFlame() {
  const pos = getMouthPosition();
  const img = flameImages[Math.floor(Math.random() * flameImages.length)];

  shapes.push(new Shape(pos.x, pos.y, 40, img));
}

// ===== Click Event =====
wordmark.addEventListener("load", () => {
  const svgDoc = wordmark.contentDocument;
  if (!svgDoc) return;

  const svgRoot = svgDoc.documentElement;

  // when wrapper is clicked, trigger SVG click too
  document.getElementById("wordmarkArea").addEventListener("click", () => {
    svgRoot.dispatchEvent(new Event("click"));
  });
});

// ===== Animation Loop =====
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const now = Date.now();
  for (let i = shapes.length - 1; i >= 0; i--) {
    if (now - shapes[i].birth > shapes[i].life) {
      shapes.splice(i, 1);
      continue;
    }
    shapes[i].update();
    shapes[i].draw();
  }

  requestAnimationFrame(animate);
}

animate();

// ===== Resize Canvas =====
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = 860;
});
