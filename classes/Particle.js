class Particle {

    static environment;

    static setEnvironment(environment) {
        Particle.environment = environment;
    }

    constructor() {
        this.position = createVector(
            random(Particle.environment.screenWidth), 
            random(Particle.environment.screenHeight));
        let maxSpeed = Particle.environment.maxSpeed;
        this.velocity = createVector(
            random(-maxSpeed, maxSpeed), 
            random(-maxSpeed, maxSpeed));
    }

    static fromPositionAndVelocity(position, velocity) {
        let particle = new Particle();
        particle.position = position.copy();
        particle.velocity = velocity.copy();
        return particle;
    }
    
    display() {
        noStroke();
        fill(255);
        ellipse(this.position.x, this.position.y, Particle.environment.particleSize);

        // draw velocity as arrow
        let arrowSize = 30;
        stroke(255, 0, 0);
        strokeWeight(5);
        line(
            this.position.x, this.position.y, 
            this.position.x + this.velocity.x * arrowSize, this.position.y + this.velocity.y * arrowSize
        );
    }
}
