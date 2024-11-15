// models/PirateMathModel.js

class PirateMathModel {
    constructor(operation) {
        this.operation = operation;
        this.islands = [
            {
                name: "Starter Bay",
                riddles: {
                    addition: "First ye must prove worthy! If {x} pirates join forces with {y} more pirates, how many pirates be in the crew?",
                    subtraction: "First ye must prove worthy! If {x} pirates leave the crew of {y}, how many remain?",
                    multiplication: "First ye must prove worthy! Each of {x} pirates found {y} gold coins. How many coins be there in total?",
                    division: "First ye must prove worthy! If {x} gold coins be split equally among {y} pirates, how many coins does each get?"
                },
                difficulty: 1,
                background: '🏝️'
            },
            {
                name: "Skull Rock",
                riddles: {
                    addition: "The crew found {x} gems and then {y} more. How many gems in total?",
                    subtraction: "The chest had {y} gems but {x} were fake. How many real gems remain?",
                    multiplication: "Each of {x} pirates found {y} gems. How many gems in total?",
                    division: "A treasure chest has {x} gems to split among {y} pirates. How many gems per pirate?"
                },
                difficulty: 2,
                background: '💀'
            },
            {
                name: "Treasure Lagoon",
                riddles: {
                    addition: "Ye found {x} gold pieces in one chest and {y} in another. What's the total haul?",
                    subtraction: "Started with {y} gold pieces but lost {x} in a storm. How many remain?",
                    multiplication: "Each of {x} treasure maps leads to {y} gold pieces. How much gold awaits in total?",
                    division: "If {x} gold pieces need to be split among {y} crew members, how many per pirate?"
                },
                difficulty: 3,
                background: '⛵'
            },
            {
                name: "Kraken's Cove",
                riddles: {
                    addition: "Found {x} pearls in one tentacle and {y} in another. How many pearls total?",
                    subtraction: "The kraken had {y} pearls but dropped {x}. How many does it have now?",
                    multiplication: "Each of {x} chests contains {y} pearls. How many pearls in total?",
                    division: "The kraken's {x} pearls are shared among {y} ships. How many per ship?"
                },
                difficulty: 4,
                background: '🦑'
            },
            {
                name: "Captain's Secret",
                riddles: {
                    addition: "Found {x} jewels in one chest and {y} in a secret compartment. Total jewels?",
                    subtraction: "Captain had {y} jewels but buried {x}. How many does he keep?",
                    multiplication: "The Captain has {x} treasure chests with {y} jewels in each. How many jewels total?",
                    division: "The Captain's {x} jewels need to be split into {y} equal shares. How many per share?"
                },
                difficulty: 5,
                background: '🗝️'
            }
        ];
        this.currentProblem = null;
        this.highScore = this.loadHighScore();
    }

    startGame() {
        this.resetProgress();
    }

    getIsland(index) {
        const island = this.islands[index];
        const problem = this.generateProblem(island.difficulty);
        this.currentProblem = problem;
        
        // Get the appropriate riddle for the current operation
        const riddle = island.riddles[this.operation];
        
        return {
            ...island,
            riddle: this.formatRiddle(riddle, problem)
        };
    }

    generateProblem(difficulty) {
        let num1, num2, answer;

        switch(this.operation) {
            case 'multiplication':
                // Keep both numbers at max 12
                num1 = Math.floor(Math.random() * 12) + 1;
                num2 = Math.floor(Math.random() * 12) + 1;
                answer = num1 * num2;
                break;
                
            case 'division':
                // For division, generate num2 (divisor) first, max 12
                num2 = Math.floor(Math.random() * 12) + 1;
                // Generate quotient (max 12)
                const quotient = Math.floor(Math.random() * 12) + 1;
                // Calculate dividend
                num1 = num2 * quotient;
                answer = quotient; // answer will be quotient
                break;
                
            case 'addition':
                // Keep both numbers at max 12
                num1 = Math.floor(Math.random() * 12) + 1;
                num2 = Math.floor(Math.random() * 12) + 1;
                answer = num1 + num2;
                break;
                
            case 'subtraction':
                // Generate smaller number first (max 12)
                num1 = Math.floor(Math.random() * 12) + 1;
                // Generate larger number (must be larger than num1 but max 12)
                num2 = num1 + Math.floor(Math.random() * (12 - num1)) + 1;
                answer = num2 - num1; // num2 is larger
                break;
                
            default:
                throw new Error('Invalid operation: ' + this.operation);
        }

        // Log the generated problem
        console.log('Generated problem:', {
            operation: this.operation,
            num1,
            num2,
            answer
        });
        
        return { num1, num2, answer };
    }

    formatRiddle(riddle, problem) {
        return riddle
            .replace('{x}', problem.num1)
            .replace('{y}', problem.num2);
    }

    checkAnswer(userAnswer) {
        console.log('Checking answer:', {
            userAnswer: parseInt(userAnswer),
            correctAnswer: this.currentProblem.answer,
            currentProblem: this.currentProblem
        });

        const isCorrect = parseInt(userAnswer) === this.currentProblem.answer;
        
        if (isCorrect && this.currentScore > this.highScore) {
            this.highScore = this.currentScore;
            this.saveHighScore();
        }
        return isCorrect;
    }

    getHint(islandIndex) {
        const problem = this.currentProblem;
        const hints = {
            addition: [
                `Try counting up from ${problem.num1}, adding ${problem.num2} more`,
                `Break ${problem.num2} into smaller numbers to add easier`,
                `Think of putting ${problem.num1} and ${problem.num2} treasures together`
            ],
            subtraction: [
                `Start at ${problem.num2} and count down ${problem.num1}`,
                `Think of taking away ${problem.num1} from ${problem.num2}`,
                `How many steps from ${problem.num1} to ${problem.num2}?`
            ],
            multiplication: [
                `Try breaking ${problem.num1} × ${problem.num2} into smaller parts...`,
                `Think of it as adding ${problem.num1} to itself ${problem.num2} times`,
                `If ye had ${problem.num2} piles of ${problem.num1} coins each...`
            ],
            division: [
                `How many times does ${problem.num2} go into ${problem.num1}?`,
                `Think of sharing ${problem.num1} coins equally among ${problem.num2} pirates`,
                `What number times ${problem.num2} gives ye ${problem.num1}?`
            ]
        };

        // Get random hint for the operation
        const operationHints = hints[this.operation] || [];
        return operationHints[Math.floor(Math.random() * operationHints.length)] ||
               "Think carefully about the numbers in the riddle...";
    }

    get islandCount() {
        return this.islands.length;
    }

    loadHighScore() {
        const key = `pirateMath_${this.operation}_highScore`;
        return parseInt(localStorage.getItem(key)) || 0;
    }

    saveHighScore() {
        const key = `pirateMath_${this.operation}_highScore`;
        localStorage.setItem(key, this.highScore.toString());
    }

    resetProgress() {
        this.currentProblem = null;
        this.currentScore = 0;
    }
}

export default PirateMathModel;