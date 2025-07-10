/**
 * Nordic Phone Number Validator - Vue 3 Composable
 * Refactored for better maintainability and extensibility
 */

import { ref, computed } from 'vue'
import {
  parsePhoneNumber,
  isValidPhoneNumber,
  formatPhoneNumber,
  validatePhoneNumber,
  getCountryConfig,
  getSupportedCountries
} from './utils/phoneUtils.js'

export function useNordicPhoneValidation(currenCountry) {
  const tel = ref('')
  const country = ref(currenCountry.toUpperCase())

  /**
   * Main validation - computed property that auto-updates
   */
  const validation = computed(() => {
    if (!tel.value) {
      return {
        isValid: false,
        error: null,
        formatted: '',
        formattedInternational: '',
        isMobile: false,
        isLandline: false,
        nationalNumber: '',
        countryCode: '',
        areaCode: null
      }
    }

    try {
      console.log(`Validating: "${tel.value}" for country: ${country.value}`)
      const parsed = parsePhoneNumber(tel.value, country.value)
      console.log('Parsed national number:', parsed.nationalNumber)
      
      const valid = isValidPhoneNumber(parsed)
      console.log('Is valid:', valid)
      
      return {
        isValid: valid,
        error: null,
        formatted: valid ? formatPhoneNumber(parsed, 'national') : '',
        formattedInternational: valid ? formatPhoneNumber(parsed, 'international') : '',
        isMobile: valid ? parsed.isMobile() : false,
        isLandline: valid ? parsed.isLandline() : false,
        nationalNumber: valid ? parsed.nationalNumber : '',
        countryCode: valid ? parsed.countryCode : '',
        areaCode: valid ? parsed.getAreaCode() : null
      }
    } catch (error) {
      console.log('Validation error:', error.message)
      return {
        isValid: false,
        error: error.message,
        formatted: '',
        formattedInternational: '',
        isMobile: false,
        isLandline: false,
        nationalNumber: '',
        countryCode: '',
        areaCode: null
      }
    }
  })

  /**
   * Simple validation function for any number
   */
  const validate = (number, countryCode = country.value) => {
    return validatePhoneNumber(number, countryCode)
  }

  /**
   * Format a number 
   */
  const format = (number, countryCode = country.value, formatType = 'national') => {
    try {
      const parsed = parsePhoneNumber(number, countryCode)
      if (isValidPhoneNumber(parsed)) {
        return formatPhoneNumber(parsed, formatType)
      }
      return number
    } catch {
      return number
    }
  }

  /**
   * Get information about a country
   */
  const getCountryInfo = (countryCode = country.value) => {
    return getCountryConfig(countryCode)
  }

  /**
   * Get all supported countries
   */
  const getSupportedCountriesList = () => {
    return getSupportedCountries()
  }

  /**
   * Filter input to only allow numbers and + at the beginning
   */
  const filterInput = (value) => {
    console.log('Filtering input:', value)
    if (!value) return ''
    
    // Allow + only at the beginning
    let filtered = value.replace(/[^\d+]/g, '')
    
    // If there's a +, make sure it's only at the beginning
    if (filtered.includes('+')) {
      const plusIndex = filtered.indexOf('+')
      if (plusIndex === 0) {
        // Keep + at beginning, remove any other + characters
        filtered = '+' + filtered.slice(1).replace(/\+/g, '')
      } else {
        // Remove + if it's not at the beginning
        filtered = filtered.replace(/\+/g, '')
      }
    }
    
    return filtered
  }

  /**
   * Handle input event - prevents invalid characters
   */
  const handleInput = (event) => {
    const filteredValue = filterInput(event.target.value)
    tel.value = filteredValue
    
    // Update the input field value to reflect filtering
    if (event.target.value !== filteredValue) {
      event.target.value = filteredValue
    }
  }

  /**
   * Handle keydown event - prevent invalid keys
   */
  const handleKeydown = (event) => {
    const { key, target } = event
    const currentValue = target.value
    const cursorPosition = target.selectionStart

    // Handle autofill or programmatic events where key might be undefined
        if (!key) return
    
    // Allow control keys (backspace, delete, arrows, etc.)
    if (key.length > 1) return
    
    // Allow numbers
    if (/\d/.test(key)) return
    
    // Allow + only at the beginning and if there's no + already
    if (key === '+' && cursorPosition === 0 && !currentValue.includes('+')) {
      return
    }
    
    // Prevent all other characters
    event.preventDefault()
  }

  return {
    // Reactive refs
    tel,
    country,
    
    // Computed validation
    validation,
    
    // Methods
    validate,
    format,
    getCountryInfo,
    getSupportedCountriesList,
    
    // Input handling
    filterInput,
    handleInput,
    handleKeydown,
    
    // Direct access to utils (for advanced usage)
    parsePhoneNumber,
    isValidPhoneNumber,
    formatPhoneNumber: (phoneObj, fmt) => formatPhoneNumber(phoneObj, fmt)
  }
}

// HMR support
if (import.meta.hot) {
  import.meta.hot.accept()
}