const canvas = document.getElementById("bouncingCanvas");
const ctx = canvas.getContext("2d");
let shapes = [];

canvas.width = window.innerWidth;
canvas.height = 1024; // match the CSS height

const flameImages = [
  "assets/branding-images/Flame_green.svg",
  "assets/branding-images/Flame_green.svg",
  "assets/branding-images/Flame_green.svg",
  "assets/branding-images/Flame_purple.svg",
  "assets/branding-images/Flame_green.svg",
  "assets/branding-images/Flame-blue.svg",
  "assets/branding-images/Flame_green.svg",
];

class Shape {
  constructor(x, y, radius, imageSrc) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.image = new Image();
    this.image.src = imageSrc;
    this.vx = (Math.random() - 0.5) * 5;
    this.vy = (Math.random() - 0.5) * 5;
    this.birthTime = Date.now();
    this.lifespan = 15000;
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

  update() {
    if (this.x + this.radius > canvas.width || this.x - this.radius < 0)
      this.vx = -this.vx;
    if (this.y + this.radius > canvas.height || this.y - this.radius < 0)
      this.vy = -this.vy;
    this.x += this.vx;
    this.y += this.vy;
  }
}

// 🎯 Only trigger when clicking over the wordmark area
const wordmark = document.getElementById("wordmarkArea");

wordmark.addEventListener("click", (event) => {
  // Get the position of the wordmark relative to the viewport
  const rect = wordmark.getBoundingClientRect();

  // Get the click position in global (page) coordinates
  const x = event.clientX;
  const y = event.clientY;

  // Check if the click is actually inside the visible wordmark area
  if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
    const radius = 25;
    const randomImage =
      flameImages[Math.floor(Math.random() * flameImages.length)];

    // Spawn the flame at the click’s global position (on the canvas)
    const newShape = new Shape(x, y, radius, randomImage);
    shapes.push(newShape);
  }
});

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const now = Date.now();
  for (let i = shapes.length - 1; i >= 0; i--) {
    if (now - shapes[i].birthTime > shapes[i].lifespan) {
      shapes.splice(i, 1);
      continue;
    }
    shapes[i].update();
    shapes[i].draw();
  }
}

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = 1024; // keep it the same
});

animate();
