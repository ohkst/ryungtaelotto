document.addEventListener('DOMContentLoaded', () => {
    const buttonA = document.getElementById('button-a');
    const buttonB = document.getElementById('button-b');
    const gameResultDisplay = document.getElementById('game-result');

    if (buttonA) {
        buttonA.addEventListener('click', () => {
            gameResultDisplay.textContent = '축하합니다! 1억에 당첨되셨습니다! 🎉';
            // Optional: Add a class for styling win results
            gameResultDisplay.className = 'result-display win';
        });
    }

    if (buttonB) {
        buttonB.addEventListener('click', () => {
            const rand = Math.random() * 100; // Random number between 0 (inclusive) and 100 (exclusive)

            if (rand < 1) { // 1% chance for "꽝" (0 to 0.99...)
                gameResultDisplay.textContent = '아쉽지만... 꽝입니다! 꽝! 꽝! 😭';
                gameResultDisplay.className = 'result-display lose';
            } else if (rand < 11) { // 10% chance for 5억 (1 to 10.99...)
                                    // This covers the next 10 percentage points (1% already taken by "꽝")
                gameResultDisplay.textContent = '대박! 5억에 당첨되셨습니다!! 💰💰💰';
                gameResultDisplay.className = 'result-display jackpot-win';
            } else { // Remaining 89% chance for 1억 (11 to 99.99...)
                gameResultDisplay.textContent = '축하합니다! 1억에 당첨되셨습니다! 💸';
                gameResultDisplay.className = 'result-display win';
            }
        });
    }
});
