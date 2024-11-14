class GameLibrary {
    constructor() {
        this.games = [
            {
                id: 'number-rush',
                title: 'Number Rush',
                description: 'Race against time to solve math problems!',
                thumbnail: '🏃‍♂️',
                supportedOperations: ['addition', 'subtraction', 'multiplication', 'division']
            },
            {
                id: 'math-match',
                title: 'Math Match',
                description: 'Match pairs of equations and answers',
                thumbnail: '🎯',
                supportedOperations: ['addition', 'subtraction', 'multiplication', 'division']
            },
            {
                id: 'space-math',
                title: 'Space Math',
                description: 'Solve equations to help your rocket fly!',
                thumbnail: '🚀',
                supportedOperations: ['addition', 'multiplication', 'division']
            },
            {
                id: 'math-monsters',
                title: 'Math Monsters',
                description: 'Defeat friendly monsters by solving their math puzzles',
                thumbnail: '👾',
                supportedOperations: ['addition', 'subtraction', 'multiplication']
            },
            {
                id: 'candy-math',
                title: 'Candy Math',
                description: 'Collect candies by solving sweet math problems',
                thumbnail: '🍬',
                supportedOperations: ['addition', 'subtraction', 'multiplication', 'division']
            },
            {
                id: 'pirate-math',
                title: 'Pirate Math Adventure',
                description: 'Find hidden treasure by solving math riddles with Captain Calculator',
                thumbnail: '🏴‍☠️',
                supportedOperations: ['addition', 'subtraction', 'multiplication']
            }
        ];
    }

    getAllGames() {
        return this.games;
    }

    getGamesByOperation(operation) {
        return this.games.filter(game => 
            game.supportedOperations.includes(operation.toLowerCase())
        );
    }

    getGameById(id) {
        return this.games.find(game => game.id === id);
    }

    addNewGame(game) {
        // Validate required fields
        const requiredFields = ['id', 'title', 'description', 'supportedOperations'];
        const missingFields = requiredFields.filter(field => !game[field]);
        
        if (missingFields.length > 0) {
            throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
        }

        // Check for duplicate ID
        if (this.getGameById(game.id)) {
            throw new Error(`Game with ID ${game.id} already exists`);
        }

        this.games.push(game);
    }
}

export default GameLibrary;