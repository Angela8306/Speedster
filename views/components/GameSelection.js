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
        title.textContent = `${operation.charAt(0).toUpperCase() + operation.slice(1)} Games`;
        
        const closeButton = document.createElement('button');
        closeButton.className = 'game-selection-close';
        closeButton.textContent = '×';
        
        header.appendChild(title);
        header.appendChild(closeButton);

        // Games Grid
        const gamesGrid = document.createElement('div');
        gamesGrid.className = 'games-grid';

        // Get games that support this operation
        const games = this.gameLibrary.getGamesByOperation(operation);

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

    createGameCard({ id, title, description, thumbnail }) {
        const card = document.createElement('div');
        card.className = 'game-card';
        card.innerHTML = `
            <div class="game-thumbnail">${thumbnail}</div>
            <div class="game-info">
                <h3>${title}</h3>
                <p>${description}</p>
            </div>
        `;

        card.addEventListener('click', () => {
            this.launchGame(id);
        });

        return card;
    }

    launchGame(gameId) {
        const game = this.gameLibrary.getGameById(gameId);
        if (game) {
            console.log(`Launching ${game.title} with ${this.operation} operation`);
            // We'll implement actual game launching later
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