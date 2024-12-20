class SpaceMathController {
    constructor(operation = 'all') {
        this.operation = operation;
        this.lastFrameTime = 0;
        this.asteroidTimer = 0;
        this.powerUpTimer = 0;
        this.activeAnimationFrame = null;
        this.activePowerUps = new Map();
        // Bind the game loop to preserve context
        this.gameLoop = this.gameLoop.bind(this);
        this.restartGame = this.restartGame.bind(this);
    }

    async initialize() {
        try {
            // Import dependencies
            const { default: SpaceMathModel } = await import('../models/SpaceMathModel.js');
            const { default: SpaceMathView } = await import('../views/components/SpaceMathView.js');

            // Initialize model and view
            this.model = new SpaceMathModel(this.operation);
            this.view = new SpaceMathView();

            // Create and append game container
            document.body.innerHTML = '';
            const gameContainer = this.view.create();
            document.body.appendChild(gameContainer);

            // Set up event listeners
            this.setupEventListeners();

            // Create initial asteroid
            const initialAsteroid = this.model.createAsteroid();
            this.model.asteroids.push(initialAsteroid);
            this.view.createAsteroid(initialAsteroid);

            // Start game loop
            this.startGameLoop();

        } catch (error) {
            console.error('Error initializing Space Math:', error);
            console.error('Stack:', error.stack);
        }
    }

    setupEventListeners() {
        // Handle answer submissions
        this.view.onAnswerSubmit((asteroidId, answer) => {
            const correct = this.model.checkAnswer(asteroidId, answer);
            if (correct) {
                this.view.destroyAsteroid(asteroidId);
                this.view.updateScore(this.model.score);
                this.view.updateStreak(this.model.streak);
                
                // Check for level up
                if (this.model.level > this.currentLevel) {
                    this.currentLevel = this.model.level;
                    this.view.showLevelUp(this.model.level);
                }
            } else {
                this.view.showIncorrect(asteroidId);
            }
        });

        // Handle back button
        this.view.onBackClick(() => {
            this.cleanup();
            window.location.href = 'index.html';
        });

        // Handle pause button - Updated implementation
        this.view.onPauseClick(() => {
            console.log('Pause button clicked, current state:', this.isPaused); // Debug log
            if (this.isPaused) {
                this.resume();
            } else {
                this.pause();
            }
        });

        // Handle resume from pause menu
        this.view.onResumeClick(() => {
            this.resume();
        });

        // Add restart handler
        this.view.onRestart(() => {
            this.restartGame();
        });

        // Add resume handler
        this.view.onResume(() => {
            this.resume();
        });
    }

    pause() {
        console.log('Pausing game'); // Debug log
        this.isPaused = true;
        this.view.showPauseMenu();
        if (this.activeAnimationFrame) {
            cancelAnimationFrame(this.activeAnimationFrame);
            this.activeAnimationFrame = null;
        }
    }

    resume() {
        const overlay = document.querySelector('.pause-overlay');
        if (overlay) {
            overlay.remove();
        }
        this.isPaused = false;
        this.lastFrameTime = performance.now();
        this.gameLoop();
    }

    restartGame() {
        // Clean up current game state
        if (this.activeAnimationFrame) {
            cancelAnimationFrame(this.activeAnimationFrame);
        }

        // Remove all existing asteroids and power-ups from the view
        const asteroidElements = document.querySelectorAll('.asteroid');
        const powerUpElements = document.querySelectorAll('.power-up');
        
        asteroidElements.forEach(element => element.remove());
        powerUpElements.forEach(element => element.remove());

        // Reset model using its reset method
        this.model.resetGame();

        // Clear timers and state
        this.lastFrameTime = 0;
        this.asteroidTimer = 0;
        this.powerUpTimer = 0;
        this.activePowerUps.clear();
        this.isPaused = false;

        // Remove any overlays (pause menu or game over screen)
        const overlays = document.querySelectorAll('.game-over-overlay, .pause-overlay');
        overlays.forEach(overlay => overlay.remove());

        // Update view with reset state
        this.view.updateGameState({
            asteroids: [],
            powerUps: [],
            lives: this.model.lives,
            level: this.model.level,
            score: this.model.score
        });
        this.view.updateStreak(this.model.streak);

        // Create initial asteroid
        const initialAsteroid = this.model.createAsteroid();
        this.model.asteroids.push(initialAsteroid);
        this.view.createAsteroid(initialAsteroid);

        // Restart game loop
        this.startGameLoop();
    }

    startGameLoop() {
        this.isPaused = false;
        this.lastFrameTime = performance.now();
        this.asteroidTimer = 0;
        this.powerUpTimer = 0;
        this.currentLevel = this.model.level;
        this.gameLoop();
    }

    gameLoop(currentTime = performance.now()) {
        if (this.isPaused) return;

        // Calculate delta time
        const deltaTime = currentTime - this.lastFrameTime;
        this.lastFrameTime = currentTime;

        console.log('Game loop - Current asteroids:', this.model.asteroids);

        // Update asteroid timer
        this.asteroidTimer += deltaTime;
        if (this.asteroidTimer >= this.model.levelSettings[this.model.level].asteroidInterval) {
            console.log('Creating new asteroid in game loop');
            const newAsteroid = this.model.createAsteroid();
            this.model.asteroids.push(newAsteroid);
            this.view.createAsteroid(newAsteroid);
            this.asteroidTimer = 0;
        }

        // Update power-up timer
        this.powerUpTimer += deltaTime;
        if (this.powerUpTimer >= 10000) { // Power-up every 10 seconds
            const shouldSpawn = Math.random() < 0.3; // 30% chance
            if (shouldSpawn) {
                const newPowerUp = this.model.createPowerUp();
                this.model.powerUps.push(newPowerUp);
                this.view.createPowerUp(newPowerUp);
            }
            this.powerUpTimer = 0;
        }

        // Update game objects
        this.model.updateAsteroids(deltaTime);
        this.model.updatePowerUps(deltaTime);

        // Update power-up durations
        for (const [type, endTime] of this.activePowerUps.entries()) {
            if (currentTime >= endTime) {
                this.activePowerUps.delete(type);
                this.view.deactivatePowerUp(type);
            }
        }

        // Check for collisions
        this.checkCollisions();

        // Update view
        this.view.updateGameState({
            asteroids: this.model.asteroids,
            powerUps: this.model.powerUps,
            lives: this.model.lives,
            level: this.model.level,
            score: this.model.score
        });

        // Check game over
        if (this.model.isGameOver) {
            this.gameOver();
            return;
        }

        // Continue game loop
        this.activeAnimationFrame = requestAnimationFrame(this.gameLoop);
    }

    checkCollisions() {
        const rocketBounds = this.view.getRocketBounds();

        // Check power-up collisions
        this.model.powerUps.forEach(powerUp => {
            if (!powerUp.isCollected && this.view.checkCollision(rocketBounds, powerUp)) {
                const powerUpEffect = this.model.collectPowerUp(powerUp.id);
                if (powerUpEffect) {
                    this.activatePowerUp(powerUpEffect);
                    this.view.collectPowerUp(powerUp.id);
                }
            }
        });
    }

    activatePowerUp(powerUpEffect) {
        const endTime = performance.now() + powerUpEffect.duration;
        this.activePowerUps.set(powerUpEffect.type, endTime);
        this.view.activatePowerUp(powerUpEffect.type);

        switch (powerUpEffect.type) {
            case 'shield':
                // Logic for shield power-up
                break;
            case 'slowTime':
                // Slow down asteroids temporarily
                this.model.asteroids.forEach(asteroid => {
                    asteroid.speed *= 0.5;
                });
                break;
            case 'doublePoints':
                // Double points logic handled in model
                break;
        }
    }

    gameOver() {
        if (this.activeAnimationFrame) {
            cancelAnimationFrame(this.activeAnimationFrame);
        }
        // Ensure any pause menu is removed when showing game over screen
        const pauseOverlay = document.querySelector('.pause-overlay');
        if (pauseOverlay) {
            pauseOverlay.remove();
        }
        this.view.showGameOver({
            score: this.model.score,
            level: this.model.level,
            operation: this.operation
        });
    }

    cleanup() {
        if (this.activeAnimationFrame) {
            cancelAnimationFrame(this.activeAnimationFrame);
        }
        // Remove event listeners if needed
        // Reset any global state if needed
    }
}

export default SpaceMathController;