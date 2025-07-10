//dkssnValidation.js
export const useDKssnValidation = () => {
  /**
   * Danish CPR (Central Person Register) Number Validator
   * Format: DDMMYY-XXXX (10 digits, hyphen optional)
   * First 6 digits: birth date, last 4: sequence number + check digit
   */
  console.log('Denmark useDKssnValidation initialized');
  const validateDanishSSN = (cpr) => {

    console.log('validateDanishSSN called with:', cpr);
    // Remove dash/space
    const cleaned = cpr.replace(/[-\s]/g, '');

    if (!/^\d{10}$/.test(cleaned)) {
      return {
        valid: false, // Mod11 only required for old CPRs
        value: cleaned
      };
    }

    const day = parseInt(cleaned.substring(0, 2), 10);
    const month = parseInt(cleaned.substring(2, 4), 10);
    const year = parseInt(cleaned.substring(4, 6), 10);
    const seq = cleaned.substring(6);
    const seqFirst = parseInt(seq.charAt(0), 10);

    // Determine full year
    let fullYear;
    if (seqFirst <= 3) {
      fullYear = 1900 + year;
    } else if (seqFirst === 4 || seqFirst === 9) {
      fullYear = year < 37 ? 2000 + year : 1900 + year;
    } else if ([5, 6, 7, 8].includes(seqFirst)) {
      fullYear = year < 58 ? 2000 + year : 1800 + year;
    } else {
      fullYear = 1900 + year;
    }

    // Validate date
    const date = new Date(fullYear, month - 1, day);
    if (
      date.getFullYear() !== fullYear ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      return { valid: false, reason: 'Invalid date' };
    }

    // Optional modulus 11 check (mainly applies to pre-2007 CPR numbers)
    const weights = [4, 3, 2, 7, 6, 5, 4, 3, 2, 1];
    const sum = cleaned.split('').reduce((acc, digit, i) => acc + parseInt(digit, 10) * weights[i], 0);
    const passesMod11 = sum % 11 === 0;

    // Gender (even = female, odd = male)
    //const gender = parseInt(seq.charAt(3), 10) % 2 === 0 ? 'female' : 'male';
    /*
      return {
        valid: passesMod11 || fullYear >= 2007, // Mod11 only required for old CPRs
        reason: passesMod11 ? 'Passed modulus-11' : fullYear >= 2007 ? 'Modulus-11 not enforced' : 'Failed modulus-11',
        birthDate: `${fullYear}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        gender,
      };*/
    return {
      valid: passesMod11 || fullYear >= 2007,
      value: passesMod11 || fullYear >= 2007 ? cleaned : null
    };

  }
  return {
    validateDanishSSN
  }
}