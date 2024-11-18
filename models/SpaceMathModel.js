class SpaceMathModel {
    constructor(operation = 'all') {
        console.log('Initializing SpaceMathModel with operation:', operation);
        this.operation = operation;
        this.score = 0;
        this.level = 1;
        this.lives = 3;
        this.asteroids = [];
        this.powerUps = [];
        this.streak = 0;
        this.isGameOver = false;
        
        // Level settings - Reduced speeds across all levels
        this.levelSettings = {
            1: { speed: 0.2, maxNum: 10, asteroidInterval: 4000 },  // Reduced from 0.5 to 0.2
            2: { speed: 0.35, maxNum: 12, asteroidInterval: 3500 }, // Reduced from 0.7 to 0.35
            3: { speed: 0.5, maxNum: 15, asteroidInterval: 3000 },  // Reduced from 0.9 to 0.5
            4: { speed: 0.7, maxNum: 20, asteroidInterval: 2500 },  // Reduced from 1.1 to 0.7
            5: { speed: 0.9, maxNum: 25, asteroidInterval: 2000 }   // Reduced from 1.3 to 0.9
        };

        // Power-up types
        this.powerUpTypes = {
            shield: { duration: 10000, probability: 0.2 },
            slowTime: { duration: 8000, probability: 0.2 },
            doublePoints: { duration: 15000, probability: 0.1 }
        };
    }

    generateProblem() {
        const settings = this.levelSettings[this.level];
        const operations = this.operation === 'all' ? 
            ['addition', 'multiplication', 'division'] : [this.operation];
        
        const operation = operations[Math.floor(Math.random() * operations.length)];
        let problem = { question: '', answer: 0, points: 10 };

        switch(operation) {
            case 'addition':
                const num1 = Math.ceil(Math.random() * settings.maxNum);
                const num2 = Math.ceil(Math.random() * settings.maxNum);
                problem.question = `${num1} + ${num2}`;
                problem.answer = num1 + num2;
                break;

            case 'multiplication':
                const factor1 = Math.ceil(Math.random() * Math.sqrt(settings.maxNum));
                const factor2 = Math.ceil(Math.random() * Math.sqrt(settings.maxNum));
                problem.question = `${factor1} × ${factor2}`;
                problem.answer = factor1 * factor2;
                problem.points = 20;
                break;

            case 'division':
                // Generate division problems that result in whole numbers
                const divisor = Math.ceil(Math.random() * Math.sqrt(settings.maxNum));
                const quotient = Math.ceil(Math.random() * Math.sqrt(settings.maxNum));
                const dividend = divisor * quotient;
                problem.question = `${dividend} ÷ ${divisor}`;
                problem.answer = quotient;
                problem.points = 25;
                break;
        }

        return problem;
    }

    createAsteroid() {
        const problem = this.generateProblem();
        const settings = this.levelSettings[this.level];
        
        const asteroid = {
            id: Date.now(),
            problem: problem,
            x: Math.random() * 80 + 10,  // Random position 10%-90% of screen width
            y: -10,                      // Start above the screen
            speed: settings.speed,
            size: 60,
            isDestroyed: false
        };
        
        console.log('Created asteroid:', asteroid);
        return asteroid;
    }

    // Rest of the class methods remain unchanged...
    createPowerUp() {
        const types = Object.keys(this.powerUpTypes);
        const type = types[Math.floor(Math.random() * types.length)];
        
        return {
            id: Date.now(),
            type: type,
            x: Math.random() * 80 + 10,
            y: -10,
            speed: this.levelSettings[this.level].speed * 0.8,
            size: 40,
            duration: this.powerUpTypes[type].duration,
            isCollected: false
        };
    }

    updateAsteroids(deltaTime) {
        this.asteroids.forEach(asteroid => {
            // Move asteroid down by speed amount
            asteroid.y += asteroid.speed;
            console.log(`Asteroid ${asteroid.id} new position:`, asteroid.y);
        });

        // Filter out asteroids that are off screen
        this.asteroids = this.asteroids.filter(asteroid => {
            if (asteroid.y > 110) {  // Off screen
                if (!asteroid.isDestroyed) {
                    this.lives--;
                    if (this.lives <= 0) {
                        this.isGameOver = true;
                    }
                }
                return false;
            }
            return true;
        });
    }

    updatePowerUps(deltaTime) {
        this.powerUps = this.powerUps.filter(powerUp => {
            // Move power-up down
            powerUp.y += powerUp.speed;
            
            // Remove if it's collected or off screen
            return !powerUp.isCollected && powerUp.y <= 110;
        });
    }

    checkAnswer(asteroidId, answer) {
        const asteroid = this.asteroids.find(a => a.id === asteroidId);
        if (!asteroid) return false;

        const correct = Number(answer) === asteroid.problem.answer;
        
        if (correct) {
            asteroid.isDestroyed = true;
            this.streak++;
            
            // Calculate points with streak bonus
            let points = asteroid.problem.points;
            if (this.streak >= 5) points *= 2;
            if (this.streak >= 10) points *= 3;
            
            this.score += points;

            // Level up check
            if (this.score >= this.level * 100 && this.level < 5) {
                this.level++;
            }
        } else {
            this.streak = 0;
        }

        return correct;
    }

    collectPowerUp(powerUpId) {
        const powerUp = this.powerUps.find(p => p.id === powerUpId);
        if (powerUp) {
            powerUp.isCollected = true;
            return {
                type: powerUp.type,
                duration: powerUp.duration
            };
        }
        return null;
    }
}

export default SpaceMathModel;