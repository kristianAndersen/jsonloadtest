import { ref, computed } from 'vue'

export const useYearValidation = () => {

    console.log('Year validation initialized');

    const year = ref('')

    /**
     * Main validation - computed property that auto-updates
     * This matches the structure expected by your base input component
     */
    const validation = computed(() => {
        if (!year.value) {
            return {
                isValid: false,
                error: null,
                formatted: ''
            }
        }
        console.log('Year validation called with:', year.value);
        // Check if it's exactly 4 digits
        const yearRegex = /^\d{4}$/
        const isValidFormat = yearRegex.test(year.value)

        if (!isValidFormat) {
            return {
                isValid: false,
                error: 'Year must be exactly 4 digits',
                formatted: year.value
            }
        }

        // Check if it's a reasonable year range (optional - adjust as needed)
        const yearNumber = parseInt(year.value, 10)
        const currentYear = new Date().getFullYear()
        const isValidRange = yearNumber >= 1900 && yearNumber <= currentYear + 50

        return {
            isValid: isValidRange,
            error: isValidRange ? null : `Year must be between 1900 and ${currentYear + 50}`,
            formatted: year.value
        }
    })

    // Regex for filtering valid year characters (only digits)
    const yearCharacterRegex = /[0-9]/

    /**
     * Filter input to only allow numbers and limit to 4 characters
     */
    const filterInput = (value) => {
        if (!value) return ''
        // Filter out any non-numeric characters and limit to 4 digits
        const filtered = value.replace(/[^0-9]/g, '')
        return filtered.slice(0, 4) // Limit to 4 characters
    }

    /**
     * Handle input event - prevents invalid characters and limits length
     */
    const handleInput = (event) => {
        const filteredValue = filterInput(event.target.value)
        year.value = filteredValue

        // Update the input field value to reflect filtering
        if (event.target.value !== filteredValue) {
            event.target.value = filteredValue
        }
    }

    /**
     * Handle keydown event - prevent invalid keys for year input
     */
    const handleKeydown = (event) => {
        const { key, target } = event
        // Handle autofill or programmatic events where key might be undefined
        if (!key) return

        // Allow control keys (backspace, delete, arrows, tab, enter, etc.)
        if (key.length > 1) return

        // Prevent input if already at 4 characters (unless it's a control key)
        if (target.value.length >= 4) {
            event.preventDefault()
            return
        }

        // Allow only numeric characters
        if (yearCharacterRegex.test(key)) return

        // Prevent all other characters
        event.preventDefault()
    }

    return {
        // Reactive ref - matches the pattern from phone validation
        year,

        // Computed validation - this is what your base component looks for
        validation,

        // Input handling methods
        filterInput,
        handleInput,
        handleKeydown
    }
}

if (import.meta.hot) {
    import.meta.hot.accept()
}