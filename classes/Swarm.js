class Swarm {
    static environment;

    static setEnvironment(environment) {
        Swarm.environment = environment;
    }

    constructor() {
        this.numParticles = Swarm.environment.numParticles;
        this.maxSpeed = Swarm.environment.maxSpeed;
        this.neighbourhoodRadius = Swarm.environment.neighbourhoodRadius;
        this.wSeparation = Swarm.environment.wSeparation;
        this.wAlignment = Swarm.environment.wAlignment;
        this.wCohesion = Swarm.environment.wCohesion;
        
        // initialize particles
        this.particles = [];
        for (let i = 0; i < this.numParticles; i++) {
            this.particles.push(new Particle(environment));
        }
    }

    run() {
        this.#drawParticles();
        this.#updateParticlesPosition();
    }

    #drawParticles() {
        for (let i = 0; i < this.numParticles; i++) {
            this.particles[i].display();
        }
    }

    #updateParticlesPosition() {
        // First calculate ALL new states without modifying originals
        const nextStates = this.particles.map(particle => {
            const neighbors = this.#findNeighbours(particle);
            
            // Calculate forces using CURRENT particle state
            const separation = this.#separation(particle, neighbors);
            const alignment = this.#alignment(particle, neighbors);
            const cohesion = this.#cohesion(particle, neighbors);

            // Calculate new velocity
            const collectiveVel = createVector(0, 0)
                .add(separation.mult(this.wSeparation))
                .add(alignment.mult(this.wAlignment))
                .add(cohesion.mult(this.wCohesion));
            const randomNoise = Swarm.environment.maxSpeed * 0.02;
            const newVel = particle.velocity.copy().mult(1.05)
                .add(collectiveVel.mult(0.3))
                .add(createVector(
                    random(-randomNoise, randomNoise), 
                    random(-randomNoise, randomNoise)));

            newVel.limit(this.maxSpeed);

            // Calculate new position
            const newPos = particle.position.copy().add(newVel);

            // Calculate boundary forces
            const boundaryForce = this.#calculateBoundaryForces(newPos);
            newVel.add(boundaryForce);

            return Particle.fromPositionAndVelocity(newPos, newVel);
        });

        // Now update ALL particles simultaneously
        this.particles.forEach((particle, i) => {
            particle.position = nextStates[i].position;
            particle.velocity = nextStates[i].velocity;
        });
    }
      
    #calculateBoundaryForces(position) {
        const detectionMargin = 100;
        const maxSteerForce = 1;
        let force = createVector(0, 0);
    
        // X-axis boundaries
        if (position.x < detectionMargin) {
            const intensity = (detectionMargin - position.x) / detectionMargin;
            force.add(intensity * maxSteerForce, 0);
        } else if (position.x > width - detectionMargin) {
            const intensity = (position.x - (width - detectionMargin)) / detectionMargin;
            force.add(-intensity * maxSteerForce, 0);
        }
    
        // Y-axis boundaries
        if (position.y < detectionMargin) {
            const intensity = (detectionMargin - position.y) / detectionMargin;
            force.add(0, intensity * maxSteerForce);
        } else if (position.y > height - detectionMargin) {
            const intensity = (position.y - (height - detectionMargin)) / detectionMargin;
            force.add(0, -intensity * maxSteerForce);
        }
    
        // Obstacle avoidance
        for (const obstacle of Swarm.environment.obstacles) {
            const obstaclePosition = obstacle.position;
            const obstacleRadius = obstacle.radius;
            
            // Vector from obstacle to particle
            const toParticle = p5.Vector.sub(position, obstaclePosition);
            const distanceToObstacle = toParticle.mag();
            const effectiveDistance = distanceToObstacle - obstacleRadius;
    
            if (effectiveDistance < detectionMargin) {
                let direction;
                if (distanceToObstacle === 0) {
                    // Random direction if particle is exactly at obstacle's position
                    direction = p5.Vector.random2D();
                } else {
                    direction = toParticle.copy().normalize();
                }
                const intensity = (detectionMargin - effectiveDistance) / detectionMargin;
                force.add(direction.mult(intensity * maxSteerForce));
            }
        }
    
        return force;
    }
    
    #findNeighbours(particle) {
        let neighbours = [];
        for (let i = 0; i < this.numParticles; i++) {
            if (particle == this.particles[i]) {
                continue;
            }

            let distance = particle.position.dist(this.particles[i].position);
            if (distance < this.neighbourhoodRadius) {
                neighbours.push(this.particles[i]);
            }
        }
        return neighbours;
    }

    #separation(particle, neighbors) {
        const steer = createVector(0, 0);
        for (const other of neighbors) {
            const diff = p5.Vector.sub(particle.position, other.position);
            const d = particle.position.dist(other.position);
            diff.div(d * d); // Weight by inverse square distance
            steer.add(diff);
        }
        if (neighbors.length > 0) {
            steer.div(neighbors.length) 
        } 
        return steer;
      }

    #alignment(particle, neighbors) {
        const avg = createVector(0, 0);
        for (const other of neighbors) {
            avg.add(other.velocity);
        }
        return neighbors.length > 0 
            ? avg.div(neighbors.length).sub(particle.velocity)
            : avg;
    }

    #cohesion(particle, neighbors) {
        const avgPos = createVector(0, 0);
        for (const other of neighbors) {
            const otherPos = other.position.copy();
            avgPos.add(otherPos);
        }
        neighbors.length > 0 
            ? avgPos.div(neighbors.length).sub(particle.position)
            : avgPos;
        return avgPos.limit(this.maxSpeed);
      }
}