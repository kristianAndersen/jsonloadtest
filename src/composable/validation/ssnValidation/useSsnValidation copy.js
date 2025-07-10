//ssnValidation.js


import { useDKssnValidation } from "./countries/useDKssnValidation"; // Import Danish SSN validation logic
const { validateDanishSSN } = useDKssnValidation();

export const useSsnValidation = () => {
    // National ID Number Validators for Nordic Countries and Germany



    /**
     * Finnish HETU (Henkilötunnus) Validator
     * Format: DDMMYY±XXXC (11 characters)
     * ± is century marker: + (1800s), - (1900s), A (2000s)
     */
    const validateFinnishHETU = (hetu) => {
        if (!/^(0[1-9]|[12]\d|3[01])(0[1-9]|1[0-2])([5-9]\d[+]|\d\d[-U-Y]|[0-2]\d[A-F])\d{3}[0-9A-Z]$/.test(hetu)) {
            return { valid: false, reason: 'Invalid format' };
        }

        const day = parseInt(hetu.substring(0, 2));
        const month = parseInt(hetu.substring(2, 4));

        const individual = hetu.substring(7, 10);
        const checkChar = hetu[10];

        // Basic date validation
        if (day < 1 || day > 31 || month < 1 || month > 12) {
            return { valid: false, reason: 'Invalid date' };
        }

        // Calculate check character
        const dateAndIndividual = hetu.substring(0, 6) + individual;
        const remainder = parseInt(dateAndIndividual) % 31;
        const checkChars = '0123456789ABCDEFHJKLMNPRSTUVWXY';

        const isValid = checkChars[remainder] === checkChar;
        return {
            valid: isValid,
            reason: isValid ? 'Valid Finnish HETU' : 'Invalid check character'
        };
    }

    /**
     * Swedish Personnummer Validator
     * Format: YYYYMMDD-XXXX or YYMMDD-XXXX (12 or 10 digits with hyphen)
     */
    const validateSwedishPersonnummer = (personnummer) => {
        // Remove spaces and normalize format
        let cleaned = personnummer.replace(/[\s]/g, '');

        // Handle both 10 and 12 digit formats
        if (cleaned.length === 11 && cleaned[8] === '-') {
            cleaned = cleaned.replace('-', '');
        } else if (cleaned.length === 13 && cleaned[8] === '-') {
            cleaned = cleaned.replace('-', '');
            cleaned = cleaned.substring(2); // Remove century digits for 10-digit format
        } else if (!/^\d{10}$/.test(cleaned)) {
            return { valid: false, reason: 'Invalid format' };
        }

        const day = parseInt(cleaned.substring(2, 4));
        const month = parseInt(cleaned.substring(4, 6));

        // Basic date validation
        if (day < 1 || day > 31 || month < 1 || month > 12) {
            return { valid: false, reason: 'Invalid date' };
        }

        // Luhn algorithm for checksum
        let sum = 0;
        for (let i = 0; i < 9; i++) {
            let digit = parseInt(cleaned[i]);
            if (i % 2 === 1) {
                digit *= 2;
                if (digit > 9) {
                    digit = Math.floor(digit / 10) + (digit % 10);
                }
            }
            sum += digit;
        }

        const checkDigit = (10 - (sum % 10)) % 10;
        const isValid = checkDigit === parseInt(cleaned[9]);
        return {
            valid: isValid,
            reason: isValid ? 'Valid Swedish Personnummer' : 'Invalid checksum'
        };
    }

    /**
     * Norwegian Fødselsnummer Validator
     * Format: DDMMYY XXXXX (11 digits, space optional)
     */
    const validateNorwegianFodselsnummer = (fnr) => {
        const cleaned = fnr.replace(/\s/g, '');

        if (!/^\d{11}$/.test(cleaned)) {
            return { valid: false, reason: 'Invalid format' };
        }

        const day = parseInt(cleaned.substring(0, 2));
        const month = parseInt(cleaned.substring(2, 4));


        // Basic date validation
        if (day < 1 || day > 31 || month < 1 || month > 12) {
            return { valid: false, reason: 'Invalid date' };
        }

        // First control digit (modulo 11)
        const weights1 = [3, 7, 6, 1, 8, 9, 4, 5, 2];
        let sum1 = 0;
        for (let i = 0; i < 9; i++) {
            sum1 += parseInt(cleaned[i]) * weights1[i];
        }
        const control1 = 11 - (sum1 % 11);
        const expectedControl1 = control1 === 11 ? 0 : control1;

        if (expectedControl1 !== parseInt(cleaned[9])) {
            return { valid: false, reason: 'Invalid first control digit' };
        }

        // Second control digit
        const weights2 = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
        let sum2 = 0;
        for (let i = 0; i < 10; i++) {
            sum2 += parseInt(cleaned[i]) * weights2[i];
        }
        const control2 = 11 - (sum2 % 11);
        const expectedControl2 = control2 === 11 ? 0 : control2;

        const isValid = expectedControl2 === parseInt(cleaned[10]);
        return {
            valid: isValid,
            reason: isValid ? 'Valid Norwegian Fødselsnummer' : 'Invalid second control digit'
        };
    }

    /**
     * German Tax ID (Steuerliche Identifikationsnummer) Validator
     * Format: 11 digits, specific pattern rules
     * Note: This validates the tax ID, not the old social security number
     */
    const validateGermanTaxId = (taxId) => {
        const cleaned = taxId.replace(/\s/g, '');

        if (!/^\d{11}$/.test(cleaned)) {
            return { valid: false, reason: 'Invalid format' };
        }

        // Check that it's not all the same digit
        if (new Set(cleaned).size === 1) {
            return { valid: false, reason: 'All digits cannot be the same' };
        }

        // Count digit frequencies (max 2 occurrences for any digit except one digit can appear 3 times)
        const digitCounts = {};
        for (let digit of cleaned) {
            digitCounts[digit] = (digitCounts[digit] || 0) + 1;
        }

        let threeCount = 0;
        for (let count of Object.values(digitCounts)) {
            if (count > 3) return { valid: false, reason: 'Too many repeated digits' };
            if (count === 3) threeCount++;
        }

        if (threeCount > 1) return { valid: false, reason: 'Too many digits appearing three times' };

        // Modulo 11 check (simplified version)
        let sum = 0;
        let factor = 2;

        for (let i = 9; i >= 0; i--) {
            sum += parseInt(cleaned[i]) * factor;
            factor = factor === 2 ? 1 : 2;
        }

        const remainder = sum % 11;
        const checkDigit = remainder < 2 ? remainder : 11 - remainder;

        const isValid = checkDigit === parseInt(cleaned[10]);
        return {
            valid: isValid,
            reason: isValid ? 'Valid German Tax ID' : 'Invalid check digit'
        };
    }

    // Utility function to validate any Nordic/German ID
    const validateNationalId = (id, country) => {
        console.log(`Validating ID: ${id} for country: ${country}`);

        switch (country) {
            case 'da-DK': {
                const result = validateDanishSSN(id);
                console.log('Danish SSN validation result:', result);

                // Always return the result object from validateDanishSSN
                return result;
            }

            case 'fi-FI':
                return validateFinnishHETU(id);

            case 'se-SE':
                return validateSwedishPersonnummer(id);

            case 'nn-NO':
                return validateNorwegianFodselsnummer(id);

            case 'de-DE':
                return validateGermanTaxId(id);

            default:
                return {
                    valid: false,
                    reason: 'Unsupported country. Use: da-DK, fi-FI, se-SE, nn-NO, or de-DE'
                };
        }
    }

    return {
        validateDanishSSN,
        validateFinnishHETU,
        validateSwedishPersonnummer,
        validateNorwegianFodselsnummer,
        validateGermanTaxId,
        validateNationalId
    }
}