document.addEventListener('DOMContentLoaded', () => {
    const jsonInput = document.getElementById('json-input');
    const jsonOutput = document.getElementById('json-output'); // This is the <code> element
    const prettifyButton = document.getElementById('prettify-button');
    const copyButton = document.getElementById('copy-button');
    const errorMessageDiv = document.getElementById('error-message');

    prettifyButton.addEventListener('click', () => {
        const inputText = jsonInput.value.trim();
        errorMessageDiv.textContent = ''; // Clear previous errors
        jsonOutput.textContent = '';    // Clear previous output
        copyButton.style.display = 'none'; // Hide copy button initially

        if (inputText === '') {
            errorMessageDiv.textContent = 'Error: Input JSON string is empty.';
            return;
        }

        try {
            const parsedJson = JSON.parse(inputText);
            const prettyJson = JSON.stringify(parsedJson, null, 2); // 2 spaces for indentation
            jsonOutput.textContent = prettyJson;
            copyButton.style.display = 'inline-block'; // Show copy button
        } catch (error) {
            jsonOutput.textContent = ''; // Clear output on error
            errorMessageDiv.textContent = 'Error: Invalid JSON string. ' + error.message;
        }
    });

    copyButton.addEventListener('click', () => {
        const textToCopy = jsonOutput.textContent;
        if (navigator.clipboard && textToCopy) {
            navigator.clipboard.writeText(textToCopy)
                .then(() => {
                    // Optional: Visual feedback for copy
                    const originalButtonText = copyButton.textContent;
                    copyButton.textContent = 'Copied!';
                    setTimeout(() => {
                        copyButton.textContent = originalButtonText;
                    }, 1500);
                })
                .catch(err => {
                    console.error('Failed to copy text: ', err);
                    errorMessageDiv.textContent = 'Error: Could not copy text to clipboard.';
                });
        } else if (textToCopy) {
            // Fallback for older browsers or if navigator.clipboard is not available (less common now)
            // This fallback is very basic and might not work in all environments.
            try {
                const textArea = document.createElement('textarea');
                textArea.value = textToCopy;
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);

                const originalButtonText = copyButton.textContent;
                copyButton.textContent = 'Copied!';
                setTimeout(() => {
                    copyButton.textContent = originalButtonText;
                }, 1500);

            } catch (err) {
                 console.error('Fallback copy method failed: ', err);
                 errorMessageDiv.textContent = 'Error: Could not copy text using fallback method.';
            }
        }
    });
});
