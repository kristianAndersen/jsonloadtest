import { ref, computed } from 'vue';

export const useCurrencyValidation = (language, currency, currencyCode) => {
    const currencyValue = ref('')
    const isFormatted = ref(false) // Track if currently showing formatted value

    /**
     * Main validation - computed property that auto-updates
     */
    const validation = computed(() => {
        if (!currencyValue.value) {
            return {
                isValid: false,
                error: null,
                formatted: ''
            }
        }

        // Remove any non-numeric characters for validation
        const numericOnly = currencyValue.value.replace(/[^0-9]/g, '')
        const isValid = numericOnly.length > 0
        
        return {
            isValid: isValid,
            error: isValid ? null : 'Please enter a valid amount',
            formatted: numericOnly
        }
    })

    /**
     * Format number to currency string
     */
    const formatToCurrency = (value) => {
        if (!value) return ''
        const numericValue = parseInt(value.replace(/[^0-9]/g, '')) || 0
        return numericValue.toLocaleString([language], { 
            style: 'currency', 
            currency: currencyCode, 
            maximumSignificantDigits: 6 
        })
    }

    /**
     * Filter input to only allow numeric characters
     */
    const filterInput = (value) => {
        if (!value) return ''
        // Keep only numbers when in input mode
        if (!isFormatted.value) {
            return value.replace(/[^0-9]/g, '')
        }
        return value
    }

    /**
     * Handle input event - prevents invalid characters
     */
    const handleInput = (event) => {
        if (isFormatted.value) return // Don't filter when showing formatted value
        
        const filteredValue = filterInput(event.target.value)
        currencyValue.value = filteredValue

        // Update the input field value to reflect filtering
        if (event.target.value !== filteredValue) {
            event.target.value = filteredValue
        }
    }

    /**
     * Handle keydown event - prevent invalid keys for numeric input
     */
    const handleKeydown = (event) => {
        const { key } = event
        
        // Handle autofill or programmatic events where key might be undefined
        if (!key) return
        
        // Allow control keys (backspace, delete, arrows, tab, enter, etc.)
        if (key.length > 1) return

        // When formatted, allow any key (user might want to select all and type new number)
        if (isFormatted.value) return

        // Allow only numbers 0-9
        if (/[0-9]/.test(key)) return

        // Prevent all other characters
        event.preventDefault()
    }

    /**
     * Handle focus - remove currency formatting, show only numbers
     */
    const handleFocus = (event) => {
        isFormatted.value = false
        // Extract only numbers from formatted value
        const numberValue = currencyValue.value.replace(/[^0-9]/g, '')
        currencyValue.value = numberValue
        event.target.value = numberValue
    }

    /**
     * Handle blur - add currency formatting back
     */
    const handleBlur = (event) => {
        const numericValue = event.target.value.replace(/[^0-9]/g, '')
        
        if (numericValue) {
            const formatted = formatToCurrency(numericValue)
            currencyValue.value = formatted
            event.target.value = formatted
            isFormatted.value = true
        } else {
            currencyValue.value = ''
            event.target.value = ''
            isFormatted.value = false
        }
    }

    return {
        // Reactive ref - the main currency value
        currency: currencyValue,
        
        // Computed validation
        validation,
        
        // Input handling methods
        filterInput,
        handleInput,
        handleKeydown,
        handleFocus,
        handleBlur,
        
        // Utility
        formatToCurrency
    }
}

if (import.meta.hot) {
    import.meta.hot.accept()
}