// views/components/MathMatchView.js

class MathMatchView {
    constructor() {
        this.container = null;
        this.gameBoard = null;
        this.cards = [];
        this.cardClickHandler = null;
        this.currentDifficulty = 'easy'; // Add this line to track current difficulty
    }

    create() {
        this.container = document.createElement('div');
        this.container.className = 'math-match-container';

        // Create header
        const header = this.createHeader();
        this.container.appendChild(header);

        // Create game stats
        const statsBar = this.createStatsBar();
        this.container.appendChild(statsBar);

        // Create game board
        this.gameBoard = document.createElement('div');
        this.gameBoard.className = 'game-board';
        this.container.appendChild(this.gameBoard);

        return this.container;
    }

    createHeader() {
        const header = document.createElement('div');
        header.className = 'game-header';
    
        // Left side - Back button
        const leftSection = document.createElement('div');
        leftSection.className = 'header-left';
        
        const backButton = document.createElement('button');
        backButton.className = 'back-button';
        backButton.innerHTML = '← Back';
        backButton.id = 'back-button';
        
        leftSection.appendChild(backButton);
    
        // Right side - Controls
        const rightSection = document.createElement('div');
        rightSection.className = 'header-right';
    
        const difficultySelect = document.createElement('select');
        difficultySelect.className = 'difficulty-select';
        difficultySelect.id = 'difficulty-select';
        
        const difficulties = [
            { value: 'easy', label: 'Easy' },
            { value: 'medium', label: 'Medium' },
            { value: 'hard', label: 'Hard' }
        ];

        difficulties.forEach(diff => {
            const option = document.createElement('option');
            option.value = diff.value;
            option.textContent = diff.label;
            option.selected = diff.value === this.currentDifficulty;
            difficultySelect.appendChild(option);
        });
    
        const newGameButton = document.createElement('button');
        newGameButton.className = 'new-game-button';
        newGameButton.textContent = 'New Game';
        newGameButton.id = 'new-game-button';
    
        rightSection.appendChild(difficultySelect);
        rightSection.appendChild(newGameButton);
    
        header.appendChild(leftSection);
        header.appendChild(rightSection);
    
        return header;
    }

    setDifficulty(difficulty) {
        this.currentDifficulty = difficulty;
        const difficultySelect = document.getElementById('difficulty-select');
        if (difficultySelect) {
            difficultySelect.value = difficulty;
        }
    }

    addDifficultyHandler(handler) {
        const difficultySelect = document.getElementById('difficulty-select');
        difficultySelect.addEventListener('change', (e) => {
            const newDifficulty = e.target.value;
            this.setDifficulty(newDifficulty);
            handler(newDifficulty);
        });
    }

    createStatsBar() {
        const statsBar = document.createElement('div');
        statsBar.className = 'stats-bar';

        // Create timer display
        const timerDisplay = document.createElement('div');
        timerDisplay.className = 'stat-item';
        timerDisplay.innerHTML = `
            <span class="stat-label">Time</span>
            <span class="stat-value" id="timer">0:00</span>
        `;

        // Create moves counter
        const movesDisplay = document.createElement('div');
        movesDisplay.className = 'stat-item';
        movesDisplay.innerHTML = `
            <span class="stat-label">Moves</span>
            <span class="stat-value" id="moves">0</span>
        `;

        // Create score display
        const scoreDisplay = document.createElement('div');
        scoreDisplay.className = 'stat-item';
        scoreDisplay.innerHTML = `
            <span class="stat-label">Matches</span>
            <span class="stat-value" id="score">0</span>
        `;

        statsBar.appendChild(timerDisplay);
        statsBar.appendChild(movesDisplay);
        statsBar.appendChild(scoreDisplay);

        return statsBar;
    }

