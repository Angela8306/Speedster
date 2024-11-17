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
                operations: ['addition', 'multiplication'],
                divisionRange: { 
                    divisorMax: 5,  // up to 5x table
                    maxDividend: 25 // largest dividend for easy level
                }
            },
            medium: {
                gridSize: 20, // 10 pairs
                maxNumber: 12,
                operations: ['addition', 'subtraction', 'multiplication'],
                divisionRange: { 
                    divisorMax: 9,  // up to 9x table
                    maxDividend: 81 // largest dividend for medium level
                }
            },
            hard: {
                gridSize: 24, // 12 pairs
                maxNumber: 15,
                operations: ['addition', 'subtraction', 'multiplication', 'division'],
                divisionRange: { 
                    divisorMax: 12,  // up to 12x table
                    maxDividend: 144 // largest dividend overall
                }
            }
        };
        this.usedResults = new Set();
    }

    generateDivisionProblem(settings) {
        const range = settings.divisionRange;
        
        // Get all valid division facts for this difficulty
        let validDivisionFacts = [];
        
        // Generate division facts based on multiplication tables
        for (let divisor = 1; divisor <= range.divisorMax; divisor++) {
            for (let multiplier = 2; multiplier <= 12; multiplier++) {
                const dividend = divisor * multiplier;
                if (dividend <= range.maxDividend) {
                    // Add the division fact
                    validDivisionFacts.push({
                        dividend: dividend,
                        divisor: divisor,
                        quotient: multiplier
                    });
                    
                    // Add the reversed version if it's within range and would give a different result
                    if (multiplier <= range.divisorMax && dividend <= range.maxDividend) {
                        validDivisionFacts.push({
                            dividend: dividend,
                            divisor: multiplier,
                            quotient: divisor
                        });
                    }
                }
            }
        }

        // Remove only true duplicates (exactly same dividend, divisor, and quotient)
        validDivisionFacts = validDivisionFacts.filter((fact, index, self) => 
            index === self.findIndex(f => 
                f.dividend === fact.dividend && 
                f.divisor === fact.divisor && 
                f.quotient === fact.quotient
            )
        );

        // Shuffle the facts array to get a random one
        const randomIndex = Math.floor(Math.random() * validDivisionFacts.length);
        const chosen = validDivisionFacts[randomIndex];
        
        return {
            display: `${chosen.dividend} ÷ ${chosen.divisor}`,
            result: chosen.quotient
        };
    }

    generateEquation(settings) {
        const operations = this.operation !== 'all' ? [this.operation] : settings.operations;
        const operation = operations[Math.floor(Math.random() * operations.length)];
        const max = settings.maxNumber;
        
        if (operation === 'division') {
            return this.generateDivisionProblem(settings);
        }

        // Rest of the operation cases remain the same...
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
                num1 = result + num2;
                display = `${num1} - ${num2}`;
                break;

            case 'multiplication':
                num1 = Math.floor(Math.random() * (Math.floor(max/2))) + 1;
                num2 = Math.floor(Math.random() * (Math.floor(max/2))) + 1;
                result = num1 * num2;
                display = `${num1} × ${num2}`;
                break;

            default:
                throw new Error(`Unknown operation: ${operation}`);
        }

        if (result > max || num1 > max || num2 > max) {
            return this.generateEquation(settings);
        }

        return { display, result };
    }

    generateCardPairs() {
        const settings = this.difficultySettings[this.difficulty];
        const numPairs = settings.gridSize / 2;
        const pairs = [];
        const usedEquations = new Set();
        this.usedResults.clear();

        let attempts = 0;
        const maxAttempts = 500; // Increased for better coverage

        while (pairs.length < numPairs && attempts < maxAttempts) {
            attempts++;
            try {
                const equation = this.generateEquation(settings);
                const equationString = equation.display;
                const resultString = equation.result.toString();

                if (!usedEquations.has(equationString) && !this.usedResults.has(resultString)) {
                    usedEquations.add(equationString);
                    this.usedResults.add(resultString);
                    
                    pairs.push({
                        equation: {
                            type: 'equation',
                            display: equationString,
                            value: resultString
                        },
                        result: {
                            type: 'result',
                            display: resultString,
                            value: resultString
                        }
                    });
                }
            } catch (error) {
                console.error('Error generating equation:', error);
                continue;
            }
        }

        this.pairs = this.shuffleCards(pairs);
        return this.pairs;
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