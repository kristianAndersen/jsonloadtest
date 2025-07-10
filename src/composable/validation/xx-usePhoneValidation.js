export const usePhoneValidation = () => {
    
    const phonePatterns = {
        denmark: {
        withCountryCode: /^\+45[2-9][0-9]{7}$/,
        withoutCountryCode: /^[2-9][0-9]{7}$/,
        countryCode: '+45'
        },
  
        finland: {
            withCountryCode: /^\+358[1-9][0-9]{4,11}$/,
            withoutCountryCode: /^[1-9][0-9]{4,11}$/,
            countryCode: '+358'
        },
          
        sweden: {
            withCountryCode: /^\+46[0-9]{7,13}$/,
            withoutCountryCode: /^[0-9]{7,13}$/,
            countryCode: '+46'
        },
            faroe: {
            withCountryCode: /^\+298[0-9]{6}$/,
            withoutCountryCode: /^[0-9]{6}$/,
            countryCode: '+298'
        },
        germany: {
            withCountryCode: /^\+49[1-9][0-9]{1,14}$/,
            withoutCountryCode: /^[1-9][0-9]{1,14}$/,
            countryCode: '+49'
        },
    };

const validatePhone = (phoneNumber) => {
    
    if (!phoneNumber || typeof phoneNumber !== 'string') return false;
    
    const cleaned = phoneNumber.trim().replace(/[-.\s()]/g, '');
    
    // Check against all patterns (with and without country codes)
    const isValid = Object.values(phonePatterns).some(country => 
        country.withCountryCode.test(cleaned) || 
        country.withoutCountryCode.test(cleaned)
    );
  
    //is number valid return it
    return {
        valid: isValid,
        value: isValid ? cleaned : null
    };
};









    return {
        validatePhone,
        phonePatterns
    };
};