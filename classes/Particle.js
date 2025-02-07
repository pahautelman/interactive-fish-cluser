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
        
        // store previous positions to create a trail effect.
        this.history = []; // For storing previous positions
        this.trailLength = 15; // Number of trail segments
    }

    static fromPositionAndVelocity(position, velocity) {
        let particle = new Particle();
        particle.position = position.copy();
        particle.velocity = velocity.copy();
        return particle;
    }
    
    display() {
        // Add current position to history
        this.history.push(this.position.copy());
        if (this.history.length > this.trailLength) {
            this.history.shift();
        }

        // Optionally, you can draw the trail by uncommenting the next line.
        this.drawTrail();

        // Draw fish with glow
        push();
        translate(this.position.x, this.position.y);
        rotate(this.velocity.heading());
        
        // Glowing effect
        blendMode(ADD);
        noStroke();
        for (let i = 0; i < 3; i++) {
            fill(255, 150 + i * 20, 150, 30 - i * 10);
            ellipse(
                0, 0, 
                (4 + i * 1) * Particle.environment.particleSize, 
                (3 + i * 1) * Particle.environment.particleSize
            );
        }
        blendMode(BLEND);

        // Fish body
        noStroke();
        fill(255, 150, 150);
        triangle(
            -2 * Particle.environment.particleSize, -1 * Particle.environment.particleSize, 
            -2 * Particle.environment.particleSize,  1 * Particle.environment.particleSize, 
             2 * Particle.environment.particleSize,  0
        );
        
        // Tail
        fill(200, 100, 100);
        triangle(
            -2 * Particle.environment.particleSize, -1 * Particle.environment.particleSize,
            -3 * Particle.environment.particleSize,  0,
            -2 * Particle.environment.particleSize,  1 * Particle.environment.particleSize
        );
        
        // Eye
        fill(255);
        circle(1.5 * Particle.environment.particleSize, 0, 0.5 * Particle.environment.particleSize);

        pop();
    }

    drawTrail() {
        for (let i = 0; i < this.history.length; i++) {
            const alpha = map(i, 0, this.history.length, 20, 100);
            const size = map(i, 0, this.history.length, 0.9, 2) * Particle.environment.particleSize;
            
            push();
            blendMode(ADD);
            noStroke();
            fill(255, 200, 200, alpha);
            const pos = this.history[i];
            ellipse(pos.x, pos.y, size);
            blendMode(BLEND);
            pop();
        }
    }      
}
