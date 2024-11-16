// views/components/PracticeSelection.js
class PracticeSelection {
    constructor() {
        this.selectedColumns = new Set();
        this.operation = '';
    }

    create(operation, columnCount = 12) {
        this.operation = operation;
        const overlay = document.createElement('div');
        overlay.className = 'practice-selection-overlay';

        const content = document.createElement('div');
        content.className = 'practice-selection-content';

        // Header
        const header = document.createElement('div');
        header.className = 'practice-selection-header';
        
        const title = document.createElement('h2');
        title.textContent = operation === 'all' ? 
            'Practice Setup' : 
            `${operation.charAt(0).toUpperCase() + operation.slice(1)} Practice Setup`;
        
        const closeButton = document.createElement('button');
        closeButton.className = 'practice-selection-close';
        closeButton.textContent = '×';
        
        header.appendChild(title);
        header.appendChild(closeButton);

        // Selection Grid
        const selectionArea = document.createElement('div');
        selectionArea.className = 'practice-selection-area';

        const instructions = document.createElement('p');
        instructions.className = 'selection-instructions';
        instructions.textContent = 'Select the numbers you want to practice with:';
        selectionArea.appendChild(instructions);

        // Quick selection buttons
        const quickSelect = document.createElement('div');
        quickSelect.className = 'quick-select-buttons';

        const selectAllBtn = document.createElement('button');
        selectAllBtn.textContent = 'Select All';
        selectAllBtn.className = 'quick-select-btn';
        selectAllBtn.addEventListener('click', () => this.selectAll(columnCount));

        const clearAllBtn = document.createElement('button');
        clearAllBtn.textContent = 'Clear All';
        clearAllBtn.className = 'quick-select-btn';
        clearAllBtn.addEventListener('click', () => this.clearAll());

        quickSelect.appendChild(selectAllBtn);
        quickSelect.appendChild(clearAllBtn);
        selectionArea.appendChild(quickSelect);

        // Number grid
        const grid = document.createElement('div');
        grid.className = 'number-selection-grid';

        for (let i = 1; i <= columnCount; i++) {
            const numberBox = document.createElement('div');
            numberBox.className = 'number-box';
            numberBox.textContent = i;
            numberBox.dataset.number = i;

            numberBox.addEventListener('click', () => {
                numberBox.classList.toggle('selected');
                if (this.selectedColumns.has(i)) {
                    this.selectedColumns.delete(i);
                } else {
                    this.selectedColumns.add(i);
                }
                this.updateStartButton();
            });

            grid.appendChild(numberBox);
        }

        selectionArea.appendChild(grid);

        // Start button
        const startButton = document.createElement('button');
        startButton.className = 'start-practice-button disabled';
        startButton.textContent = 'Start Practice';
        startButton.disabled = true;

        // Assemble the content
        content.appendChild(header);
        content.appendChild(selectionArea);
        content.appendChild(startButton);
        overlay.appendChild(content);

        this.overlay = overlay;
        this.startButton = startButton;
        return overlay;
    }

    selectAll(columnCount) {
        this.selectedColumns.clear();
        for (let i = 1; i <= columnCount; i++) {
            this.selectedColumns.add(i);
            const numberBox = this.overlay.querySelector(`[data-number="${i}"]`);
            if (numberBox) numberBox.classList.add('selected');
        }
        this.updateStartButton();
    }

    clearAll() {
        this.selectedColumns.clear();
        const numberBoxes = this.overlay.querySelectorAll('.number-box');
        numberBoxes.forEach(box => box.classList.remove('selected'));
        this.updateStartButton();
    }

    updateStartButton() {
        if (this.selectedColumns.size > 0) {
            this.startButton.classList.remove('disabled');
            this.startButton.disabled = false;
        } else {
            this.startButton.classList.add('disabled');
            this.startButton.disabled = true;
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
        const closeButton = this.overlay.querySelector('.practice-selection-close');
        closeButton.addEventListener('click', handler);
        
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                handler();
            }
        });
    }

    addStartHandler(handler) {
        this.startButton.addEventListener('click', () => {
            if (this.selectedColumns.size > 0) {
                const operations = this.operation === 'all' ? 
                    ['addition', 'subtraction', 'multiplication', 'division'] :
                    [this.operation];
                
                const columns = Array.from(this.selectedColumns).join(',');
                window.location.href = `practice.html?operations=${operations.join(',')}&columns=${columns}`;
            }
        });
    }
}

export default PracticeSelection;