import PracticeView from '../views/components/PracticeView.js';
import MathOperations from '../models/MathOperations.js';

class PracticeController {
    constructor() {
        this.view = new PracticeView();
        this.model = new MathOperations();
        this.operation = '';
        this.columns = [];
        this.currentProblem = null;
        this.correctCount = 0;
        this.incorrectCount = 0;
    }

    initialize(operation, columns) {
        this.operation = operation;
        this.columns = columns;
        
        // Create and add view to DOM
        const practiceView = this.view.create();
        document.body.innerHTML = ''; // Clear existing content
        document.body.appendChild(practiceView);
        
        // Setup event handlers
        this.view.addSubmitHandler(this.handleSubmit.bind(this));
        this.view.addBackHandler(() => {
            window.location.href = 'index.html';
        });

        // Show first problem
        this.showNewProblem();
    }

    generateProblem() {
        const num1 = this.columns[Math.floor(Math.random() * this.columns.length)];
        const num2 = Math.floor(Math.random() * 12) + 1;
        const formats = this.getAvailableFormats(this.operation);
        const format = formats[Math.floor(Math.random() * formats.length)];

        switch(this.operation) {
            case 'addition':
            case 'subtraction': {
                const largerNum = this.operation === 'subtraction' ? (num1 + num2) : num1;
                const smallerNum = this.operation === 'subtraction' ? num1 : num2;
                const operator = this.operation === 'addition' ? '+' : '-';
                return {
                    format,
                    num1: largerNum,
                    num2: smallerNum,
                    operator,
                    answer: this.operation === 'addition' ? (num1 + num2) : num2
                };
            }
            case 'multiplication': {
                const operator = format === 'horizontal' ? (Math.random() < 0.5 ? '×' : '*') : '×';
                return {
                    format,
                    num1,
                    num2,
                    operator,
                    answer: num1 * num2
                };
            }
            case 'division': {
                const dividend = num1 * num2;
                const operator = format === 'horizontal' ? (Math.random() < 0.5 ? '÷' : '/') : '÷';
                return {
                    format,
                    dividend,
                    divisor: num1,
                    num1: dividend,
                    num2: num1,
                    operator,
                    answer: num2
                };
            }
            default:
                return null;
        }
    }

    getAvailableFormats(operation) {
        switch(operation) {
            case 'addition':
            case 'subtraction':
                return ['horizontal', 'vertical'];
            case 'multiplication':
                return ['horizontal', 'vertical'];
            case 'division':
                return ['horizontal', 'fraction', 'longDivision'];
            default:
                return ['horizontal'];
        }
    }

    showNewProblem() {
        this.currentProblem = this.generateProblem();
        this.view.showProblem(this.currentProblem);
        
        // Focus the answer input
        setTimeout(() => {
            const input = document.getElementById('answer-input');
            if (input) {
                input.focus();
            }
        }, 0);
        
        this.updateStats();
    }

    handleSubmit(answer) {
        if (answer === this.currentProblem.answer) {
            this.correctCount++;
            this.showNewProblem();
        } else {
            this.incorrectCount++;
            this.updateStats();
        }
    }

    updateStats() {
        this.view.updateStats(
            this.correctCount,
            this.incorrectCount,
            this.columns.length
        );
    }
}

export default PracticeController;