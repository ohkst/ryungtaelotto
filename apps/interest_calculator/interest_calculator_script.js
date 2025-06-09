document.addEventListener('DOMContentLoaded', () => {
    // --- Common Helper ---
    function formatCurrency(amount, decimals = 2) {
        // Simple formatting, can be expanded for commas if needed
        const num = parseFloat(amount);
        if (isNaN(num)) return 'Invalid Amount';
        return num.toFixed(decimals) + ' 원'; // Append Won symbol
    }

    function displayError(element, message) {
        element.textContent = `오류: ${message}`;
        element.style.color = 'red'; // Or use a CSS class for errors
    }

    function clearError(element) {
        element.textContent = '';
        element.style.color = ''; // Reset to default from CSS
    }

    // --- Section 1: Simple Monthly Interest ---
    const smPrincipalInput = document.getElementById('sm-principal');
    const smAnnualRateInput = document.getElementById('sm-annual-rate');
    const calcSmButton = document.getElementById('calc-sm-button');
    const smResultP = document.getElementById('sm-monthly-interest-result');

    if (calcSmButton) {
        calcSmButton.addEventListener('click', () => {
            clearError(smResultP);
            const principal = parseFloat(smPrincipalInput.value);
            const annualRate = parseFloat(smAnnualRateInput.value);

            if (isNaN(principal) || principal <= 0) {
                displayError(smResultP, '유효한 원금을 입력하세요.'); return;
            }
            if (isNaN(annualRate) || annualRate < 0) {
                displayError(smResultP, '유효한 연 이율을 입력하세요.'); return;
            }

            const monthlyRate = (annualRate / 100) / 12;
            const monthlyInterest = principal * monthlyRate;
            smResultP.textContent = `월 예상 이자: ${formatCurrency(monthlyInterest)}`;
        });
    }

    // --- Section 2: Simple Interest over Period ---
    const siPrincipalInput = document.getElementById('si-principal');
    const siAnnualRateInput = document.getElementById('si-annual-rate');
    const siTimePeriodInput = document.getElementById('si-time-period');
    const siTimeUnitSelect = document.getElementById('si-time-unit');
    const calcSiButton = document.getElementById('calc-si-button');
    const siTotalInterestResultP = document.getElementById('si-total-interest-result');
    const siTotalAmountResultP = document.getElementById('si-total-amount-result');

    if (calcSiButton) {
        calcSiButton.addEventListener('click', () => {
            clearError(siTotalInterestResultP);
            clearError(siTotalAmountResultP);
            const principal = parseFloat(siPrincipalInput.value);
            const annualRate = parseFloat(siAnnualRateInput.value);
            const timePeriod = parseFloat(siTimePeriodInput.value);
            const timeUnit = siTimeUnitSelect.value;

            if (isNaN(principal) || principal <= 0) {
                displayError(siTotalInterestResultP, '유효한 원금을 입력하세요.'); return;
            }
            if (isNaN(annualRate) || annualRate < 0) {
                displayError(siTotalInterestResultP, '유효한 연 이율을 입력하세요.'); return;
            }
            if (isNaN(timePeriod) || timePeriod <= 0) {
                displayError(siTotalInterestResultP, '유효한 기간을 입력하세요.'); return;
            }

            const timeInYears = (timeUnit === 'months') ? timePeriod / 12 : timePeriod;
            const rateDecimal = annualRate / 100;

            const totalInterest = principal * rateDecimal * timeInYears;
            const totalAmount = principal + totalInterest;

            siTotalInterestResultP.textContent = `총 단리 이자: ${formatCurrency(totalInterest)}`;
            siTotalAmountResultP.textContent = `최종 예상 금액 (원금 + 이자): ${formatCurrency(totalAmount)}`;
        });
    }

    // --- Section 3: Compound Interest ---
    const ciPrincipalInput = document.getElementById('ci-principal');
    const ciAnnualRateInput = document.getElementById('ci-annual-rate');
    const ciTimeYearsInput = document.getElementById('ci-time-years');
    const ciCompoundFrequencySelect = document.getElementById('ci-compound-frequency');
    const calcCiButton = document.getElementById('calc-ci-button');
    const ciTotalAmountResultP = document.getElementById('ci-total-amount-result');
    const ciTotalInterestResultP = document.getElementById('ci-total-interest-result');

    if (calcCiButton) {
        calcCiButton.addEventListener('click', () => {
            clearError(ciTotalAmountResultP);
            clearError(ciTotalInterestResultP);
            const principal = parseFloat(ciPrincipalInput.value);
            const annualRate = parseFloat(ciAnnualRateInput.value);
            const timeYears = parseFloat(ciTimeYearsInput.value);
            const compoundFrequency = parseFloat(ciCompoundFrequencySelect.value);

            if (isNaN(principal) || principal <= 0) {
                displayError(ciTotalAmountResultP, '유효한 원금을 입력하세요.'); return;
            }
            if (isNaN(annualRate) || annualRate < 0) {
                displayError(ciTotalAmountResultP, '유효한 연 이율을 입력하세요.'); return;
            }
            if (isNaN(timeYears) || timeYears <= 0) {
                displayError(ciTotalAmountResultP, '유효한 거치 기간(년)을 입력하세요.'); return;
            }
            if (isNaN(compoundFrequency) || compoundFrequency <= 0) {
                displayError(ciTotalAmountResultP, '유효한 복리 계산 주기를 선택하세요.'); return;
            }

            const ratePerPeriod = (annualRate / 100) / compoundFrequency;
            const numberOfPeriods = compoundFrequency * timeYears;

            const totalAmount = principal * Math.pow((1 + ratePerPeriod), numberOfPeriods);
            const totalInterest = totalAmount - principal;

            ciTotalAmountResultP.textContent = `최종 예상 금액 (원금 + 이자): ${formatCurrency(totalAmount)}`;
            ciTotalInterestResultP.textContent = `총 복리 이자: ${formatCurrency(totalInterest)}`;
        });
    }
});
