document.addEventListener('DOMContentLoaded', () => {
    // A. Initial Setup and State Variables
    const balanceAmountEl = document.getElementById('balance-amount');
    const betOptionButtons = document.querySelectorAll('.bet-option');
    const lastWinAmountEl = document.getElementById('last-win-amount');
    const soundToggleButton = document.getElementById('sound-toggle-button');
    const lottoSlotElements = document.querySelectorAll('.lotto-numbers-wrapper .lotto-slot');
    const historyListEl = document.getElementById('history-list');
    const jackpotMessageAreaEl = document.getElementById('jackpot-message-area');
    const generateButton = document.getElementById('generate-button');

    let balance = 1000;
    let currentBet = 10; // Default bet
    let soundEnabled = true;
    let history = [];
    const lottoNumbersPerSet = 6;
    const maxLottoNumber = 45;
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

        const generatedNumbers = [];
        const numberSet = new Set();
        while (numberSet.size < lottoNumbersPerSet) {
            const randomNumber = Math.floor(Math.random() * maxLottoNumber) + 1;
            numberSet.add(randomNumber);
        }
        generatedNumbers.push(...Array.from(numberSet).sort((a,b) => a - b));

        const animationPromises = [];
        for (let i = 0; i < lottoNumbersPerSet; i++) {
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
