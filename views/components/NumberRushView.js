class NumberRushView {
    constructor() {
        this.container = null;
        this.lastMilestone = 0;
        this.lastComboThreshold = 0;
    }

    create() {
        this.container = document.createElement('div');
        this.container.className = 'number-rush-container';

        this.container.innerHTML = `
            <div class="game-header">
                <button class="back-button">← Back to Menu</button>
                <div class="game-stats">
                    <div class="stat-item">
                        <div class="stat-label">Score</div>
                        <div class="stat-value" id="score">0</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">Time</div>
                        <div class="stat-value" id="time">60</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">Streak</div>
                        <div class="stat-value" id="streak">0</div>
                    </div>
                </div>
            </div>
            <div class="game-content">
                <div id="start-screen" class="screen active">
                    <h2>Number Rush!</h2>
                    <p>How high can you score in 60 seconds?</p>
                    <button id="start-button" class="action-button">Start Game</button>
                </div>
                <div id="game-screen" class="screen">
                    <div class="problem-display"></div>
                    <input type="number" id="answer-input" class="answer-input" autocomplete="off">
                    <div class="feedback-message"></div>
                </div>
                <div id="end-screen" class="screen">
                    <h2>Game Over!</h2>
                    <div class="final-stats">
                        <p class="final-score">Final Score: <span>0</span></p>
                        <p class="high-score">High Score: <span>0</span></p>
                    </div>
                    <button id="play-again-button" class="action-button">Play Again</button>
                </div>
            </div>
        `;

        return this.container;
    }

    showScreen(screenId) {
        const screens = this.container.querySelectorAll('.screen');
        screens.forEach(screen => screen.classList.remove('active'));
        this.container.querySelector(`#${screenId}`).classList.add('active');
    }

    updateProblem(problem) {
        const display = this.container.querySelector('.problem-display');
        display.textContent = `${problem.num1} ${problem.operator} ${problem.num2} = `;
        
        const input = this.container.querySelector('#answer-input');
        input.value = '';
        input.focus();
    }

    showFeedback(isCorrect) {
        const feedback = this.container.querySelector('.feedback-message');
        feedback.textContent = isCorrect ? '✓' : '✗';
        feedback.className = `feedback-message ${isCorrect ? 'correct' : 'incorrect'}`;
        
        // Clear feedback after brief delay
        setTimeout(() => {
            feedback.textContent = '';
            feedback.className = 'feedback-message';
        }, 500);
    }

    updateStats(score, timeLeft, streak) {
        // Update score with milestone check
        const scoreElement = this.container.querySelector('#score');
        const oldScore = parseInt(scoreElement.textContent);
        scoreElement.textContent = score;
        
        // Check for score milestones (every 100 points)
        if (Math.floor(score/100) > Math.floor(oldScore/100)) {
            this.showMilestoneMessage(score);
        }

        // Update time with warning colors
        const timeElement = this.container.querySelector('#time');
        timeElement.textContent = timeLeft;
        if (timeLeft <= 5) {
            timeElement.style.color = '#ef4444'; // Red
        } else if (timeLeft <= 10) {
            timeElement.style.color = '#f59e0b'; // Amber
        } else {
            timeElement.style.color = '#f59e0b'; // Default amber
        }

        // Update streak with combo message only when crossing thresholds
        const streakElement = this.container.querySelector('#streak');
        const oldStreak = parseInt(streakElement.textContent);
        streakElement.textContent = streak;
        
        // Check if we've crossed a new threshold
        if (streak >= 5) {
            let newThreshold;
            if (streak >= 10) newThreshold = 10;
            else if (streak >= 8) newThreshold = 8;
            else newThreshold = 5;

            // Only show message if we've crossed a new threshold
            if (newThreshold > this.lastComboThreshold) {
                this.showComboMessage(streak);
                this.lastComboThreshold = newThreshold;
            }
        } else {
            // Reset threshold tracking when streak breaks
            this.lastComboThreshold = 0;
        }
    }

    showComboMessage(streak) {
        const gameContent = this.container.querySelector('.game-content');
        const comboMsg = document.createElement('div');
        comboMsg.className = 'combo-message';
        
        let message = '';
        if (streak >= 10) message = 'UNSTOPPABLE!';
        else if (streak >= 8) message = 'AMAZING!';
        else if (streak >= 5) message = 'COMBO!';
        
        comboMsg.textContent = message;
        gameContent.appendChild(comboMsg);
        
        // Remove after animation
        setTimeout(() => comboMsg.remove(), 1000);
    }

    showMilestoneMessage(score) {
        const milestone = Math.floor(score/100) * 100;
        const gameContent = this.container.querySelector('.game-content');
        const milestoneMsg = document.createElement('div');
        milestoneMsg.className = 'milestone-message';
        milestoneMsg.textContent = milestone + ' POINTS!';
        gameContent.appendChild(milestoneMsg);
        
        // Remove after animation
        setTimeout(() => milestoneMsg.remove(), 1000);
    }

    showGameOver(score, highScore) {
        const finalStats = this.container.querySelector('.final-stats');
        finalStats.querySelector('.final-score span').textContent = score;
        finalStats.querySelector('.high-score span').textContent = highScore;
        this.showScreen('end-screen');
    }

    addStartHandler(handler) {
        this.container.querySelector('#start-button').addEventListener('click', handler);
        this.container.querySelector('#play-again-button').addEventListener('click', handler);
    }

    addAnswerHandler(handler) {
        const input = this.container.querySelector('#answer-input');
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && input.value !== '') {
                handler(input.value);
            }
        });
    }

    addBackHandler(handler) {
        this.container.querySelector('.back-button').addEventListener('click', handler);
    }
}

export default NumberRushView;