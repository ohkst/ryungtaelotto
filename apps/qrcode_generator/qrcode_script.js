document.addEventListener('DOMContentLoaded', () => {
    const urlInput = document.getElementById('qr-url-input');
    const generateButton = document.getElementById('generate-qr-button');
    const qrcodeDisplayWrapper = document.getElementById('qrcode-display-wrapper');
    const qrcodeDisplay = document.getElementById('qrcode-display');
    const qrcodePlaceholderText = document.getElementById('qrcode-placeholder-text');
    const downloadButton = document.getElementById('download-qr-button');
    let qrCodeInstance = null; // To hold reference to library instance if used

    generateButton.addEventListener('click', () => {
        const data = urlInput.value.trim();
        if (data === '') {
            alert('Please enter a URL or text to generate a QR code.');
            urlInput.focus();
            return;
        }

        // Clear previous QR code and hide placeholder/download button
        qrcodeDisplay.innerHTML = '';
        qrcodePlaceholderText.style.display = 'block';
        downloadButton.style.display = 'none';
        downloadButton.onclick = null; // Clear previous download handler

        // --- QR Code Generation ---
        // Worker will attempt one of these methods.

        // Method 1: Try to use a library like qrcode.js (if worker can load it, e.g. from CDN)
        // The HTML has a commented-out suggestion for CDN:
        // <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
        // If the worker includes this library in the HTML, the following code could be used:
        if (typeof QRCode !== 'undefined') {
            try {
                qrcodePlaceholderText.style.display = 'none';
                // qrcode.js typically appends a canvas or img to the specified DOM element
                qrCodeInstance = new QRCode(qrcodeDisplay, {
                    text: data,
                    width: 200, // desired width
                    height: 200, // desired height
                    colorDark : "#000000",
                    colorLight : "#ffffff",
                    correctLevel : QRCode.CorrectLevel.H
                });
                
                // Make download button visible and functional for canvas
                if (qrcodeDisplay.querySelector('canvas')) {
                    downloadButton.style.display = 'block';
                    downloadButton.textContent = 'QR 코드 다운로드'; // Reset text
                    downloadButton.onclick = () => {
                        const canvas = qrcodeDisplay.querySelector('canvas');
                        const imageURL = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
                        const link = document.createElement('a');
                        link.href = imageURL;
                        link.download = 'qrcode.png';
                        link.click();
                    };
                } else if (qrcodeDisplay.querySelector('img')) {
                     // If qrcode.js generates an img directly (less common for this lib)
                    downloadButton.style.display = 'block';
                    downloadButton.textContent = 'QR 이미지 우클릭 저장'; // Right-click to save
                }

            } catch (error) {
                console.error("Error using QRCode.js library:", error);
                displayError("QR 코드 생성 중 오류 발생 (라이브러리 사용 실패).");
                // Fallback to API method if library fails
                generateWithApi(data);
            }
        } else {
            // Method 2: Fallback to using a public API if library not available/failed
            generateWithApi(data);
        }
    });

    function generateWithApi(data) {
        qrcodePlaceholderText.style.display = 'none';
        const apiUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(data)}&size=200x200&format=png&qzone=1`;
        const img = document.createElement('img');
        img.src = apiUrl;
        img.alt = 'Generated QR Code';
        img.onload = () => {
            qrcodeDisplay.appendChild(img);
            downloadButton.style.display = 'block';
            // For API-generated images, direct JS download is tricky due to CORS.
            // Instruct user to right-click, or the button could open the image in a new tab.
            downloadButton.textContent = 'QR 이미지 우클릭 저장'; 
            downloadButton.onclick = () => {
                // Simplest action: open in new tab for easy save.
                window.open(img.src, '_blank'); 
            };
        };
        img.onerror = () => {
            displayError('QR 코드 이미지 로딩 실패 (API 오류 또는 네트워크 문제).');
        };
    }

    function displayError(message) {
        qrcodeDisplay.innerHTML = `<p style="color:red;">${message}</p>`;
        qrcodePlaceholderText.style.display = 'none';
        downloadButton.style.display = 'none';
    }
});
