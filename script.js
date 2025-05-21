document.addEventListener('DOMContentLoaded', () => {
    const lottoNumbersDiv = document.getElementById('lotto-numbers');
    const generateButton = document.getElementById('generate-button');

    function generateLottoNumbers() {
        const numbers = new Set();
        while (numbers.size < 6) {
            const randomNumber = Math.floor(Math.random() * 45) + 1;
            numbers.add(randomNumber);
        }
        return Array.from(numbers).sort((a, b) => a - b);
    }

    function displayNumbers(numbers) {
        lottoNumbersDiv.innerHTML = ''; // Clear previous numbers
        numbers.forEach(number => {
            const numberDiv = document.createElement('div');
            numberDiv.classList.add('lotto-number');
            numberDiv.textContent = number;
            // Optional: Add color classes based on number ranges
            // if (number <= 10) numberDiv.classList.add('lotto-number-yellow');
            // else if (number <= 20) numberDiv.classList.add('lotto-number-blue');
            // else if (number <= 30) numberDiv.classList.add('lotto-number-red');
            // else if (number <= 40) numberDiv.classList.add('lotto-number-gray');
            // else numberDiv.classList.add('lotto-number-green'); // Default, though base is green
            lottoNumbersDiv.appendChild(numberDiv);
        });
    }

    generateButton.addEventListener('click', () => {
        const newNumbers = generateLottoNumbers();
        displayNumbers(newNumbers);
    });

    // Simple test for generateLottoNumbers (logs to console)
    // This will be expanded or moved based on the plan's test step
    console.log("Running initial test for generateLottoNumbers...");
    const testNumbers = generateLottoNumbers();
    console.log("Generated numbers:", testNumbers);
    if (testNumbers.length === 6) {
        console.log("Test PASSED: Correct number of elements (6).");
    } else {
        console.error("Test FAILED: Incorrect number of elements. Expected 6, got " + testNumbers.length);
    }
    const uniqueTest = new Set(testNumbers).size === testNumbers.length;
    if (uniqueTest) {
        console.log("Test PASSED: All numbers are unique.");
    } else {
        console.error("Test FAILED: Numbers are not unique.");
    }
    const rangeTest = testNumbers.every(num => num >= 1 && num <= 45);
    if (rangeTest) {
        console.log("Test PASSED: All numbers are within range [1, 45].");
    } else {
        console.error("Test FAILED: Numbers are out of range.");
    }
});
