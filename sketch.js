let numParticles = 40;
let particleSize = 20;
let maxSpeed = 5;
let neighbourhoodRadius = 100;
let wSeparation = 10 * particleSize;
let wAlignment = 0.4;
let wCohesion = 0.4;

let obstacleRadius = 40;

let swarm;
let environment;

function setup() {
  createCanvas(windowWidth, windowHeight);

  environment = new Environment(width, height, numParticles, particleSize, maxSpeed, neighbourhoodRadius, wSeparation, wAlignment, wCohesion); 
  Particle.setEnvironment(environment);
  Swarm.setEnvironment(environment);

  swarm = new Swarm();
}

function draw() {
  // Set the black background
  background(0);
  
  // Draw a white border around the canvas
  stroke(255);        // White color for the border
  strokeWeight(20);    // Thickness of the border (adjust as needed)
  noFill();           // No fill inside the rectangle
  rect(0, 0, width, height);

  // Draw obstacles
  for (const obstacle of environment.obstacles) {
    fill(255);
    noStroke();
    ellipse(obstacle.position.x, obstacle.position.y, obstacle.radius * 2);
  }
  
  swarm.run();
}

function mousePressed() {
  // Add new obstacle at click position
  environment.obstacles.push({
    position: createVector(mouseX, mouseY),
    radius: obstacleRadius
  });
}
