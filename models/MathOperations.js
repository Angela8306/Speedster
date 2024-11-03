class MathOperations {
    constructor() {
        this.numbers = Array.from({ length: 12 }, (_, i) => i + 1);
    }

    generateEquations(num, operation) {
        return this.numbers.map(i => {
            switch (operation) {
                case 'addition':
                    return `${num} + ${i} = ${num + i}`;
                case 'subtraction': {
                    // Start with the larger number to avoid negative results
                    const largerNum = num + i;
                    return `${largerNum} - ${num} = ${i}`;
                }
                case 'multiplication':
                    return `${num} × ${i} = ${num * i}`;
                case 'division': {
                    // Use column number as divisor
                    const dividend = num * i;
                    return `${dividend} ÷ ${num} = ${i}`;
                }
                default:
                    return '';
            }
        });
    }

    getOperations() {
        return ['addition', 'subtraction', 'multiplication', 'division'];
    }
}

export default MathOperations;