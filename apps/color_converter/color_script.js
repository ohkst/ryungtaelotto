document.addEventListener('DOMContentLoaded', () => {
    const colorPicker = document.getElementById('html-color-picker');
    const colorPreview = document.getElementById('color-preview');
    const previewText = document.getElementById('preview-text');
    
    const hexInput = document.getElementById('hex-input');
    const rgbInput = document.getElementById('rgb-input');
    const hslInput = document.getElementById('hsl-input');
    
    const copyButtons = document.querySelectorAll('.copy-button');
    const errorMessageDiv = document.getElementById('error-message-color');

    let currentRgb = { r: 255, g: 0, b: 0 }; // Default to red, matching picker

    // --- Color Conversion Functions ---
    function hexToRgb(hex) {
        hex = hex.replace(/^#/, '');
        if (hex.length === 3) {
            hex = hex.split('').map(char => char + char).join('');
        }
        if (hex.length !== 6) return null; // Invalid format

        const bigint = parseInt(hex, 16);
        if (isNaN(bigint)) return null;

        return {
            r: (bigint >> 16) & 255,
            g: (bigint >> 8) & 255,
            b: bigint & 255
        };
    }

    function rgbToHex(r, g, b) {
        if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
    }

    function rgbToHsl(r, g, b) {
        if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0; // achromatic
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
    }

    function hslToRgb(h, s, l) {
        if (isNaN(h) || isNaN(s) || isNaN(l)) return null;
        s /= 100; l /= 100;
        let r, g, b;

        if (s === 0) {
            r = g = b = l; // achromatic
        } else {
            const hueToRgbHelper = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            h /= 360;
            r = hueToRgbHelper(p, q, h + 1/3);
            g = hueToRgbHelper(p, q, h);
            b = hueToRgbHelper(p, q, h - 1/3);
        }
        return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
    }

    // --- UI Update Function ---
    function updateUI(sourceField = null) {
        errorMessageDiv.textContent = '';
        [hexInput, rgbInput, hslInput].forEach(input => input.classList.remove('invalid'));

        const hex = rgbToHex(currentRgb.r, currentRgb.g, currentRgb.b);
        const hsl = rgbToHsl(currentRgb.r, currentRgb.g, currentRgb.b);

        if (sourceField !== hexInput) hexInput.value = hex || '';
        if (sourceField !== rgbInput) rgbInput.value = `rgb(${currentRgb.r}, ${currentRgb.g}, ${currentRgb.b})`;
        if (sourceField !== hslInput && hsl) hslInput.value = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
        if (sourceField !== colorPicker && hex) colorPicker.value = hex;
        
        colorPreview.style.backgroundColor = hex || '#FFFFFF';

        // Update preview text color for contrast
        const brightness = (currentRgb.r * 299 + currentRgb.g * 587 + currentRgb.b * 114) / 1000;
        previewText.style.color = brightness > 128 ? 'black' : 'white';
        previewText.textContent = hex || 'Invalid Color';
    }
    
    // --- Event Listeners ---
    colorPicker.addEventListener('input', (e) => {
        const newRgb = hexToRgb(e.target.value);
        if (newRgb) {
            currentRgb = newRgb;
            updateUI(colorPicker);
        }
    });

    hexInput.addEventListener('input', (e) => {
        const hexVal = e.target.value.trim();
        if (!/^#?([0-9A-Fa-f]{3}){1,2}$/.test(hexVal) && hexVal !== '') {
             e.target.classList.add('invalid');
             errorMessageDiv.textContent = 'Invalid HEX format (e.g., #RRGGBB or #RGB).';
             return;
        }
        const newRgb = hexToRgb(hexVal);
        if (newRgb) {
            currentRgb = newRgb;
            updateUI(hexInput);
        } else if (hexVal === '') {
            errorMessageDiv.textContent = '';
            e.target.classList.remove('invalid');
        }
    });

    rgbInput.addEventListener('input', (e) => {
        const rgbStr = e.target.value.trim();
        const match = rgbStr.match(/^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/i);
        if (!match && rgbStr !== '') {
            e.target.classList.add('invalid');
            errorMessageDiv.textContent = 'Invalid RGB format (e.g., rgb(255, 87, 51)).';
            return;
        }
        if (match) {
            const r = parseInt(match[1]), g = parseInt(match[2]), b = parseInt(match[3]);
            if (r > 255 || g > 255 || b > 255) {
                 e.target.classList.add('invalid');
                 errorMessageDiv.textContent = 'RGB values must be 0-255.';
                 return;
            }
            currentRgb = { r, g, b };
            updateUI(rgbInput);
        } else if (rgbStr === '') {
             errorMessageDiv.textContent = '';
             e.target.classList.remove('invalid');
        }
    });

    hslInput.addEventListener('input', (e) => {
        const hslStr = e.target.value.trim();
        const match = hslStr.match(/^hsl\((\d{1,3}),\s*(\d{1,3})%?,\s*(\d{1,3})%?\)$/i);
         if (!match && hslStr !== '') {
            e.target.classList.add('invalid');
            errorMessageDiv.textContent = 'Invalid HSL format (e.g., hsl(10, 100%, 60%)).';
            return;
        }
        if (match) {
            const h = parseInt(match[1]), s = parseInt(match[2]), l = parseInt(match[3]);
             if (h > 360 || s > 100 || l > 100) {
                 e.target.classList.add('invalid');
                 errorMessageDiv.textContent = 'HSL values out of range (H:0-360, S/L:0-100).';
                 return;
             }
            const newRgb = hslToRgb(h, s, l);
            if (newRgb) {
                currentRgb = newRgb;
                updateUI(hslInput);
            }
        } else if (hslStr === '') {
            errorMessageDiv.textContent = '';
            e.target.classList.remove('invalid');
        }
    });
    
    copyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const format = button.dataset.format;
            let textToCopy = '';
            if (format === 'hex') textToCopy = hexInput.value;
            else if (format === 'rgb') textToCopy = rgbInput.value;
            else if (format === 'hsl') textToCopy = hslInput.value;

            if (navigator.clipboard && textToCopy) {
                navigator.clipboard.writeText(textToCopy)
                    .then(() => {
                        const originalText = button.textContent;
                        button.textContent = 'Copied!';
                        setTimeout(() => button.textContent = originalText, 1500);
                    })
                    .catch(err => console.error('Failed to copy:', err));
            }
        });
    });

    // Initial UI update based on default color picker value
    const initialRgb = hexToRgb(colorPicker.value);
    if (initialRgb) {
        currentRgb = initialRgb;
    }
    updateUI(); 
});
