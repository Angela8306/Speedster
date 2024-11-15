// models/GameLibrary.js

class GameLibrary {
    constructor() {
        this.games = [
            {
                id: 'number-rush',
                title: 'Number Rush',
                description: 'Race against time to solve math problems!',
                thumbnail: '🏃‍♂️',
                features: [
                    'Fast-paced problem solving',
                    'Score multipliers for streaks',
                    'Time pressure challenges',
                    'Beat your high score'
                ],
                supportedOperations: ['addition', 'subtraction', 'multiplication', 'division']
            },
            {
                id: 'pirate-math',
                title: 'Pirate Math Adventure',
                description: 'Join Captain Calculator to solve riddles and find hidden treasure!',
                thumbnail: '🏴‍☠️',
                features: [
                    'Solve pirate-themed math riddles',
                    'Earn coins for correct answers',
                    'Use hints to help navigate tricky waters',
                    'Progress through multiple themed islands'
                ],
                supportedOperations: ['addition', 'subtraction', 'multiplication', 'division'],
                minDifficulty: 1,
                maxDifficulty: 5
            },
            {
                id: 'math-match',
                title: 'Math Match',
                description: 'Match pairs of equations and answers',
                thumbnail: '🎯',
                features: [
                    'Memory-based matching game',
                    'Multiple difficulty levels',
                    'Practice equation recognition',
                    'Time-based challenges'
                ],
                supportedOperations: ['addition', 'subtraction', 'multiplication', 'division']
            },
            {
                id: 'space-math',
                title: 'Space Math',
                description: 'Solve equations to help your rocket fly!',
                thumbnail: '🚀',
                features: [
                    'Space-themed math adventure',
                    'Guide your rocket through challenges',
                    'Collect space items',
                    'Navigate through asteroid fields'
                ],
                supportedOperations: ['addition', 'multiplication', 'division']
            },
            {
                id: 'math-monsters',
                title: 'Math Monsters',
                description: 'Defeat friendly monsters by solving their math puzzles',
                thumbnail: '👾',
                features: [
                    'Cute monster characters',
                    'Progressive difficulty',
                    'Collect monster cards',
                    'Special power-ups'
                ],
                supportedOperations: ['addition', 'subtraction', 'multiplication']
            },
            {
                id: 'candy-math',
                title: 'Candy Math',
                description: 'Collect candies by solving sweet math problems',
                thumbnail: '🍬',
                features: [
                    'Sweet candy-themed problems',
                    'Build your candy collection',
                    'Special holiday events',
                    'Share candies with friends'
                ],
                supportedOperations: ['addition', 'subtraction', 'multiplication', 'division']
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

    async launchGame(gameId, operation) {
        const game = this.getGameById(gameId);
        if (!game) {
            throw new Error(`Game with ID ${gameId} not found`);
        }

        // Verify the operation is supported
        if (!game.supportedOperations.includes(operation)) {
            throw new Error(`Operation ${operation} is not supported by ${game.title}`);
        }

        try {
            switch (gameId) {
                case 'number-rush':
                    const { NumberRushController } = await import('../controllers/NumberRushController.js');
                    const rushController = new NumberRushController(operation);
                    rushController.initialize();
                    break;

                case 'pirate-math':
                    const { default: PirateMathController } = await import('../controllers/PirateMathController.js');
                    const pirateController = new PirateMathController(operation);
                    pirateController.initialize();
                    break;

                case 'math-match':
                case 'space-math':
                case 'math-monsters':
                case 'candy-math':
                    throw new Error(`${game.title} is coming soon! Stay tuned for more math adventures!`);

                default:
                    throw new Error(`Game ${gameId} is not yet implemented`);
            }
        } catch (error) {
            console.error(`Error launching game: ${error.message}`);
            // You might want to show an error message to the user here
            throw error; // Re-throw to handle in the calling code
        }
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

        // Validate supported operations
        const validOperations = ['addition', 'subtraction', 'multiplication', 'division'];
        const invalidOperations = game.supportedOperations.filter(op => 
            !validOperations.includes(op.toLowerCase())
        );

        if (invalidOperations.length > 0) {
            throw new Error(`Invalid operations: ${invalidOperations.join(', ')}`);
        }

        // Add default properties if not provided
        game.features = game.features || [];
        game.minDifficulty = game.minDifficulty || 1;
        game.maxDifficulty = game.maxDifficulty || 1;

        this.games.push(game);
    }

    getGameDifficulty(gameId) {
        const game = this.getGameById(gameId);
        if (!game) {
            throw new Error(`Game with ID ${gameId} not found`);
        }
        return {
            min: game.minDifficulty || 1,
            max: game.maxDifficulty || 1
        };
    }

    getGameFeatures(gameId) {
        const game = this.getGameById(gameId);
        if (!game) {
            throw new Error(`Game with ID ${gameId} not found`);
        }
        return game.features || [];
    }
}

export default GameLibrary;