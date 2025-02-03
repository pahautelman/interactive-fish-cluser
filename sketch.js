function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);

  fill(0)
  text(`${mouseX}, ${mouseY}`, 20, 20);
}