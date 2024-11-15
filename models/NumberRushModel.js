// models/NumberRushModel.js
class NumberRushModel {
    constructor(operation) {
        this.operation = operation;
        this.score = 0;
        this.timeLeft = 60; // 60 seconds game duration
        this.currentProblem = null;
        this.isGameActive = false;
        this.streak = 0;
        this.highScore = this.loadHighScore();
    }

    generateProblem() {
        const num1 = Math.floor(Math.random() * 12) + 1;
        const num2 = Math.floor(Math.random() * 12) + 1;
        let problem = {};

        switch(this.operation) {
            case 'addition':
                problem = {
                    num1,
                    num2,
                    operator: '+',
                    answer: num1 + num2
                };
                break;
            case 'subtraction':
                // Ensure larger number is first to avoid negative results
                problem = {
                    num1: Math.max(num1, num2),
                    num2: Math.min(num1, num2),
                    operator: '-',
                    answer: Math.max(num1, num2) - Math.min(num1, num2)
                };
                break;
            case 'multiplication':
                problem = {
                    num1,
                    num2,
                    operator: '×',
                    answer: num1 * num2
                };
                break;
            case 'division':
                // Ensure division results in whole number
                const dividend = num1 * num2;
                problem = {
                    num1: dividend,
                    num2: num1,
                    operator: '÷',
                    answer: num2
                };
                break;
        }
        this.currentProblem = problem;
        return problem;
    }

    checkAnswer(userAnswer) {
        const isCorrect = parseInt(userAnswer) === this.currentProblem.answer;
        if (isCorrect) {
            this.streak++;
            // Score calculation: base points (10) + streak bonus
            const streakBonus = Math.min(this.streak - 1, 5) * 2; // Max 10 bonus points
            this.score += 10 + streakBonus;
        } else {
            this.streak = 0;
        }
        return isCorrect;
    }

    startGame() {
        this.score = 0;
        this.timeLeft = 60;
        this.streak = 0;
        this.isGameActive = true;
        this.generateProblem();
    }

    endGame() {
        this.isGameActive = false;
        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.saveHighScore();
        }
    }

    loadHighScore() {
        const key = `numberRush_${this.operation}_highScore`;
        return parseInt(localStorage.getItem(key)) || 0;
    }

    saveHighScore() {
        const key = `numberRush_${this.operation}_highScore`;
        localStorage.setItem(key, this.highScore.toString());
    }
}

export default NumberRushModel;