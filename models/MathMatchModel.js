// models/MathMatchModel.js

class MathMatchModel {
    constructor(operation = 'all', difficulty = 'easy') {
        this.operation = operation;
        this.difficulty = difficulty;
        this.pairs = [];
        this.difficultySettings = {
            easy: {
                gridSize: 12, // 6 pairs
                maxNumber: 10,
                operations: ['addition', 'multiplication']
            },
            medium: {
                gridSize: 20, // 10 pairs
                maxNumber: 12,
                operations: ['addition', 'subtraction', 'multiplication']
            },
            hard: {
                gridSize: 24, // 12 pairs
                maxNumber: 15,
                operations: ['addition', 'subtraction', 'multiplication', 'division']
            }
        };
    }

    generateCardPairs() {
        const settings = this.difficultySettings[this.difficulty];
        const numPairs = settings.gridSize / 2;
        const pairs = [];
        const usedEquations = new Set();

        while (pairs.length < numPairs) {
            const equation = this.generateEquation(settings);
            const equationString = equation.display;

            // Avoid duplicate equations
            if (!usedEquations.has(equationString)) {
                usedEquations.add(equationString);
                pairs.push({
                    equation: {
                        type: 'equation',
                        display: equationString,
                        value: equation.result.toString()
                    },
                    result: {
                        type: 'result',
                        display: equation.result.toString(),
                        value: equation.result.toString()
                    }
                });
            }
        }

        this.pairs = this.shuffleCards(pairs);
        return this.pairs;
    }

    generateEquation(settings) {
        let operations = settings.operations;
        if (this.operation !== 'all') {
            operations = [this.operation];
        }

        const operation = operations[Math.floor(Math.random() * operations.length)];
        const max = settings.maxNumber;
        let num1, num2, result, display;

        switch (operation) {
            case 'addition':
                num1 = Math.floor(Math.random() * max) + 1;
                num2 = Math.floor(Math.random() * max) + 1;
                result = num1 + num2;
                display = `${num1} + ${num2}`;
                break;

            case 'subtraction':
                num2 = Math.floor(Math.random() * max) + 1;
                result = Math.floor(Math.random() * max) + 1;
                num1 = result + num2; // Ensures positive result
                display = `${num1} - ${num2}`;
                break;

            case 'multiplication':
                num1 = Math.floor(Math.random() * (max/2)) + 1;
                num2 = Math.floor(Math.random() * (max/2)) + 1;
                result = num1 * num2;
                display = `${num1} × ${num2}`;
                break;

            case 'division':
                num2 = Math.floor(Math.random() * (max/2)) + 1;
                result = Math.floor(Math.random() * (max/2)) + 1;
                num1 = result * num2; // Ensures whole number result
                display = `${num1} ÷ ${num2}`;
                break;

            default:
                throw new Error(`Unknown operation: ${operation}`);
        }

        return { display, result };
    }

    shuffleCards(pairs) {
        // Create array of all cards (equations and results)
        const cards = pairs.flatMap(pair => [pair.equation, pair.result]);
        
        // Fisher-Yates shuffle
        for (let i = cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cards[i], cards[j]] = [cards[j], cards[i]];
        }

        return cards;
    }

    isMatch(value1, value2) {
        return value1 === value2;
    }

    getTotalPairs() {
        return this.difficultySettings[this.difficulty].gridSize / 2;
    }

    getGridSize() {
        return this.difficultySettings[this.difficulty].gridSize;
    }

    validateOperation(operation) {
        const validOperations = ['addition', 'subtraction', 'multiplication', 'division', 'all'];
        return validOperations.includes(operation);
    }

    validateDifficulty(difficulty) {
        return difficulty in this.difficultySettings;
    }

    calculateScore(moves, timeElapsed) {
        const perfectMoves = this.getTotalPairs() * 2; // Minimum possible moves
        const timeWeight = 0.5; // Lower weight for time to prioritize accuracy
        
        // Base score calculation
        let score = Math.max(
            1000 - (moves - perfectMoves) * 10 - timeElapsed * timeWeight,
            0
        );

        // Difficulty multiplier
        const difficultyMultiplier = {
            easy: 1,
            medium: 1.5,
            hard: 2
        };

        return Math.round(score * difficultyMultiplier[this.difficulty]);
    }

    getDifficultySettings() {
        return Object.keys(this.difficultySettings);
    }
}

export default MathMatchModel;