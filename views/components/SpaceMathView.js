class SpaceMathView {
    constructor() {
        this.container = null;
        this.gameArea = null;
        this.rocket = null;
        this.answerCallbacks = new Map();
    }

    setupEventListeners() {
        // Remove mouse/touch movement handlers, keep other event listeners
        
        // Handle back button
        const backButton = document.getElementById('back-button');
        if (backButton) {
            backButton.addEventListener('click', () => {
                if (this.onBackClicked) {
                    this.onBackClicked();
                }
            });
        }

        // Handle pause button
        const pauseButton = document.getElementById('pause-button');
        if (pauseButton) {
            pauseButton.addEventListener('click', () => {
                if (this.onPauseClicked) {
                    this.onPauseClicked();
                }
            });
        }
    }

    create() {
        // Previous container and header creation code remains the same...
        this.container = document.createElement('div');
        this.container.className = 'space-math-container';

        // Create header with controls
        const header = this.createHeader();
        this.container.appendChild(header);

        // Create game stats display
        const statsBar = this.createStatsBar();
        this.container.appendChild(statsBar);

        // Create main game area
        this.gameArea = document.createElement('div');
        this.gameArea.className = 'game-area';
        
        // Add parallax star layers
        for (let i = 1; i <= 3; i++) {
            const starLayer = document.createElement('div');
            starLayer.className = `star-layer layer-${i}`;
            this.createStars(starLayer, 20);
            this.gameArea.appendChild(starLayer);
        }

        // Create static rocket
        this.rocket = document.createElement('div');
        this.rocket.className = 'rocket';
        this.rocket.innerHTML = `
            <div class="rocket-body">
                <div class="window"></div>
                <div class="fins"></div>
            </div>
            <div class="flame">
                <div class="flame-inner"></div>
            </div>
        `;
        // Position rocket statically at the bottom center
        this.rocket.style.left = '50%';
        this.rocket.style.transform = 'translateX(-50%)';
        this.gameArea.appendChild(this.rocket);

        // Add input panel for answers
        const inputPanel = this.createInputPanel();
        
        // Assemble the game container
        this.container.appendChild(this.gameArea);
        this.container.appendChild(inputPanel);

        return this.container;
    }

    createHeader() {
        const header = document.createElement('div');
        header.className = 'game-header';

        // Back button
        const backButton = document.createElement('button');
        backButton.className = 'back-button';
        backButton.innerHTML = '← Back';
        backButton.id = 'back-button';

        // Title
        const title = document.createElement('h1');
        title.className = 'game-title';
        title.textContent = 'Space Math';

        // Pause button
        const pauseButton = document.createElement('button');
        pauseButton.className = 'pause-button';
        pauseButton.innerHTML = '❚❚';
        pauseButton.id = 'pause-button';

        header.appendChild(backButton);
        header.appendChild(title);
        header.appendChild(pauseButton);

        return header;
    }

    createStatsBar() {
        const statsBar = document.createElement('div');
        statsBar.className = 'stats-bar';

        const stats = [
            { id: 'score', label: 'Score', value: '0' },
            { id: 'level', label: 'Level', value: '1' },
            { id: 'lives', label: 'Lives', value: '3' },
            { id: 'streak', label: 'Streak', value: '0' }
        ];

        stats.forEach(stat => {
            const statContainer = document.createElement('div');
            statContainer.className = 'stat-container';
            
            const label = document.createElement('span');
            label.className = 'stat-label';
            label.textContent = stat.label;

            const value = document.createElement('span');
            value.className = 'stat-value';
            value.id = stat.id;
            value.textContent = stat.value;

            statContainer.appendChild(label);
            statContainer.appendChild(value);
            statsBar.appendChild(statContainer);
        });

        return statsBar;
    }

    createInputPanel() {
        const panel = document.createElement('div');
        panel.className = 'input-panel';

        const input = document.createElement('input');
        input.type = 'number';
        input.className = 'answer-input';
        input.placeholder = 'Enter answer...';
        input.pattern = '[0-9]*';

        const submitBtn = document.createElement('button');
        submitBtn.className = 'submit-button';
        submitBtn.textContent = 'Fire!';

        panel.appendChild(input);
        panel.appendChild(submitBtn);

        // Handle answer submission
        let targetAsteroidId = null;

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && targetAsteroidId) {
                const callback = this.answerCallbacks.get(targetAsteroidId);
                if (callback) {
                    callback(input.value);
                    input.value = '';
                    targetAsteroidId = null;
                }
            }
        });

        submitBtn.addEventListener('click', () => {
            if (targetAsteroidId) {
                const callback = this.answerCallbacks.get(targetAsteroidId);
                if (callback) {
                    callback(input.value);
                    input.value = '';
                    targetAsteroidId = null;
                }
            }
        });

        // Method to set target asteroid
        this.setTargetAsteroid = (id) => {
            targetAsteroidId = id;
            input.focus();
        };

        return panel;
    }

    createStars(container, count) {
        for (let i = 0; i < count; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            star.style.animationDelay = `${Math.random() * 3}s`;
            container.appendChild(star);
        }
    }

    createAsteroid(asteroid) {
        console.log('Creating asteroid element:', asteroid);
        const asteroidElement = document.createElement('div');
        asteroidElement.className = 'asteroid';
        asteroidElement.id = `asteroid-${asteroid.id}`;
        asteroidElement.style.left = `${asteroid.x}%`;
        asteroidElement.style.top = `${asteroid.y}%`;

        const problem = document.createElement('div');
        problem.className = 'problem';
        problem.textContent = asteroid.problem.question;

        asteroidElement.appendChild(problem);
        
        if (!this.gameArea) {
            console.error('Game area not found!');
            return;
        }
        
        this.gameArea.appendChild(asteroidElement);
        console.log('Asteroid element created and appended:', asteroidElement);

        // Add click handler to select this asteroid
        asteroidElement.addEventListener('click', () => {
            this.setTargetAsteroid(asteroid.id);
            this.highlightAsteroid(asteroid.id);
        });

        // Store callback for answer submission
        this.answerCallbacks.set(asteroid.id, (answer) => {
            if (this.onAnswerSubmitted) {
                this.onAnswerSubmitted(asteroid.id, answer);
            }
        });
    }

    createPowerUp(powerUp) {
        const powerUpElement = document.createElement('div');
        powerUpElement.className = `power-up ${powerUp.type}`;
        powerUpElement.id = `power-up-${powerUp.id}`;
        powerUpElement.style.left = `${powerUp.x}%`;
        powerUpElement.style.top = `${powerUp.y}%`;

        // Add appropriate icon based on type
        const icon = document.createElement('div');
        icon.className = 'power-up-icon';
        switch (powerUp.type) {
            case 'shield':
                icon.textContent = '🛡️';
                break;
            case 'slowTime':
                icon.textContent = '⏰';
                break;
            case 'doublePoints':
                icon.textContent = '2️⃣';
                break;
        }

        powerUpElement.appendChild(icon);
        this.gameArea.appendChild(powerUpElement);
    }

    getRocketBounds() {
        return this.rocket ? this.rocket.getBoundingClientRect() : null;
    }

    destroyAsteroid(asteroidId) {
        const asteroid = document.getElementById(`asteroid-${asteroidId}`);
        if (asteroid) {
            // Create and show laser beam
            this.shootLaser(asteroid);
            
            // Add destroyed class after laser hits
            setTimeout(() => {
                asteroid.classList.add('destroyed');
                setTimeout(() => asteroid.remove(), 500);
                this.answerCallbacks.delete(asteroidId);
            }, 200); // Delay explosion until laser hits
        }
    }

    shootLaser(targetAsteroid) {
        // Create laser beam element
        const laser = document.createElement('div');
        const laserInner = document.createElement('div');
        laser.className = 'laser-beam';
        laserInner.className = 'laser-beam-inner';
        laser.appendChild(laserInner);
        
        // Get positions for laser start (rocket) and end (asteroid)
        const rocketRect = this.rocket.getBoundingClientRect();
        const asteroidRect = targetAsteroid.getBoundingClientRect();
        const gameAreaRect = this.gameArea.getBoundingClientRect();
        
        // Calculate start and end positions relative to game area
        const startX = rocketRect.left + rocketRect.width / 2 - gameAreaRect.left;
        const startY = rocketRect.top - gameAreaRect.top;
        const endX = asteroidRect.left + asteroidRect.width / 2 - gameAreaRect.left;
        const endY = asteroidRect.top + asteroidRect.height / 2 - gameAreaRect.top;
        
        // Calculate angle and length for the laser
        const angle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI); // Convert to degrees
        const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
        
        // Position the outer container
        laser.style.position = 'absolute';
        laser.style.left = `${startX}px`;
        laser.style.top = `${startY}px`;
        laser.style.width = `${length}px`;
        laser.style.transform = `rotate(${angle}deg)`;
        laser.style.transformOrigin = 'left center';
        
        // Add laser to game area
        this.gameArea.appendChild(laser);
        
        // Remove laser after animation
        setTimeout(() => {
            laser.remove();
        }, 200);
    }

    collectPowerUp(powerUpId) {
        const powerUp = document.getElementById(`power-up-${powerUpId}`);
        if (powerUp) {
            powerUp.classList.add('collected');
            setTimeout(() => powerUp.remove(), 500);
        }
    }

    showIncorrect(asteroidId) {
        const asteroid = document.getElementById(`asteroid-${asteroidId}`);
        if (asteroid) {
            asteroid.classList.add('incorrect');
            setTimeout(() => asteroid.classList.remove('incorrect'), 500);
        }
    }

    highlightAsteroid(asteroidId) {
        // Remove existing highlights
        document.querySelectorAll('.asteroid').forEach(a => {
            a.classList.remove('highlighted');
        });

        const asteroid = document.getElementById(`asteroid-${asteroidId}`);
        if (asteroid) {
            asteroid.classList.add('highlighted');
        }
    }

    updateGameState(state) {
        console.log('Updating game state:', state);
        
        // Update asteroid positions
        state.asteroids.forEach(asteroid => {
            const asteroidElement = document.getElementById(`asteroid-${asteroid.id}`);
            if (asteroidElement) {
                asteroidElement.style.left = `${asteroid.x}%`;
                asteroidElement.style.top = `${asteroid.y}%`;
                console.log(`Updated asteroid ${asteroid.id}:`, {
                    x: asteroid.x,
                    y: asteroid.y,
                    element: asteroidElement
                });
            } else {
                console.error(`Asteroid element ${asteroid.id} not found!`);
            }
        });

        // Update power-up positions
        state.powerUps.forEach(powerUp => {
            const powerUpElement = document.getElementById(`power-up-${powerUp.id}`);
            if (powerUpElement) {
                powerUpElement.style.left = `${powerUp.x}%`;
                powerUpElement.style.top = `${powerUp.y}%`;
            }
        });

        // Update stats
        if (state.score !== undefined) this.updateScore(state.score);
        if (state.lives !== undefined) this.updateLives(state.lives);
        if (state.level !== undefined) this.updateLevel(state.level);
    }

    updateScore(score) {
        const scoreElement = document.getElementById('score');
        if (scoreElement) scoreElement.textContent = score;
    }

    updateLives(lives) {
        const livesElement = document.getElementById('lives');
        if (livesElement) livesElement.textContent = lives;
    }

    updateLevel(level) {
        const levelElement = document.getElementById('level');
        if (levelElement) levelElement.textContent = level;
    }

    updateStreak(streak) {
        const streakElement = document.getElementById('streak');
        if (streakElement) streakElement.textContent = streak;
    }

    showGameOver(stats) {
        const overlay = document.createElement('div');
        overlay.className = 'game-over-overlay';
        
        const content = document.createElement('div');
        content.className = 'game-over-content';
        content.innerHTML = `
            <h2>Game Over!</h2>
            <div class="final-stats">
                <p>Final Score: ${stats.score}</p>
                <p>Level Reached: ${stats.level}</p>
            </div>
            <div class="game-over-buttons">
                <button class="play-again-btn">Play Again</button>
                <button class="home-btn">Home</button>
            </div>
        `;

        overlay.appendChild(content);
        this.container.appendChild(overlay);

        // Add button handlers
        content.querySelector('.play-again-btn').addEventListener('click', () => {
            window.location.reload();
        });

        content.querySelector('.home-btn').addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }

    showLevelUp(level) {
        const announcement = document.createElement('div');
        announcement.className = 'level-up-announcement';
        announcement.textContent = `Level ${level}!`;
        
        this.gameArea.appendChild(announcement);
        
        setTimeout(() => {
            announcement.remove();
        }, 2000);
    }

    showPauseMenu() {
        const overlay = document.createElement('div');
        overlay.className = 'pause-overlay';
        overlay.innerHTML = `
            <div class="pause-menu">
                <h2>Game Paused</h2>
                <button class="resume-btn">Resume</button>
                <button class="restart-btn">Restart</button>
                <button class="quit-btn">Quit</button>
            </div>
        `;
        this.container.appendChild(overlay);
    }

    hidePauseMenu() {
        const overlay = document.querySelector('.pause-overlay');
        if (overlay) {
            overlay.remove();
        }
    }

    activatePowerUp(type) {
        // Add visual effect for active power-up
        const powerUpIndicator = document.createElement('div');
        powerUpIndicator.className = `power-up-indicator ${type}`;
        powerUpIndicator.id = `power-up-indicator-${type}`;
        this.container.appendChild(powerUpIndicator);
    }

    deactivatePowerUp(type) {
        // Remove visual effect
        const indicator = document.getElementById(`power-up-indicator-${type}`);
        if (indicator) {
            indicator.remove();
        }
    }

    checkCollision(bounds1, bounds2) {
        if (!bounds1 || !bounds2) return false;
        
        return !(bounds1.right < bounds2.left || 
                bounds1.left > bounds2.right || 
                bounds1.bottom < bounds2.top || 
                bounds1.top > bounds2.bottom);
    }

    // Event handler setters
    onAnswerSubmit(callback) {
        this.onAnswerSubmitted = callback;
    }

    onBackClick(callback) {
        const backButton = document.getElementById('back-button');
        if (backButton) {
            backButton.addEventListener('click', callback);
        }
    }

    onPauseClick(callback) {
        const pauseButton = document.getElementById('pause-button');
        if (pauseButton) {
            pauseButton.addEventListener('click', callback);
        }
    }
}

export default SpaceMathView;