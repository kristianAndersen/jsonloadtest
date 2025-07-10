/**
 * Finnish HETU (Henkilötunnus) Validator
 * Format: DDMMYY±XXXC (11 characters)
 * ± is century marker: + (1800s), - (1900s), A (2000s)
 */
export const useFIssnValidation = () => {

    const validateFinishSSN = (ssn) => {
        if (!/^(0[1-9]|[12]\d|3[01])(0[1-9]|1[0-2])([5-9]\d[+]|\d\d[-U-Y]|[0-2]\d[A-F])\d{3}[0-9A-Z]$/.test(ssn)) {
            return { valid: false, reason: 'Invalid format' };
        }

        const day = parseInt(ssn.substring(0, 2));
        const month = parseInt(ssn.substring(2, 4));
        const _year = parseInt(ssn.substring(4, 6));
        const _century = ssn[6];
        const individual = ssn.substring(7, 10);
        const checkChar = ssn[10];

        // Basic date validation
        if (day < 1 || day > 31 || month < 1 || month > 12) {
            return { valid: false, reason: 'Invalid date' };
        }

        // Calculate check character
        const dateAndIndividual = ssn.substring(0, 6) + individual;
        const remainder = parseInt(dateAndIndividual) % 31;
        const checkChars = '0123456789ABCDEFHJKLMNPRSTUVWXY';

        const isValid = checkChars[remainder] === checkChar;
        return {
            valid: isValid,
            reason: isValid ? 'Valid Finnish HETU' : 'Invalid check character'
        };
    }

    return {
        validateFinishSSN
    }
}