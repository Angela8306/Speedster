// models/MathMatchModel.js

class MathMatchModel {
    constructor(operation = 'all', difficulty = 'easy') {
        this.operation = operation;
        this.difficulty = difficulty;
        this.pairs = [];
        this.difficultySettings = {
            easy: {
                gridSize: 12, // 6 pairs
                maxNumber: 6,  // Changed to 6 for 6x6 tables
                operations: ['addition', 'multiplication'],
                operationRanges: {
                    addition: { min: 1, max: 6 },      // Up to 6+6
                    subtraction: { min: 1, max: 6 },   // Up to 6-6
                    multiplication: { min: 1, max: 6 }, // Up to 6x6
                },
                divisionRange: { 
                    divisorMax: 5,
                    maxDividend: 25
                }
            },
            medium: {
                gridSize: 20, // 10 pairs
                maxNumber: 9,  // Changed to 9 for 9x9 tables
                operations: ['addition', 'subtraction', 'multiplication'],
                operationRanges: {
                    addition: { min: 1, max: 9 },      // Up to 9+9
                    subtraction: { min: 1, max: 10 },   // Up to 9-9
                    multiplication: { min: 1, max: 9 }, // Up to 9x9
                },
                divisionRange: { 
                    divisorMax: 9,
                    maxDividend: 81
                }
            },
            hard: {
                gridSize: 24, // 12 pairs
                maxNumber: 12,  // Changed to 12 for 12x12 tables
                operations: ['addition', 'subtraction', 'multiplication', 'division'],
                operationRanges: {
                    addition: { min: 1, max: 12 },      // Up to 12+12
                    subtraction: { min: 1, max: 12 },   // Up to 12-12
                    multiplication: { min: 1, max: 12 }, // Up to 12x12
                },
                divisionRange: { 
                    divisorMax: 12,
                    maxDividend: 144
                }
            }
        };
        this.usedResults = new Set();
    }

    generateEquation(settings) {
        const operations = this.operation !== 'all' ? [this.operation] : settings.operations;
        const operation = operations[Math.floor(Math.random() * operations.length)];
        
        if (operation === 'division') {
            return this.generateDivisionProblem(settings);
        }

        let num1, num2, result, display;
        const range = settings.operationRanges[operation];
        
        switch (operation) {
            case 'addition':
                num1 = Math.floor(Math.random() * range.max) + 1;
                num2 = Math.floor(Math.random() * range.max) + 1;
                result = num1 + num2;
                display = `${num1} + ${num2}`;
                break;

            case 'subtraction':
                // For subtraction, ensure num1 > num2 for positive results
                num1 = Math.floor(Math.random() * range.max) + 1;
                num2 = Math.floor(Math.random() * num1) + 1; // Ensures num2 ≤ num1
                result = num1 - num2;
                display = `${num1} - ${num2}`;
                break;

            case 'multiplication':
                num1 = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
                num2 = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
                result = num1 * num2;
                display = `${num1} × ${num2}`;
                break;

            default:
                throw new Error(`Unknown operation: ${operation}`);
        }

        // Ensure sums in addition don't exceed twice the max range
        if (operation === 'addition' && result > range.max * 2) {
            return this.generateEquation(settings);
        }

        return { display, result };
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

        // Remove duplicates
        validDivisionFacts = validDivisionFacts.filter((fact, index, self) => 
            index === self.findIndex(f => 
                f.dividend === fact.dividend && 
                f.divisor === fact.divisor && 
                f.quotient === fact.quotient
            )
        );

        const randomIndex = Math.floor(Math.random() * validDivisionFacts.length);
        const chosen = validDivisionFacts[randomIndex];
        
        return {
            display: `${chosen.dividend} ÷ ${chosen.divisor}`,
            result: chosen.quotient
        };
    }

    generateCardPairs() {
        const settings = this.difficultySettings[this.difficulty];
        const numPairs = settings.gridSize / 2;
        const pairs = [];
        const usedEquations = new Set();
        this.usedResults.clear();

        let attempts = 0;
        const maxAttempts = 500;

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
        const cards = pairs.flatMap(pair => [pair.equation, pair.result]);
        
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
        const perfectMoves = this.getTotalPairs() * 2;
        const timeWeight = 0.5;
        
        let score = Math.max(
            1000 - (moves - perfectMoves) * 10 - timeElapsed * timeWeight,
            0
        );

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