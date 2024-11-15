// controllers/PirateMathController.js

import PirateMathModel from '../models/PirateMathModel.js';
import PirateMathView from '../views/components/PirateMathView.js';

class PirateMathController {
    constructor(operation) {
        this.model = new PirateMathModel(operation);
        this.view = new PirateMathView();
        this.currentIsland = 0;
        this.coins = 0;
    }

    initialize() {
        // Create and add view to DOM
        const gameView = this.view.create();
        document.body.innerHTML = '';
        document.body.appendChild(gameView);

        // Setup event handlers
        this.view.addStartHandler(() => this.startGame());
        this.view.addAnswerHandler((answer) => this.handleAnswer(answer));
        this.view.addHintHandler(() => this.useHint());
        this.view.addBackHandler(() => {
            window.location.href = 'index.html';
        });

        // Show intro screen
        this.view.showScreen('intro-screen');
    }

    startGame() {
        this.model.startGame();
        this.view.showScreen('map-screen');
        this.loadIsland(0); // Start at first island
    }

    loadIsland(islandIndex) {
        const island = this.model.getIsland(islandIndex);
        this.currentIsland = islandIndex;
        this.view.showIsland(island);
        this.view.updateCoins(this.coins);
    }

    handleAnswer(answer) {
        const isCorrect = this.model.checkAnswer(answer);
        if (isCorrect) {
            this.coins += 10;
            this.view.showSuccess(this.coins);
            
            if (this.currentIsland < this.model.islandCount - 1) {
                setTimeout(() => this.loadIsland(this.currentIsland + 1), 1500);
            } else {
                this.view.showVictory(this.coins);
            }
        } else {
            this.view.showIncorrectFeedback();
        }
    }

    useHint() {
        if (this.coins >= 5) {
            this.coins -= 5;
            const hint = this.model.getHint(this.currentIsland);
            this.view.showHint(hint, this.coins);
        } else {
            this.view.showInsufficientCoins();
        }
    }
}

export default PirateMathController;