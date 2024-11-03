class MathPopup {
    constructor() {
        this.popup = null;
        this.colorSettings = {
            primaryNumber: true,    // Column number
            secondaryNumber: false, // Second number
            operator: false,        // Operation symbol
            equals: false,         // Equals sign
            result: true          // Answer
        };
        this.colors = {
            primaryNumber: '#7eb2ff',   // Blue
            secondaryNumber: '#ffa07a',  // Light coral
            operator: '#98fb98',        // Pale green
            equals: '#deb887',          // Burlywood
            result: '#da70d6'           // Orchid
        };
    }

    create(operation, equations) {
        const popup = document.createElement('div');
        popup.className = 'popup-overlay';

        const content = this.createContent(operation, equations);
        popup.appendChild(content);

        this.popup = popup;
        return popup;
    }

    createContent(operation, equations) {
        const content = document.createElement('div');
        content.className = 'popup-content';
    
        // Title section
        const titleSection = document.createElement('div');
        titleSection.className = 'title-section';
    
        const title = document.createElement('h2');
        title.textContent = `${operation.charAt(0).toUpperCase() + operation.slice(1)} Practice`;
        titleSection.appendChild(title);
    
        // Create header buttons container
        const headerButtons = document.createElement('div');
        headerButtons.className = 'header-buttons';
    
        // Practice button
        const practiceButton = document.createElement('button');
        practiceButton.className = 'practice-button';
        practiceButton.textContent = 'Practice';
        practiceButton.addEventListener('click', () => {
            // Import and create PracticeSelection
            import('./PracticeSelection.js').then(module => {
                const PracticeSelection = module.default;
                const practiceSelection = new PracticeSelection();
                const selectionElement = practiceSelection.create(operation);
                document.body.appendChild(selectionElement);
                
                // Add close handler
                practiceSelection.addCloseHandler(async () => {
                    await practiceSelection.hide();
                });
                
                // Add start handler
                practiceSelection.addStartHandler((selectedColumns, operation) => {
                    console.log('Starting practice with columns:', selectedColumns);
                    console.log('Operation:', operation);
                    // We'll implement the actual practice mode later
                });
                
                practiceSelection.show();
            });
        });
    
        // Highlight options button
        const highlightButton = document.createElement('button');
        highlightButton.className = 'highlight-options-button';
        highlightButton.innerHTML = `
            <span>Highlights</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
        `;
    
        // Close button
        const closeButton = document.createElement('button');
        closeButton.className = 'close-button';
        closeButton.textContent = '×';
    
        // Add all buttons to header buttons container
        headerButtons.appendChild(practiceButton);
        headerButtons.appendChild(highlightButton);
        headerButtons.appendChild(closeButton);
    
        // Add header buttons to title section
        titleSection.appendChild(headerButtons);
        content.appendChild(titleSection);
    
        // Color customization panel (hidden by default)
        const colorPanel = this.createColorPanel();
        headerButtons.appendChild(colorPanel); // Attach to headerButtons for proper positioning
    
        // Toggle color panel visibility
        highlightButton.addEventListener('click', () => {
            const isActive = colorPanel.classList.contains('active');
            colorPanel.classList.toggle('active');
            highlightButton.classList.toggle('active');
            
            if (isActive) {
                setTimeout(() => {
                    colorPanel.style.visibility = 'hidden';
                }, 200);
            } else {
                colorPanel.style.visibility = 'visible';
            }
        });
    
        // Close panel when clicking outside
        document.addEventListener('click', (e) => {
            if (!colorPanel.contains(e.target) && 
                !highlightButton.contains(e.target) && 
                colorPanel.classList.contains('active')) {
                colorPanel.classList.remove('active');
                highlightButton.classList.remove('active');
                setTimeout(() => {
                    colorPanel.style.visibility = 'hidden';
                }, 200);
            }
        });
    
        const grid = this.createGrid(equations, operation);
        content.appendChild(grid);
    
        return content;
    }

    createColorPanel() {
        const panel = document.createElement('div');
        panel.className = 'color-panel';

        const options = [
            { key: 'primaryNumber', label: 'Column Numbers' },
            { key: 'secondaryNumber', label: 'Second Numbers' },
            { key: 'operator', label: 'Operators' },
            { key: 'equals', label: 'Equals Signs' },
            { key: 'result', label: 'Results' }
        ];

        const checkboxContainer = document.createElement('div');
        checkboxContainer.className = 'checkbox-container';

        options.forEach(({ key, label }) => {
            const container = document.createElement('div');
            container.className = 'checkbox-item';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `color-${key}`;
            checkbox.checked = this.colorSettings[key];
            checkbox.addEventListener('change', (e) => {
                this.colorSettings[key] = e.target.checked;
                this.updateColors();
            });

            const labelElement = document.createElement('label');
            labelElement.htmlFor = `color-${key}`;
            labelElement.textContent = label;
            
            const colorPreview = document.createElement('span');
            colorPreview.className = 'color-preview';
            colorPreview.style.backgroundColor = this.colors[key];

            container.appendChild(checkbox);
            container.appendChild(labelElement);
            container.appendChild(colorPreview);
            checkboxContainer.appendChild(container);
        });

        panel.appendChild(checkboxContainer);
        return panel;
    }

    createGrid(equations, operation) {
        const grid = document.createElement('div');
        grid.className = 'number-grid';

        // Create first row (1-6)
        grid.appendChild(this.createRow(1, 6, equations, operation));

        // Create second row (7-12)
        grid.appendChild(this.createRow(7, 12, equations, operation));

        return grid;
    }

    createRow(start, end, equations, operation) {
        const row = document.createElement('div');
        row.className = 'number-row';

        for (let i = start; i <= end; i++) {
            const column = this.createColumn(i, equations[i-1], operation);
            row.appendChild(column);
        }

        return row;
    }

    createColumn(number, equations, operation) {
        const column = document.createElement('div');
        column.className = 'number-column';

        const mainNumber = document.createElement('div');
        mainNumber.className = 'main-number';
        mainNumber.textContent = number;
        column.appendChild(mainNumber);

        const equationsList = document.createElement('div');
        equationsList.className = 'equations-list';

        equations.forEach(equation => {
            const formattedEquation = this.formatEquation(equation, operation);
            equationsList.appendChild(formattedEquation);
        });

        column.appendChild(equationsList);
        return column;
    }

    formatEquation(equation, operation) {
        const parts = equation.split(' ');
        const span = document.createElement('span');
        span.className = 'equation';

        // First number
        const num1 = document.createElement('span');
        num1.className = 'number primaryNumber';
        num1.textContent = parts[0];
        num1.style.color = this.colorSettings.primaryNumber ? this.colors.primaryNumber : '#ffffff';
        span.appendChild(num1);

        // Operator
        const operator = document.createElement('span');
        operator.className = 'operator';
        operator.textContent = ` ${parts[1]} `;
        operator.style.color = this.colorSettings.operator ? this.colors.operator : '#ffffff';
        span.appendChild(operator);

        // Second number
        const num2 = document.createElement('span');
        num2.className = 'secondaryNumber';
        num2.textContent = parts[2];
        num2.style.color = this.colorSettings.secondaryNumber ? this.colors.secondaryNumber : '#ffffff';
        span.appendChild(num2);

        // Equals sign
        const equals = document.createElement('span');
        equals.className = 'equals';
        equals.textContent = ' = ';
        equals.style.color = this.colorSettings.equals ? this.colors.equals : '#ffffff';
        span.appendChild(equals);

        // Result
        const result = document.createElement('span');
        result.className = 'result';
        result.textContent = parts[4];
        result.style.color = this.colorSettings.result ? this.colors.result : '#ffffff';
        span.appendChild(result);

        return span;
    }

    updateColors() {
        if (!this.popup) return;

        Object.keys(this.colorSettings).forEach(key => {
            const elements = this.popup.querySelectorAll(`.${key}`);
            elements.forEach(element => {
                element.style.color = this.colorSettings[key] ? this.colors[key] : '#ffffff';
            });
        });
    }

    show() {
        if (this.popup) {
            requestAnimationFrame(() => {
                this.popup.classList.add('active');
            });
        }
    }

    hide() {
        if (this.popup) {
            this.popup.classList.remove('active');
            return new Promise(resolve => {
                setTimeout(() => {
                    this.popup.remove();
                    this.popup = null;
                    resolve();
                }, 300);
            });
        }
        return Promise.resolve();
    }

    addCloseHandler(handler) {
        if (this.popup) {
            const closeButton = this.popup.querySelector('.close-button');
            closeButton.addEventListener('click', handler);
            
            this.popup.addEventListener('click', (e) => {
                if (e.target === this.popup) {
                    handler();
                }
            });
        }
    }
}

export default MathPopup;