// Settings object
let settings = {
    numParticles: 10,
    particleSize: 10,
    maxSpeed: 5,
    neighbourhoodRadius: 10,
    wSeparation: 20,
    wAlignment: 0.4,
    wCohesion: 0.4,
    obstacleRadius: 40,
    trailLength: 15
};

let swarm;
let environment;

// Toggle settings panel
function toggleSettings() {
    const content = document.getElementById('settingsContent');
    const icon = document.getElementById('toggleIcon');
    
    content.classList.toggle('collapsed');
    icon.classList.toggle('collapsed');
}

// Update setting and refresh simulation
function updateSetting(settingName, value) {
    settings[settingName] = parseFloat(value);
    document.getElementById(settingName + '-value').textContent = value;
    
    // Refresh the simulation with new settings
    refreshSimulation();
}

function refreshSimulation() {
    // Calculate derived values
    const actualNeighbourhoodRadius = settings.neighbourhoodRadius * settings.particleSize;
    const actualWSeparation = settings.wSeparation * settings.particleSize + 0.1 * settings.numParticles;
    
    // Create new environment with updated settings
    environment = new Environment(
        width, height, 
        settings.numParticles, 
        settings.particleSize, 
        settings.maxSpeed, 
        actualNeighbourhoodRadius, 
        actualWSeparation, 
        settings.wAlignment, 
        settings.wCohesion,
        settings.trailLength
    );
    
    Particle.setEnvironment(environment);
    Swarm.setEnvironment(environment);
    
    // Create new swarm
    swarm = new Swarm();
}

// p5.js setup and draw functions
function setup() {
    createCanvas(windowWidth, windowHeight);
    refreshSimulation();
}

function draw() {
    // Set the black background
    background(0);
    
    // Draw a white border around the canvas
    stroke(255);
    strokeWeight(20);
    noFill();
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
    // Don't add obstacles if clicking on the settings panel
    if (mouseX > width - 350 && mouseY < 40) return;
    
    // Add new obstacle at click position
    environment.obstacles.push({
        position: createVector(mouseX, mouseY),
        radius: settings.obstacleRadius
    });
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    refreshSimulation();
}