    setupBoard(cards) {
        this.gameBoard.innerHTML = '';
        this.cards = [];

        // Calculate columns based on difficulty
        let columns;
        const totalCards = cards.length;
        if (totalCards <= 12) {
            columns = 4; // Easy: 3x4 grid
        } else if (totalCards <= 20) {
            columns = 5; // Medium: 4x5 grid
        } else {
            columns = 6; // Hard: 4x6 grid
        }

        // Update grid layout
        this.gameBoard.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
        
        cards.forEach((cardData, index) => {
            const card = this.createCard(cardData, index);
            this.gameBoard.appendChild(card);
            this.cards.push(card);
        });
    }
    
    createCard(cardData, index) {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.index = index;
    
        const inner = document.createElement('div');
        inner.className = 'card-inner';
    
        const front = document.createElement('div');
        front.className = 'card-front';
        front.innerHTML = '?';
    
        const back = document.createElement('div');
        back.className = 'card-back';
        
        // Format the display text based on card type
        if (cardData.type === 'equation') {
            back.className = 'card-back equation-card';
            back.textContent = cardData.display;
        } else {
            back.className = 'card-back result-card';
            back.textContent = cardData.display;
        }
    
        inner.appendChild(front);
        inner.appendChild(back);
        card.appendChild(inner);
    
        // Store card data
        card.value = cardData.value;
        card.isRevealed = false;
    
        // Add click handler
        card.addEventListener('click', () => {
            if (this.cardClickHandler && !card.isRevealed) {
                this.cardClickHandler(card);
            }
        });
    
        return card;
    }

    revealCard(card) {
        card.isRevealed = true;
        card.classList.add('flipped');
    }

    hideCard(card) {
        card.isRevealed = false;
        card.classList.remove('flipped');
    }

    async showMatch(card1, card2) {
        // Add match animation
        card1.classList.add('matched');
        card2.classList.add('matched');

        // Wait for animation
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    async showMismatch(card1, card2) {
        // Add mismatch animation
        card1.classList.add('mismatched');
        card2.classList.add('mismatched');

        // Wait for animation
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Remove animation classes
        card1.classList.remove('mismatched');
        card2.classList.remove('mismatched');
    }

    updateTimer(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        const display = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
        document.getElementById('timer').textContent = display;
    }

    updateMoves(moves) {
        document.getElementById('moves').textContent = moves;
    }

    updateScore(score) {
        document.getElementById('score').textContent = score;
    }

    showGameComplete(stats) {
        const overlay = document.createElement('div');
        overlay.className = 'game-complete-overlay';

        const content = document.createElement('div');
        content.className = 'game-complete-content';

        content.innerHTML = `
            <h2>🎉 Congratulations! 🎉</h2>
            <div class="complete-stats">
                <p>Time: ${Math.floor(stats.time / 60)}:${(stats.time % 60).toString().padStart(2, '0')}</p>
                <p>Moves: ${stats.moves}</p>
                <p>Difficulty: ${stats.difficulty.charAt(0).toUpperCase() + stats.difficulty.slice(1)}</p>
            </div>
            <div class="complete-buttons">
                <button class="play-again-btn">Play Again</button>
                <button class="home-btn">Home</button>
            </div>
        `;

        overlay.appendChild(content);
        this.container.appendChild(overlay);

        // Add button handlers
        overlay.querySelector('.play-again-btn').addEventListener('click', () => {
            overlay.remove();
            document.getElementById('new-game-button').click();
        });

        overlay.querySelector('.home-btn').addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }

    // Event handler setters
    addCardClickHandler(handler) {
        this.cardClickHandler = handler;
    }

    addBackHandler(handler) {
        document.getElementById('back-button').addEventListener('click', handler);
    }

    addNewGameHandler(handler) {
        document.getElementById('new-game-button').addEventListener('click', handler);
    }

    addDifficultyHandler(handler) {
        document.getElementById('difficulty-select').addEventListener('change', (e) => {
            handler(e.target.value);
        });
    }
}

export default MathMatchView;