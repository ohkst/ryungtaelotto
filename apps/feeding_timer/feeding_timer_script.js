document.addEventListener('DOMContentLoaded', () => {
    const timerDisplay = document.getElementById('timer-display');
    const controlButton = document.getElementById('control-button');
    const resetButton = document.getElementById('reset-button');

    let elapsedSeconds = 0;
    let timerIntervalId = null;
    let referenceTime = 0; // Used to calculate elapsed time accurately, accounting for pauses

    function formatTime(totalSeconds) {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return [hours, minutes, seconds]
            .map(val => val < 10 ? "0" + val : val)
            .join(":");
    }

    function updateDisplay() {
        timerDisplay.textContent = formatTime(elapsedSeconds);
    }

    controlButton.addEventListener('click', () => {
        if (timerIntervalId === null) { // Timer is stopped or paused, should start/resume
            referenceTime = Date.now() - (elapsedSeconds * 1000); // Subtract already elapsed time
            
            timerIntervalId = setInterval(() => {
                elapsedSeconds = Math.floor((Date.now() - referenceTime) / 1000);
                updateDisplay();
            }, 1000); // Update every second

            controlButton.textContent = 'Pause';
        } else { // Timer is running, should pause
            clearInterval(timerIntervalId);
            timerIntervalId = null;
            // elapsedSeconds already holds the correct value up to this point
            controlButton.textContent = 'Resume';
        }
    });

    resetButton.addEventListener('click', () => {
        clearInterval(timerIntervalId);
        timerIntervalId = null;
        elapsedSeconds = 0;
        referenceTime = 0; // Reset reference time as well
        updateDisplay();
        controlButton.textContent = 'Start'; // Reset control button text
    });

    // Initial display
    updateDisplay();
});
