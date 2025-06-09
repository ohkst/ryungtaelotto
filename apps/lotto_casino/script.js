document.addEventListener('DOMContentLoaded', () => {
    // A. Initial Setup and State Variables
    // (Keep existing DOM element selections here)

    // NEW: Constants for Lotto Number Generation Strategies
    const ALL_NUMBERS_POOL = Object.freeze(Array.from({ length: 45 }, (_, i) => i + 1));
    // maxLottoNumber is already defined below (will keep that one for now)
    // lottoNumbersPerSet is already defined below (will keep that one, equivalent to NUMBERS_PER_SET)
    const NUMBERS_PER_SET = 6; // Explicitly adding for clarity with new functions
    const MAX_GENERATION_ATTEMPTS = 1000; // Safety break for complex strategies


    // NEW: Helper Functions for Lotto Generation
    function shuffleArray(array) {
       let newArray = [...array];
       for (let i = newArray.length - 1; i > 0; i--) {
           const j = Math.floor(Math.random() * (i + 1));
           [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
       }
       return newArray;
    }

    function isPrime(num) {
       if (num <= 1) return false;
       if (num <= 3) return true;
       if (num % 2 === 0 || num % 3 === 0) return false;
       for (let i = 5; i * i <= num; i = i + 6) {
           if (num % i === 0 || num % (i + 2) === 0) return false;
       }
       return true;
    }

    // RENAMED/EXTRACTED: Original random generator
    function generateCompletelyRandom() {
       const numbers = new Set();
       while (numbers.size < NUMBERS_PER_SET) { // Using new const
           const randomNumber = Math.floor(Math.random() * maxLottoNumber) + 1; // maxLottoNumber is existing global
           numbers.add(randomNumber);
       }
       return Array.from(numbers).sort((a, b) => a - b);
    }

    // NEW: Strategy Functions
    function generateEvenOdd33() {
       let attempts = 0;
       while (attempts < MAX_GENERATION_ATTEMPTS) {
           const shuffled = shuffleArray(ALL_NUMBERS_POOL);
           const evens = shuffled.filter(n => n % 2 === 0);
           const odds = shuffled.filter(n => n % 2 !== 0);
           if (evens.length >= 3 && odds.length >= 3) {
               const selectedNumbers = evens.slice(0, 3).concat(odds.slice(0, 3));
               if (new Set(selectedNumbers).size === NUMBERS_PER_SET) {
                    return selectedNumbers.sort((a, b) => a - b);
               }
           }
           attempts++;
       }
       console.warn("generateEvenOdd33: Max attempts reached, falling back to random.");
       return generateCompletelyRandom(); // Fallback
    }

    function generateSequentialIncluded() {
       let attempts = 0;
       while (attempts < MAX_GENERATION_ATTEMPTS) {
           const numbers = new Set();
           const firstNum = Math.floor(Math.random() * (maxLottoNumber - 1)) + 1; // Ensure space for a pair
           numbers.add(firstNum);
           numbers.add(firstNum + 1);

           while (numbers.size < NUMBERS_PER_SET) {
               const randomNumber = Math.floor(Math.random() * maxLottoNumber) + 1;
               numbers.add(randomNumber);
           }
           if (numbers.size === NUMBERS_PER_SET) {
                let hasSequential = false;
                const sortedArr = Array.from(numbers).sort((a,b) => a-b);
                for(let i=0; i < sortedArr.length -1; i++) {
                    if(sortedArr[i+1] - sortedArr[i] === 1) {
                        hasSequential = true;
                        break;
                    }
                }
                if (hasSequential) return sortedArr;
           }
           attempts++;
       }
       console.warn("generateSequentialIncluded: Max attempts reached, falling back to random.");
       return generateCompletelyRandom();
    }

    function generatePrimeCombination(minPrimes = 2) {
        let attempts = 0;
        while (attempts < MAX_GENERATION_ATTEMPTS) {
            const shuffled = shuffleArray(ALL_NUMBERS_POOL);
            const primes = shuffled.filter(isPrime);
            const nonPrimes = shuffled.filter(n => !isPrime(n));

            if (primes.length >= minPrimes && nonPrimes.length >= (NUMBERS_PER_SET - minPrimes)) {
                const selectedNumbers = primes.slice(0, minPrimes).concat(nonPrimes.slice(0, NUMBERS_PER_SET - minPrimes));
                 if (new Set(selectedNumbers).size === NUMBERS_PER_SET) {
                    return selectedNumbers.sort((a, b) => a - b);
                }
            }
            attempts++;
        }
        console.warn(`generatePrimeCombination (min ${minPrimes}): Max attempts reached, falling back to random.`);
        return generateCompletelyRandom();
    }

    function generateLastDigitDistributed() {
       console.warn("generateLastDigitDistributed: Not fully implemented, using random.");
       return generateCompletelyRandom();
    }

    function generateRangeBalanced() {
       console.warn("generateRangeBalanced: Not fully implemented, using random.");
       return generateCompletelyRandom();
    }

    function generateFixedInterval() {
       console.warn("generateFixedInterval: Not fully implemented, using random.");
       return generateCompletelyRandom();
    }

    function generateRangeIntervalDistributed() {
       console.warn("generateRangeIntervalDistributed: Not fully implemented or similar to RangeBalanced, using random.");
       return generateCompletelyRandom();
    }

    // End of NEW strategy functions and helpers

    // A. Initial Setup and State Variables (Existing DOM selections continue here)
    const balanceAmountEl = document.getElementById('balance-amount');
    const betOptionButtons = document.querySelectorAll('.bet-option');
    const lastWinAmountEl = document.getElementById('last-win-amount');
    const soundToggleButton = document.getElementById('sound-toggle-button');
    const lottoSlotElements = document.querySelectorAll('.lotto-numbers-wrapper .lotto-slot');
    const historyListEl = document.getElementById('history-list');
    const jackpotMessageAreaEl = document.getElementById('jackpot-message-area');
    const generateButton = document.getElementById('generate-button');
    // NEW: Add strategy dropdown element
    const strategySelectEl = document.getElementById('lotto-strategy-select');


    let balance = 1000;
    let currentBet = 10; // Default bet
    let soundEnabled = true;
    let history = [];
    const lottoNumbersPerSet = 6; // This is equivalent to NUMBERS_PER_SET, can be harmonized later if needed
    const maxLottoNumber = 45;   // This is equivalent to MAX_LOTTO_NUMBER
    const historyLimit = 5;

    // B. Sound Effects Logic
    function playSound(soundName) {
        if (!soundEnabled) return;
        // In a real environment, you'd use Audio objects:
        // const audio = new Audio(`sounds/${soundName}.mp3`);
        // audio.play();
        console.log(`Playing sound: ${soundName}`); // Placeholder
    }

    function toggleSound() {
        soundEnabled = !soundEnabled;
        soundToggleButton.textContent = soundEnabled ? '🔊' : '🔇';
        playSound('click'); // Play click sound even if toggling off, for feedback
    }

    // C. Betting Logic
    function selectBet(amount) {
        currentBet = amount;
        betOptionButtons.forEach(btn => {
            btn.setAttribute('aria-pressed', btn.dataset.bet == currentBet);
        });
        playSound('click');
    }

    function updateBalanceDisplay() {
        balanceAmountEl.textContent = `$${balance}`;
    }

    function updateLastWinDisplay(amount) {
        lastWinAmountEl.textContent = `$${amount}`;
    }

    // D. Slot Animation Logic
    // Simplified: Just update numbers after a delay, no complex reel animation for now.
    // Full reel animation is complex and might be jerky without fine-tuning.
    function animateSlot(slotElement, finalNumber, delay) {
        return new Promise(resolve => {
            setTimeout(() => {
                // Initial placeholder or "spinning" look
                slotElement.textContent = '...';
                playSound('spin'); // Sound for each slot starting to "spin"

                setTimeout(() => {
                    slotElement.textContent = finalNumber;
                    playSound('land'); // Sound for each slot landing
                    resolve();
                }, 1500 + Math.random() * 500); // Simulate variable spin time
            }, delay);
        });
    }

    // Prepare initial slots with reels for potential future animation
    lottoSlotElements.forEach(slot => {
        slot.innerHTML = '?'; // Initial display
    });


    // E. History Logic
    function addToHistory(numbersArray) {
        history.unshift(numbersArray.join(', ')); // Add to the beginning
        if (history.length > historyLimit) {
            history.pop(); // Remove the oldest
        }
    }

    function updateHistoryDisplay() {
        historyListEl.innerHTML = ''; // Clear current list
        if (history.length === 0) {
            historyListEl.innerHTML = '<li>-</li>'; // Placeholder
            return;
        }
        history.forEach(itemText => {
            const listItem = document.createElement('li');
            listItem.textContent = itemText;
            historyListEl.appendChild(listItem);
        });
    }

    // F. Jackpot Logic
    function checkMiniJackpot(numbersArray) {
        // Example: All numbers are even
        const allEven = numbersArray.every(num => num % 2 === 0);
        // Example: All numbers <= 20
        const allLow = numbersArray.every(num => num <= 20);

        if (allEven || allLow) {
            jackpotMessageAreaEl.textContent = "🎉 MINI JACKPOT! 🎉";
            jackpotMessageAreaEl.classList.add('visible');
            playSound('jackpot');
            setTimeout(() => {
                jackpotMessageAreaEl.classList.remove('visible');
            }, 5000); // Message visible for 5 seconds
        }
    }

    // G. Main Number Generation Logic
    async function handleGenerateClick() {
        playSound('click');
        if (balance < currentBet) {
            alert("잔액이 부족합니다!");
            return;
        }

        balance -= currentBet;
        updateBalanceDisplay();
        generateButton.disabled = true; // Prevent multiple clicks during animation

        // Integrate selected strategy
        const selectedStrategy = strategySelectEl.value;
        let generatedNumbers = [];

        switch (selectedStrategy) {
            case 'evenOdd33':
                generatedNumbers = generateEvenOdd33();
                break;
            case 'sequentialIncluded':
                generatedNumbers = generateSequentialIncluded();
                break;
            case 'primeCombination':
                generatedNumbers = generatePrimeCombination();
                break;
            case 'lastDigitDistributed':
                generatedNumbers = generateLastDigitDistributed();
                break;
            case 'rangeBalanced':
                generatedNumbers = generateRangeBalanced();
                break;
            case 'fixedInterval':
                generatedNumbers = generateFixedInterval();
                break;
            case 'rangeIntervalDistributed':
                generatedNumbers = generateRangeIntervalDistributed();
                break;
            case 'random': // Fallthrough default
            default:
                generatedNumbers = generateCompletelyRandom();
                break;
        }

        // Ensure generatedNumbers is always an array of the correct size,
        // as fallback strategies should handle this.
        // Additional safety, though strategies should guarantee this:
        if (!generatedNumbers || generatedNumbers.length !== NUMBERS_PER_SET) {
            console.error("Strategy failed to return valid numbers, using fallback random.");
            generatedNumbers = generateCompletelyRandom();
        }


        const animationPromises = [];
        for (let i = 0; i < NUMBERS_PER_SET; i++) { // Use NUMBERS_PER_SET
            animationPromises.push(animateSlot(lottoSlotElements[i], generatedNumbers[i], i * 300)); // Staggered delay
        }

        await Promise.all(animationPromises); // Wait for all animations to complete

        // Simulated Win Calculation (very simple)
        let winAmount = 0;
        // Rule: if first number is < 10, win bet back. If first 2 numbers < 10, win 2x bet.
        if (generatedNumbers[0] < 10) winAmount += currentBet;
        if (generatedNumbers.length > 1 && generatedNumbers[0] < 10 && generatedNumbers[1] < 10) winAmount += currentBet * 2;
        // Rule: if any number is 7, win 3x bet (lucky 7)
        if (generatedNumbers.includes(7)) winAmount += currentBet * 3;


        if (winAmount > 0) {
            balance += winAmount;
            playSound('win');
        } else {
            playSound('lose');
        }

        updateBalanceDisplay();
        updateLastWinDisplay(winAmount);
        addToHistory(generatedNumbers);
        updateHistoryDisplay();
        checkMiniJackpot(generatedNumbers);

        generateButton.disabled = false; // Re-enable button
    }


    // H. Event Listeners
    betOptionButtons.forEach(button => {
        button.addEventListener('click', () => selectBet(parseInt(button.dataset.bet)));
    });

    soundToggleButton.addEventListener('click', toggleSound);
    generateButton.addEventListener('click', handleGenerateClick);

    // I. Initialization Function
    function initGame() {
        updateBalanceDisplay();
        updateHistoryDisplay();
        // Set default bet button state (aria-pressed)
        betOptionButtons.forEach(btn => {
            if (parseInt(btn.dataset.bet) === currentBet) {
                btn.setAttribute('aria-pressed', 'true');
            }
        });
        console.log("Lotto Casino Game Initialized!");
    }

    // J. Call initGame on DOMContentLoaded
    initGame();
});
