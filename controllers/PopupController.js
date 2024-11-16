// controllers/PopupController.js

import MathPopup from '../views/components/MathPopup.js';
import GameSelection from '../views/components/GameSelection.js';
import PracticeSelection from '../views/components/PracticeSelection.js';

class PopupController {
    constructor(model) {
        this.model = model;
        this.currentPopup = null;
    }

    initialize() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Operation boxes
        const operationBoxes = document.querySelectorAll('.operation-box');
        operationBoxes.forEach(box => {
            box.addEventListener('click', (e) => {
                const operation = e.currentTarget.getAttribute('data-operation');
                this.showPopup(operation);
            });
        });

        // Practice All button
        const practiceAllButton = document.querySelector('.practice-all-button');
        if (practiceAllButton) {
            practiceAllButton.addEventListener('click', () => {
                console.log('Practice All clicked');  // Debug log
                this.showPracticeSelection('all');
            });
        }

        // Play Games button
        const playGamesButton = document.querySelector('.play-games-button');
        if (playGamesButton) {
            playGamesButton.addEventListener('click', () => {
                this.showGameSelection('all');
            });
        }
    }

    async showPracticeSelection(operation) {
        console.log('Showing practice selection for:', operation);  // Debug log
        
        if (this.currentPopup) {
            await this.currentPopup.hide();
        }

        const practiceSelection = new PracticeSelection();
        const selectionElement = practiceSelection.create(operation);
        document.body.appendChild(selectionElement);
        
        // Add close handler
        practiceSelection.addCloseHandler(async () => {
            await practiceSelection.hide();
            this.currentPopup = null;
        });

        // Add start handler - this is key for practice all functionality
        practiceSelection.addStartHandler(() => {
            // The handler is now set up in PracticeSelection.js
            console.log('Start handler triggered');  // Debug log
        });
        
        practiceSelection.show();
        this.currentPopup = practiceSelection;
    }

    async showGameSelection(operation) {
        if (this.currentPopup) {
            await this.currentPopup.hide();
        }

        const gameSelection = new GameSelection();
        const selectionElement = gameSelection.create(operation);
        document.body.appendChild(selectionElement);
        
        gameSelection.addCloseHandler(async () => {
            await gameSelection.hide();
            this.currentPopup = null;
        });

        gameSelection.show();
        this.currentPopup = gameSelection;
    }

    async showPopup(operation) {
        if (this.currentPopup) {
            await this.currentPopup.hide();
        }

        const popup = new MathPopup();
        
        const allEquations = Array.from({ length: 12 }, (_, i) => 
            this.model.generateEquations(i + 1, operation)
        );

        const popupElement = popup.create(operation, allEquations);
        document.body.appendChild(popupElement);
        
        popup.addCloseHandler(async () => {
            await popup.hide();
            this.currentPopup = null;
        });

        popup.show();
        this.currentPopup = popup;
    }
}

export default PopupController;