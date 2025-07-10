/**
 * Swedish Personnummer Validator
 * Format: YYYYMMDD-XXXX or YYMMDD-XXXX (12 or 10 digits with hyphen)
 */

export const useSEssnValidation = () => {

console.log('Sweden useSEssnValidation initialized');

const validateSwedishssn = (ssn) => {
    
    console.log('validateSwedishssn called with:', ssn);
    // Remove spaces and normalize format
    let cleaned = ssn.replace(/[\s]/g, '');
    
    // Handle both 10 and 12 digit formats
    if (cleaned.length === 11 && cleaned[6] === '-') {
        cleaned = cleaned.replace('-', '');
    } else if (cleaned.length === 13 && cleaned[8] === '-') {
        cleaned = cleaned.replace('-', '');
        cleaned = cleaned.substring(2); // Remove century digits for 10-digit format
    } else if (!/^\d{10}$/.test(cleaned)) {
        return { valid: false, reason: 'Invalid format' };
    }
    
    // Fixed: Correct month and day extraction
    const month = parseInt(cleaned.substring(2, 4));
    const day = parseInt(cleaned.substring(4, 6));
    
    // Basic date validation
    if (day < 1 || day > 31 || month < 1 || month > 12) {
        return { valid: false, reason: 'Invalid date' };
    }
    
    // Swedish personnummer checksum algorithm (modified Luhn)
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        let digit = parseInt(cleaned[i]);
        // Double every other digit starting from position 0 (positions 0, 2, 4, 6, 8)
        if (i % 2 === 0) {
            digit *= 2;
            if (digit > 9) {
                digit = Math.floor(digit / 10) + (digit % 10);
            }
        }
        sum += digit;
    }
    
    // Swedish personnummer: multiply sum by 9 and take last digit
    const checkDigit = (sum * 9) % 10;
    const isValid = checkDigit === parseInt(cleaned[9]);

    console.log(`Validating Swedish SSN in useSEvalidation: "${ssn}" - Valid: ${isValid}`);
    return { 
        valid: isValid, 
        value: isValid ? cleaned : null
    };
}

return {
    validateSwedishssn
  }

}

if (import.meta.hot) {
    import.meta.hot.accept()
}