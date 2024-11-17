// controllers/MathMatchController.js

class MathMatchController {
    constructor(operation = 'all', difficulty = 'easy') {
        this.operation = operation;
        this.difficulty = difficulty;
        this.resetGameState();
    }

    resetGameState() {
        this.model = null;
        this.view = null;
        this.firstCard = null;
        this.secondCard = null;
        this.isProcessing = false;
        this.moveCount = 0;
        this.matchedPairs = 0;
        this.timer = null;
        this.timeElapsed = 0;
    }

    async initialize() {
        try {
            this.resetGameState(); // Reset all game state when initializing

            // Import dependencies
            const { default: MathMatchModel } = await import('../models/MathMatchModel.js');
            const { default: MathMatchView } = await import('../views/components/MathMatchView.js');

            // Initialize model and view
            this.model = new MathMatchModel(this.operation, this.difficulty);
            this.view = new MathMatchView();

            // Create the game board
            document.body.innerHTML = ''; // Clear existing content
            const gameBoard = this.view.create();
            document.body.appendChild(gameBoard);

            // Generate card pairs
            const cardPairs = this.model.generateCardPairs();
            
            // Setup the game board
            this.view.setupBoard(cardPairs);

            // Add event listeners
            this.setupEventListeners();

            // Reset and start the timer
            this.startTimer();

            // Reset display
            this.view.updateMoves(this.moveCount);
            this.view.updateScore(this.matchedPairs);

        } catch (error) {
            console.error('Error initializing Math Match:', error);
        }
    }

    async handleCardClick(card) {
        // Prevent clicking if processing or card is already revealed
        if (this.isProcessing || card.isRevealed || card === this.firstCard) {
            return;
        }

        // Reveal the clicked card
        this.view.revealCard(card);

        // Handle first card click
        if (!this.firstCard) {
            this.firstCard = card;
            return;
        }

        // Handle second card click
        this.secondCard = card;
        this.moveCount++;
        this.view.updateMoves(this.moveCount);
        this.isProcessing = true;

        // Check for match
        if (this.model.isMatch(this.firstCard.value, this.secondCard.value)) {
            await this.handleMatch();
        } else {
            await this.handleMismatch();
        }

        // Reset selection
        this.firstCard = null;
        this.secondCard = null;
        this.isProcessing = false;

        // Check if game is complete
        if (this.matchedPairs === this.model.getTotalPairs()) {
            this.handleGameComplete();
        }
    }

    async handleMatch() {
        this.matchedPairs++;
        await this.view.showMatch(this.firstCard, this.secondCard);
        this.view.updateScore(this.matchedPairs);
    }

    async handleMismatch() {
        await this.view.showMismatch(this.firstCard, this.secondCard);
        // Wait for animation, then hide cards
        await new Promise(resolve => setTimeout(resolve, 1000));
        this.view.hideCard(this.firstCard);
        this.view.hideCard(this.secondCard);
    }

    handleGameComplete() {
        this.stopTimer();
        const stats = {
            moves: this.moveCount,
            time: this.timeElapsed,
            difficulty: this.difficulty
        };
        this.view.showGameComplete(stats);
    }

    setupEventListeners() {
        // Add card click handlers
        this.view.addCardClickHandler(this.handleCardClick.bind(this));

        // Add back button handler
        this.view.addBackHandler(() => {
            this.stopTimer();
            window.location.href = 'index.html';
        });

        // Add new game button handler
        this.view.addNewGameHandler(() => {
            this.stopTimer();
            this.initialize();
        });

        // Add difficulty change handler
        this.view.addDifficultyHandler((newDifficulty) => {
            this.difficulty = newDifficulty;
            this.stopTimer();
            this.initialize();
        });
    }

    startTimer() {
        this.timeElapsed = 0;
        if (this.timer) {
            clearInterval(this.timer);
        }
        this.timer = setInterval(() => {
            this.timeElapsed++;
            this.view.updateTimer(this.timeElapsed);
        }, 1000);
    }

    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    cleanup() {
        this.stopTimer();
    }
}

export default MathMatchController;