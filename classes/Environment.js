class Environment {
    constructor(screenWidth, screenHeight, numParticles, particleSize, maxSpeed, neighbourhoodRadius, wSeparation, wAlignment, wCohesion) {
        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;
        this.numParticles = numParticles;
        this.particleSize = particleSize;
        this.maxSpeed = maxSpeed;
        this.neighbourhoodRadius = neighbourhoodRadius;
        this.wSeparation = wSeparation;
        this.wAlignment = wAlignment;
        this.wCohesion = wCohesion;
        this.obstacles = [];
    }

    addObstacle(obstacle) {
        this.obstacles.push(obstacle);
    }        
}