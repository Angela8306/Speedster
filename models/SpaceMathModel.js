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
        
        // Level settings
        this.levelSettings = {
            1: { speed: 0.2, asteroidInterval: 4000 },
            2: { speed: 0.25, asteroidInterval: 3800 },
            3: { speed: 0.3, asteroidInterval: 3600 },
            4: { speed: 0.35, asteroidInterval: 3400 },
            5: { speed: 0.4, asteroidInterval: 3200 }
        };

        // Power-up types
        this.powerUpTypes = {
            shield: { duration: 10000, probability: 0.2 },
            slowTime: { duration: 8000, probability: 0.2 },
            doublePoints: { duration: 15000, probability: 0.1 }
        };
    }

    generateProblem() {
        const operations = this.operation === 'all' ? 
            ['addition', 'subtraction', 'multiplication', 'division'] : [this.operation];
        
        const operation = operations[Math.floor(Math.random() * operations.length)];
        let problem = { question: '', answer: 0, points: 10 };

        // Helper function to get random number between min and max (inclusive)
        const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

        switch(operation) {
            case 'addition': {
                // Generate numbers from 1 to 12
                const num1 = getRandomNumber(1, 12);
                const num2 = getRandomNumber(1, 12);
                problem.question = `${num1} + ${num2}`;
                problem.answer = num1 + num2;
                break;
            }

            case 'subtraction': {
                // Generate subtraction problems based on possible addition results (1+1 to 12+12)
                const minSum = 2;  // Result of 1+1
                const maxSum = 24; // Result of 12+12
                const result = getRandomNumber(minSum, maxSum);
                const subtractor = getRandomNumber(1, Math.min(12, result - 1));
                problem.question = `${result} - ${subtractor}`;
                problem.answer = result - subtractor;
                problem.points = 15;
                break;
            }

            case 'multiplication': {
                // Generate numbers from 1 to 12
                const factor1 = getRandomNumber(1, 12);
                const factor2 = getRandomNumber(1, 12);
                problem.question = `${factor1} × ${factor2}`;
                problem.answer = factor1 * factor2;
                problem.points = 20;
                break;
            }

            case 'division': {
                // Generate division problems from results of 1x1 to 12x12
                const divisor = getRandomNumber(1, 12);
                const quotient = getRandomNumber(1, 12);
                const dividend = divisor * quotient;
                problem.question = `${dividend} ÷ ${divisor}`;
                problem.answer = quotient;
                problem.points = 25;
                break;
            }
        }

        return problem;
    }

    // Rest of the class implementation remains the same...
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
            asteroid.y += asteroid.speed;
        });

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
            powerUp.y += powerUp.speed;
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
            
            let points = asteroid.problem.points;
            if (this.streak >= 5) points *= 2;
            if (this.streak >= 10) points *= 3;
            
            this.score += points;

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