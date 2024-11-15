// views/components/PirateMathView.js

class PirateMathView {
    constructor() {
        this.container = null;
    }

    create() {
        this.container = document.createElement('div');
        this.container.className = 'pirate-math-container';

        this.container.innerHTML = `
            <div class="game-header">
                <button class="back-button">← Back to Port</button>
                <div class="player-stats">
                    <div class="coins">
                        <span class="coin-icon">🪙</span>
                        <span class="coin-count">0</span>
                    </div>
                </div>
            </div>

            <div class="game-content">
                <div id="intro-screen" class="screen active">
                    <h2>Pirate Math Adventure</h2>
                    <div class="intro-content">
                        <p>Ahoy, matey! Ready to solve math riddles and find treasure with Captain Calculator? 🏴‍☠️</p>
                        <ul class="game-rules">
                            <li>⭐ Solve riddles to unlock new islands</li>
                            <li>💰 Earn 10 coins for each correct answer</li>
                            <li>💡 Use 5 coins to get a helpful hint</li>
                            <li>🗺️ Reach the final island to find the ultimate treasure!</li>
                        </ul>
                    </div>
                    <button id="start-button" class="action-button">Set Sail!</button>
                </div>

                <div id="map-screen" class="screen">
                    <div class="island-area">
                        <div class="progress-map">
                            <div class="map-path"></div>
                            <div class="current-location"></div>
                        </div>
                        <div class="island-name"></div>
                        <div class="island-background"></div>
                        <div class="riddle-box"></div>
                        <div class="answer-area">
                            <input type="number" id="answer-input" class="answer-input" placeholder="Your answer...">
                            <button class="hint-button">Use Hint (5 coins)</button>
                        </div>
                        <div class="hint-display"></div>
                        <div class="feedback-message"></div>
                    </div>
                </div>

                <div id="victory-screen" class="screen">
                    <h2>Treasure Found!</h2>
                    <div class="victory-content">
                        <div class="treasure-chest">🎁</div>
                        <div class="victory-message"></div>
                        <div class="final-score"></div>
                    </div>
                    <button id="play-again-button" class="action-button">New Adventure</button>
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

    showIsland(island) {
        const islandName = this.container.querySelector('.island-name');
        const islandBackground = this.container.querySelector('.island-background');
        const riddleBox = this.container.querySelector('.riddle-box');
        const answerInput = this.container.querySelector('#answer-input');
        const hintDisplay = this.container.querySelector('.hint-display');
        const feedbackMessage = this.container.querySelector('.feedback-message');

        islandName.textContent = island.name;
        islandBackground.textContent = island.background;
        riddleBox.innerHTML = `<p class="riddle-text">${island.riddle}</p>`;
        answerInput.value = '';
        hintDisplay.textContent = '';
        feedbackMessage.textContent = '';

        // Focus the answer input
        setTimeout(() => answerInput.focus(), 100);

        // Update progress map
        this.updateProgressMap(island);
    }

    updateProgressMap(island) {
        const mapPath = this.container.querySelector('.map-path');
        const currentLocation = this.container.querySelector('.current-location');
        
        // Update the path visualization based on current progress
        // (You can enhance this with more sophisticated map graphics)
    }

    showSuccess(coins) {
        const feedbackMessage = this.container.querySelector('.feedback-message');
        feedbackMessage.textContent = '✨ Correct! Well done, matey! ✨';
        feedbackMessage.className = 'feedback-message success';
        
        // Update coins with animation
        this.updateCoins(coins);

        // Clear input
        const answerInput = this.container.querySelector('#answer-input');
        answerInput.value = '';
    }

    showIncorrectFeedback() {
        const feedbackMessage = this.container.querySelector('.feedback-message');
        feedbackMessage.textContent = '❌ Not quite right, try again!';
        feedbackMessage.className = 'feedback-message error';
    }

    showInsufficientCoins() {
        const feedbackMessage = this.container.querySelector('.feedback-message');
        feedbackMessage.textContent = '💰 Not enough coins for a hint!';
        feedbackMessage.className = 'feedback-message warning';
    }

    showHint(hint, coins) {
        const hintDisplay = this.container.querySelector('.hint-display');
        hintDisplay.textContent = `💡 ${hint}`;
        this.updateCoins(coins);
    }

    showVictory(coins) {
        this.showScreen('victory-screen');
        const victoryMessage = this.container.querySelector('.victory-message');
        const finalScore = this.container.querySelector('.final-score');
        
        victoryMessage.innerHTML = `
            <p>Congratulations, brave mathematician!</p>
            <p>You've conquered all islands and found the treasure!</p>
        `;
        finalScore.textContent = `Final Score: ${coins} coins`;
    }

    updateCoins(coins) {
        const coinCount = this.container.querySelector('.coin-count');
        coinCount.textContent = coins;
    }

    addStartHandler(handler) {
        const startButton = this.container.querySelector('#start-button');
        const playAgainButton = this.container.querySelector('#play-again-button');
        startButton.addEventListener('click', handler);
        playAgainButton.addEventListener('click', handler);
    }

    addAnswerHandler(handler) {
        const answerInput = this.container.querySelector('#answer-input');
        answerInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && answerInput.value !== '') {
                handler(answerInput.value);
            }
        });
    }

    addHintHandler(handler) {
        const hintButton = this.container.querySelector('.hint-button');
        hintButton.addEventListener('click', handler);
    }

    addBackHandler(handler) {
        const backButton = this.container.querySelector('.back-button');
        backButton.addEventListener('click', handler);
    }
}

export default PirateMathView;