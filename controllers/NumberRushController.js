// controllers/NumberRushController.js
import NumberRushModel from '../models/NumberRushModel.js';
import NumberRushView from '../views/components/NumberRushView.js';

class NumberRushController {
    constructor(operation) {
        this.model = new NumberRushModel(operation);
        this.view = new NumberRushView();
        this.gameTimer = null;
    }

    initialize() {
        // Create and add view to DOM
        const gameView = this.view.create();
        document.body.innerHTML = '';
        document.body.appendChild(gameView);

        // Setup event handlers
        this.view.addStartHandler(() => this.startGame());
        this.view.addAnswerHandler((answer) => this.handleAnswer(answer));
        this.view.addBackHandler(() => {
            window.location.href = 'index.html';
        });

        // Show start screen
        this.view.showScreen('start-screen');
    }

    startGame() {
        this.model.startGame();
        this.view.showScreen('game-screen');
        this.view.updateProblem(this.model.currentProblem);
        this.view.updateStats(this.model.score, this.model.timeLeft, this.model.streak);

        // Start timer
        this.gameTimer = setInterval(() => {
            this.model.timeLeft--;
            this.view.updateStats(this.model.score, this.model.timeLeft, this.model.streak);

            if (this.model.timeLeft <= 0) {
                this.endGame();
            }
        }, 1000);
    }

    handleAnswer(answer) {
        if (!this.model.isGameActive) return;

        const isCorrect = this.model.checkAnswer(answer);
        this.view.showFeedback(isCorrect);
        this.view.updateStats(this.model.score, this.model.timeLeft, this.model.streak);
        
        // Generate new problem
        this.model.generateProblem();
        this.view.updateProblem(this.model.currentProblem);
    }

    endGame() {
        clearInterval(this.gameTimer);
        this.model.endGame();
        this.view.showGameOver(this.model.score, this.model.highScore);
    }
}

export { NumberRushController };