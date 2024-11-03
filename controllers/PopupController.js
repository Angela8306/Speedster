import MathPopup from '../views/components/MathPopup.js';

class PopupController {
    constructor(model) {
        this.model = model;
        this.currentPopup = null;
    }

    initialize() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        const operationBoxes = document.querySelectorAll('.operation-box');
        operationBoxes.forEach(box => {
            box.addEventListener('click', (e) => {
                const operation = e.currentTarget.getAttribute('data-operation');
                this.showPopup(operation);
            });
        });
    }

    async showPopup(operation) {
        // Hide existing popup if any
        if (this.currentPopup) {
            await this.currentPopup.hide();
        }

        // Create new popup
        const popup = new MathPopup();
        
        // Generate equations for all numbers (1-12)
        const allEquations = Array.from({ length: 12 }, (_, i) => 
            this.model.generateEquations(i + 1, operation)
        );

        // Create and show popup
        const popupElement = popup.create(operation, allEquations);
        document.body.appendChild(popupElement);
        
        // Add close handler
        popup.addCloseHandler(async () => {
            await popup.hide();
            this.currentPopup = null;
        });

        // Show popup with animation
        popup.show();
        this.currentPopup = popup;
    }
}

export default PopupController;