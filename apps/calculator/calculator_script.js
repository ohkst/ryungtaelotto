document.addEventListener('DOMContentLoaded', () => {
    const displayElement = document.getElementById('calculator-display');
    const buttons = document.querySelectorAll('.calculator-buttons .button');

    let currentOperand = '0';
    let previousOperand = '';
    let operation = undefined;
    let displayNeedsReset = false;

    function updateDisplay() {
        displayElement.textContent = currentOperand;
    }

    function clear() {
        currentOperand = '0';
        previousOperand = '';
        operation = undefined;
        displayNeedsReset = false;
        updateDisplay();
    }

    function appendNumber(number) {
        if (currentOperand === '0' || displayNeedsReset) {
            currentOperand = number;
            displayNeedsReset = false;
        } else {
            // Prevent excessively long numbers if display has fixed width
            if (currentOperand.length >= 12) return;
            currentOperand += number;
        }
        updateDisplay();
    }

    function chooseOperation(selectedOperation) {
        if (currentOperand === '' && previousOperand === '') return; // Nothing to operate on

        if (previousOperand !== '' && operation && !displayNeedsReset) {
            // If there's a previous op and new number entered, calculate first
            calculate();
        }

        // If currentOperand is empty but previousOperand exists, it means user is chaining ops
        // e.g. 5 * = (sets previous to 5, op to *, current is empty), then user presses +
        // We should use the previousOperand as the new currentOperand to start the next op.
        if (currentOperand === '' && previousOperand !== '') {
             // This case is subtle: if user hits op, then another op, use the result/previous as new base
             // currentOperand = previousOperand; // Or let it be, and calculate will handle.
             // For now, just set the operation and wait for next number or equals.
        } else {
             previousOperand = currentOperand;
        }

        operation = selectedOperation;
        currentOperand = ''; // Ready for next operand, or will be filled by result if equals is hit next
        displayNeedsReset = true;
        // Display can show previousOperand + operation symbol here if desired
        // displayElement.textContent = previousOperand + ' ' + operationSymbol(operation);
    }

    function calculate() {
        let result;
        const prev = parseFloat(previousOperand);
        const current = parseFloat(currentOperand);

        if (isNaN(prev) || isNaN(current)) {
            // If current is not a number (e.g. user hit 5 * =), use prev as result
            if(!isNaN(prev) && operation && displayNeedsReset) { // displayNeedsReset implies an op was just chosen
                currentOperand = previousOperand; // Effectively makes "5 * =" become "5 * 5 ="
                return calculate(); // Recalculate with currentOperand set
            }
            return; // Not enough info to calculate
        }


        switch (operation) {
            case 'add':
                result = prev + current;
                break;
            case 'subtract':
                result = prev - current;
                break;
            case 'multiply':
                result = prev * current;
                break;
            case 'divide':
                if (current === 0) {
                    alert("Cannot divide by zero!");
                    clear();
                    return;
                }
                result = prev / current;
                break;
            default:
                return; // No operation
        }

        // Basic handling for floating point precision issues for display
        if (result.toString().includes('.')) {
             result = parseFloat(result.toFixed(8)); // Limit to 8 decimal places
        }

        currentOperand = result.toString();
        operation = undefined;
        previousOperand = ''; // Calculation complete, reset previousOperand
        displayNeedsReset = true; // Next number input should clear the result
        updateDisplay();
    }

    function handleDecimal() {
        if (displayNeedsReset) { // If starting new number after op or equals
            currentOperand = '0.';
            displayNeedsReset = false;
        } else if (!currentOperand.includes('.')) {
            currentOperand += '.';
        }
        updateDisplay();
    }

    function handleSign() {
        if (currentOperand === '0' || currentOperand === '') return;
        currentOperand = (parseFloat(currentOperand) * -1).toString();
        updateDisplay();
    }

    function handlePercent() {
        if (currentOperand === '0' || currentOperand === '') return;
        currentOperand = (parseFloat(currentOperand) / 100).toString();
        // After percent, typically an operation or equals would follow.
        // Some calculators apply it in context of an operation (e.g. 100+10% = 110)
        // This is a simpler "convert to percentage value"
        displayNeedsReset = true;
        updateDisplay();
    }

    // Add event listeners to buttons
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const action = button.dataset.action;
            const number = button.dataset.number;
            const operator = button.dataset.operator;

            if (number !== undefined) {
                appendNumber(number);
            } else if (operator !== undefined) {
                chooseOperation(operator);
            } else if (action !== undefined) {
                switch (action) {
                    case 'clear':
                        clear();
                        break;
                    case 'calculate':
                        // Only calculate if we have a pending operation and numbers
                        if (operation && previousOperand !== '' && currentOperand !== '') {
                            calculate();
                        } else if (operation && previousOperand !== '' && currentOperand === '') {
                            // Handle case like "5 * =" -> should use 5 as currentOperand
                            currentOperand = previousOperand;
                            calculate();
                        }
                        break;
                    case 'decimal':
                        handleDecimal();
                        break;
                    case 'sign':
                        handleSign();
                        break;
                    case 'percent':
                        handlePercent();
                        break;
                }
            }
        });
    });

    clear(); // Initialize display
});
