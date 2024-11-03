class PracticeView {
    constructor() {
        this.correctCount = 0;
        this.incorrectCount = 0;
    }

    create() {
        const container = document.createElement('div');
        container.className = 'practice-container';

        container.innerHTML = `
            <div class="header">
                <h1 class="title">Math Practice</h1>
                <button class="back-button">← Back</button>
            </div>

            <div class="practice-area">
                <div id="equation-display" class="equation-display"></div>
                <div class="stats">
                    <div class="stat-item">
                        <div class="stat-label">Correct</div>
                        <div class="stat-value" id="correct-count">0</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">Incorrect</div>
                        <div class="stat-value" id="incorrect-count">0</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">Remaining</div>
                        <div class="stat-value" id="remaining-count">0</div>
                    </div>
                </div>
            </div>
        `;

        return container;
    }

    createAnswerInput() {
        return `<input type="number" class="answer-input" id="answer-input" autocomplete="off">`;
    }

    showProblem(problemData) {
        const display = document.getElementById('equation-display');
        display.innerHTML = ''; // Clear previous content

        switch(problemData.format) {
            case 'horizontal':
                this.showHorizontalProblem(display, problemData);
                break;
            case 'vertical':
                this.showVerticalProblem(display, problemData);
                break;
            case 'fraction':
                this.showFractionProblem(display, problemData);
                break;
            case 'longDivision':
                this.showLongDivisionProblem(display, problemData);
                break;
        }
    }

    showHorizontalProblem(display, { num1, num2, operator }) {
        display.innerHTML = `
            <div class="horizontal-problem">
                ${num1} ${operator} ${num2} = 
                ${this.createAnswerInput()}
            </div>
        `;
    }

    showVerticalProblem(display, { num1, num2, operator }) {
        display.innerHTML = `
            <div class="vertical-problem">
                <div class="top-number">${num1}</div>
                <div class="bottom-line">
                    <span class="operator">${operator}</span>${num2}
                </div>
                <div class="answer-line">
                    ${this.createAnswerInput()}
                </div>
            </div>
        `;
    }

    showFractionProblem(display, { dividend, divisor }) {
        display.innerHTML = `
            <div class="fraction-problem">
                <div class="fraction">
                    <div class="numerator">${dividend}</div>
                    <div class="fraction-line"></div>
                    <div class="denominator">${divisor}</div>
                </div>
                <div class="equals-sign">=</div>
                ${this.createAnswerInput()}
            </div>
        `;
    }

    showLongDivisionProblem(display, { dividend, divisor }) {
        display.innerHTML = `
            <div class="long-division-problem">
                <div class="division-setup">
                    <div class="divisor">${divisor}</div>
                    <div class="division-bracket">
                        <div class="quotient-line">
                            ${this.createAnswerInput()}
                        </div>
                        <div class="dividend">${dividend}</div>
                    </div>
                </div>
            </div>
        `;
    }

    updateStats(correct, incorrect, remaining) {
        document.getElementById('correct-count').textContent = correct;
        document.getElementById('incorrect-count').textContent = incorrect;
        document.getElementById('remaining-count').textContent = remaining;
    }

    addSubmitHandler(handler) {
        document.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const input = document.getElementById('answer-input');
                const answer = parseInt(input.value);
                if (!isNaN(answer)) {
                    handler(answer);
                }
            }
        });
    }

    addBackHandler(handler) {
        const backButton = document.querySelector('.back-button');
        backButton.addEventListener('click', handler);
    }
}

export default PracticeView;