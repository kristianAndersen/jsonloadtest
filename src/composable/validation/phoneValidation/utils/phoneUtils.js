/**
 * Common Phone Number Utilities
 * Shared functions used across all country validations
 */

import { countries, formatters } from '../countries/index.js'

/**
 * Clean phone number - remove all non-digit characters except +
 */
export const cleanNumber = (number) => {
  if (typeof number !== 'string') return ''
  return number.replace(/[^\d+]/g, '')
}

/**
 * Parse phone number and return structured object
 */
export const parsePhoneNumber = (number, countryCode) => {
  console.log('parsePhoneNumber', number, countryCode)

  const rawInput = number
  const cleaned = cleanNumber(number)
  
  if (!cleaned) {
    throw new Error('Invalid phone number format')
  }

  const config = countries[countryCode]
  if (!config) {
    throw new Error('Invalid country code')
  }

  let nationalNumber = ''

  // Handle international format (+XX...)
  if (cleaned.startsWith('+')) {
    const withoutPlus = cleaned.substring(1)
    if (withoutPlus.startsWith(config.code)) {
      nationalNumber = withoutPlus.substring(config.code.length)
    } else {
      throw new Error('Country code mismatch')
    }
  }
  // Handle national format
  else {
    nationalNumber = cleaned.startsWith('0') ? cleaned.substring(1) : cleaned
  }

  // Validate length
  const expectedLengths = Array.isArray(config.totalLength) ? config.totalLength : [config.totalLength]
  if (!expectedLengths.includes(nationalNumber.length)) {
    throw new Error(`Invalid number length for ${config.name}. Expected ${expectedLengths.join(' or ')} digits, got ${nationalNumber.length}`)
  }

  return createPhoneNumberObject(rawInput, countryCode, config, nationalNumber)
}

/**
 * Create phone number object with helper methods
 */
const createPhoneNumberObject = (rawInput, countryCode, config, nationalNumber) => {
  return {
    rawInput,
    country: countryCode,
    countryCode: config.code,
    nationalNumber,
    
    getCountryCode: () => parseInt(config.code),
    getNationalNumber: () => parseInt(nationalNumber),
    getRawInput: () => rawInput,
    
    isMobile: function() {
      const start2 = nationalNumber.substring(0, 2)
      return config.mobileStart.includes(start2)
    },
    
    isLandline: function() {
      if (!config.landlineStart) return false
      
      const start2 = nationalNumber.substring(0, 2)
      const start1 = nationalNumber.substring(0, 1)
      
      // Different countries use different landline prefix lengths
      if (countryCode === 'FI') {
        // Finland uses 1-digit area codes
        return config.landlineStart.includes(start1)
      } else {
        // Denmark, Sweden, Norway use 2-digit area codes
        return config.landlineStart.includes(start2)
      }
    },
    
    isValid: function() {
      return this.isMobile() || this.isLandline()
    },

    getAreaCode: function() {
      if (!this.isLandline() || !config.landlineAreaCodes) return null
      
      const prefix = countryCode === 'FI' 
        ? nationalNumber.substring(0, 1)
        : nationalNumber.substring(0, 2)
      
      return config.landlineAreaCodes[prefix] || null
    }
  }
}

/**
 * Validate if phone number object is valid
 */
export const isValidPhoneNumber = (phoneNumberObj) => {
  try {
    if (!phoneNumberObj || typeof phoneNumberObj !== 'object') {
      return false
    }

    const { country: objCountry, nationalNumber } = phoneNumberObj
    const config = countries[objCountry]
    
    if (!config || !nationalNumber) {
      return false
    }

    // Check length and digits
    const expectedLengths = Array.isArray(config.totalLength) ? config.totalLength : [config.totalLength]
    const lengthValid = expectedLengths.includes(nationalNumber.length)
    const digitsValid = /^\d+$/.test(nationalNumber)
    
    if (!lengthValid || !digitsValid) {
      return false
    }

    // Use the phoneNumberObj's built-in validation
    return phoneNumberObj.isValid()
    
  } catch (error) {
    console.log('isValidPhoneNumber error:', error)
    return false
  }
}

/**
 * Format phone number using country-specific formatter
 */
export const formatPhoneNumber = (phoneNumberObj, format = 'national') => {
  if (!isValidPhoneNumber(phoneNumberObj)) {
    return phoneNumberObj?.rawInput || 'Invalid number'
  }

  const { country, nationalNumber, countryCode } = phoneNumberObj
  const config = countries[country]
  const formatter = formatters[country]
  
  if (!formatter) {
    return nationalNumber // Fallback to unformatted
  }

  if (format === 'international') {
    const nationalFormatted = formatter(nationalNumber, config)
    return `+${countryCode} ${nationalFormatted}`
  }
  
  return formatter(nationalNumber, config)
}

/**
 * Quick validation function for any number
 */
export const validatePhoneNumber = (number, countryCode) => {
  try {
    const parsed = parsePhoneNumber(number, countryCode)
    return isValidPhoneNumber(parsed)
  } catch {
    return false
  }
}

/**
 * Get country configuration
 */
export const getCountryConfig = (countryCode) => {
  return countries[countryCode] || null
}

/**
 * Get all supported countries
 */
export const getSupportedCountries = () => {
  return Object.keys(countries).map(code => ({
    code,
    name: countries[code].name,
    countryCode: countries[code].code
  }))
}