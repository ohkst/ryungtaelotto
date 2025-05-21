document.addEventListener('DOMContentLoaded', () => {
    // --- Common Helper ---
    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // --- Section 1: Add/Subtract Days from Date ---
    const refDateInput = document.getElementById('ref-date');
    const daysOffsetInput = document.getElementById('days-offset');
    const offsetDirectionSelect = document.getElementById('offset-direction');
    const calcOffsetButton = document.getElementById('calc-offset-button');
    const offsetResultDateP = document.getElementById('offset-result-date');

    if (calcOffsetButton) { // Check if element exists before adding listener
        calcOffsetButton.addEventListener('click', () => {
            const refDateStr = refDateInput.value;
            const daysOffset = parseInt(daysOffsetInput.value);
            const direction = offsetDirectionSelect.value;

            if (!refDateStr) {
                offsetResultDateP.textContent = '오류: 기준 날짜를 선택해주세요.';
                return;
            }
            if (isNaN(daysOffset) || daysOffset < 0) {
                offsetResultDateP.textContent = '오류: 유효한 일 수를 입력해주세요 (0 이상).';
                return;
            }

            const refDate = new Date(refDateStr + 'T00:00:00'); // Ensure local midnight
            if (isNaN(refDate.getTime())) {
                 offsetResultDateP.textContent = '오류: 기준 날짜가 유효하지 않습니다.';
                 return;
            }
            
            const offset = direction === 'after' ? daysOffset : -daysOffset;
            refDate.setDate(refDate.getDate() + offset);
            
            offsetResultDateP.textContent = `결과: ${formatDate(refDate)}`;
        });
    }

    // --- Section 2: Difference Between Dates ---
    const startDateInput = document.getElementById('start-date');
    const endDateInput = document.getElementById('end-date');
    const calcDiffButton = document.getElementById('calc-diff-button');
    const diffResultDaysP = document.getElementById('diff-result-days');

    if (calcDiffButton) {
        calcDiffButton.addEventListener('click', () => {
            const startDateStr = startDateInput.value;
            const endDateStr = endDateInput.value;

            if (!startDateStr || !endDateStr) {
                diffResultDaysP.textContent = '오류: 시작 날짜와 종료 날짜를 모두 선택해주세요.';
                return;
            }
            
            // Use UTC to ensure consistent day difference calculation regardless of local timezone/DST
            const startDate = new Date(Date.UTC(...startDateStr.split('-').map((s, i) => i === 1 ? parseInt(s) - 1 : parseInt(s))));
            const endDate = new Date(Date.UTC(...endDateStr.split('-').map((s, i) => i === 1 ? parseInt(s) - 1 : parseInt(s))));

            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                 diffResultDaysP.textContent = '오류: 날짜 형식이 유효하지 않습니다.';
                 return;
            }

            const diffTime = endDate.getTime() - startDate.getTime(); // Difference in milliseconds
            const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays >= 0) {
                diffResultDaysP.textContent = `차이: ${diffDays} 일`;
            } else {
                diffResultDaysP.textContent = `차이: ${Math.abs(diffDays)} 일 (시작 날짜가 종료 날짜보다 늦음)`;
            }
        });
    }

    // --- Section 3: Korean Age (Man-nai) Calculator ---
    const birthDateInput = document.getElementById('birth-date');
    const ageCalcDateInput = document.getElementById('age-calc-date');
    const calcAgeButton = document.getElementById('calc-age-button');
    const ageResultP = document.getElementById('age-result');

    // Set default for age-calc-date to today
    if (ageCalcDateInput && !ageCalcDateInput.value) {
        ageCalcDateInput.value = formatDate(new Date());
    }
    
    if (calcAgeButton) {
        calcAgeButton.addEventListener('click', () => {
            const birthDateStr = birthDateInput.value;
            let calcDateStr = ageCalcDateInput.value;

            if (!birthDateStr) {
                ageResultP.textContent = '오류: 생년월일을 선택해주세요.';
                return;
            }
            if (!calcDateStr) { // If user clears it, default to today
                calcDateStr = formatDate(new Date());
                ageCalcDateInput.value = calcDateStr; 
            }

            const birthDate = new Date(birthDateStr + 'T00:00:00');
            const calcDate = new Date(calcDateStr + 'T00:00:00');
            
            if (isNaN(birthDate.getTime()) || isNaN(calcDate.getTime())) {
                 ageResultP.textContent = '오류: 날짜 형식이 유효하지 않습니다.';
                 return;
            }
            if (birthDate > calcDate) {
                ageResultP.textContent = '오류: 생년월일은 계산 기준일보다 빠를 수 없습니다.';
                return;
            }

            let age = calcDate.getFullYear() - birthDate.getFullYear();
            const monthDiff = calcDate.getMonth() - birthDate.getMonth();
            const dayDiff = calcDate.getDate() - birthDate.getDate();

            if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
                age--;
            }
            ageResultP.textContent = `만 나이: ${age} 세`;
        });
    }
});
