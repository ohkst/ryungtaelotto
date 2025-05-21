document.addEventListener('DOMContentLoaded', () => {
    const lottoNumbersDiv = document.getElementById('lotto-numbers');
    const generateButton = document.getElementById('generate-button');
    const gemStyles = ['gem-ruby', 'gem-sapphire', 'gem-emerald', 'gem-topaz', 'gem-amethyst', 'gem-diamond'];

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
        numbers.forEach((number, index) => { // Added index for animation delay
            const numberDiv = document.createElement('div');
            numberDiv.classList.add('lotto-number');
            
            // Randomly assign a gem style
            const randomGemClass = gemStyles[Math.floor(Math.random() * gemStyles.length)];
            numberDiv.classList.add(randomGemClass);
            
            numberDiv.textContent = number;
            
            // Apply animation delay based on index (improves upon pure CSS nth-child if numbers are rapidly regenerated)
            // This ensures the stagger effect is consistent even if the number of .lotto-number elements changes.
            numberDiv.style.animationDelay = `${index * 0.2}s`; 

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
