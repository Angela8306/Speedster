import GameLibrary from '../../models/GameLibrary.js';

class GameSelection {
    constructor() {
        this.overlay = null;
        this.operation = '';
        this.gameLibrary = new GameLibrary();
    }

    create(operation) {
        this.operation = operation;
        const overlay = document.createElement('div');
        overlay.className = 'game-selection-overlay';

        const content = document.createElement('div');
        content.className = 'game-selection-content';

        // Header
        const header = document.createElement('div');
        header.className = 'game-selection-header';
        
        const title = document.createElement('h2');
        title.textContent = operation === 'all' ? 
            'Math Games' : 
            `${operation.charAt(0).toUpperCase() + operation.slice(1)} Games`;
        
        const closeButton = document.createElement('button');
        closeButton.className = 'game-selection-close';
        closeButton.textContent = '×';
        
        header.appendChild(title);
        header.appendChild(closeButton);

        // Games Grid
        const gamesGrid = document.createElement('div');
        gamesGrid.className = 'games-grid';

        // Get games that support this operation
        const games = operation === 'all' ? 
            this.gameLibrary.getAllGames() : 
            this.gameLibrary.getGamesByOperation(operation);

        games.forEach(game => {
            const gameCard = this.createGameCard(game);
            gamesGrid.appendChild(gameCard);
        });

        // Assemble the content
        content.appendChild(header);
        content.appendChild(gamesGrid);
        overlay.appendChild(content);

        this.overlay = overlay;
        return overlay;
    }

    createGameCard({ id, title, description, thumbnail, features, supportedOperations }) {
        const card = document.createElement('div');
        card.className = 'game-card';
        
        const thumbnailDiv = document.createElement('div');
        thumbnailDiv.className = 'game-thumbnail';
        thumbnailDiv.textContent = thumbnail;

        const infoDiv = document.createElement('div');
        infoDiv.className = 'game-info';
        
        const titleEl = document.createElement('h3');
        titleEl.textContent = title;

        const descEl = document.createElement('p');
        descEl.textContent = description;

        infoDiv.appendChild(titleEl);
        infoDiv.appendChild(descEl);

        // Create features list if available
        if (features && features.length) {
            const featuresList = document.createElement('ul');
            featuresList.className = 'game-features';
            features.forEach(feature => {
                const li = document.createElement('li');
                li.textContent = feature;
                featuresList.appendChild(li);
            });
            infoDiv.appendChild(featuresList);
        }
        
        card.appendChild(thumbnailDiv);
        card.appendChild(infoDiv);

        card.addEventListener('click', () => {
            if (this.operation === 'all') {
                this.showOperationPicker(id, supportedOperations);
            } else {
                this.launchGame(id, this.operation);
            }
        });

        return card;
    }

    showOperationPicker(gameId, supportedOperations) {
        const picker = document.createElement('div');
        picker.className = 'operation-picker-overlay';
        
        const content = document.createElement('div');
        content.className = 'operation-picker-content';
        
        const title = document.createElement('h3');
        title.textContent = 'Choose an Operation';
        
        const operationsList = document.createElement('div');
        operationsList.className = 'operations-list';
        
        const operations = [
            { id: 'addition', label: 'Addition', icon: '+' },
            { id: 'subtraction', label: 'Subtraction', icon: '-' },
            { id: 'multiplication', label: 'Multiplication', icon: '×' },
            { id: 'division', label: 'Division', icon: '÷' }
        ];
        
        operations.forEach(op => {
            if (supportedOperations.includes(op.id)) {
                const button = document.createElement('button');
                button.className = 'operation-choice';
                button.innerHTML = `
                    <span class="operation-icon">${op.icon}</span>
                    <span class="operation-label">${op.label}</span>
                `;
                button.addEventListener('click', () => {
                    picker.remove();
                    this.launchGame(gameId, op.id);
                });
                operationsList.appendChild(button);
            }
        });
        
        const cancelButton = document.createElement('button');
        cancelButton.className = 'cancel-button';
        cancelButton.textContent = 'Cancel';
        cancelButton.addEventListener('click', () => picker.remove());
        
        content.appendChild(title);
        content.appendChild(operationsList);
        content.appendChild(cancelButton);
        picker.appendChild(content);
        
        // Click outside to close
        picker.addEventListener('click', (e) => {
            if (e.target === picker) {
                picker.remove();
            }
        });
        
        document.body.appendChild(picker);
        requestAnimationFrame(() => picker.classList.add('active'));
    }

    async launchGame(gameId, operation) {
        try {
            await this.gameLibrary.launchGame(gameId, operation);
            // Remove the game selection overlay after successful launch
            this.hide();
        } catch (error) {
            console.error('Error launching game:', error);
            // Show error message to user
            const errorMessage = document.createElement('div');
            errorMessage.className = 'game-error-message';
            errorMessage.textContent = error.message;
            this.overlay.querySelector('.game-selection-content').appendChild(errorMessage);
            
            // Remove error message after 3 seconds
            setTimeout(() => errorMessage.remove(), 3000);
        }
    }

    show() {
        requestAnimationFrame(() => {
            this.overlay.classList.add('active');
        });
    }

    hide() {
        this.overlay.classList.remove('active');
        return new Promise(resolve => {
            setTimeout(() => {
                this.overlay.remove();
                resolve();
            }, 300);
        });
    }

    addCloseHandler(handler) {
        const closeButton = this.overlay.querySelector('.game-selection-close');
        closeButton.addEventListener('click', handler);
        
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                handler();
            }
        });
    }
}

export default GameSelection;