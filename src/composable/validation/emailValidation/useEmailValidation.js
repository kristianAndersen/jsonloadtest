import { ref, computed } from 'vue'

export const useEmailValidation = () => {
    const email = ref('')

    /**
     * Main validation - computed property that auto-updates
     * This matches the structure expected by your base input component
     */
    const validation = computed(() => {
        if (!email.value) {
            return {
                isValid: false,
                error: null,
                formatted: ''
            }
        }

        //rejects emails like 45@45689.com while allowing normal emails
        //const emailRegex = /^[a-zA-Z0-9._+-]+@[a-zA-Z][a-zA-Z0-9.-]*\.[a-zA-Z]{2,}$/;

        // RFC standards
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

        const isValid = emailRegex.test(email.value)

        return {
            isValid: isValid,
            error: isValid ? null : 'Invalid email format',
            formatted: email.value // For email, formatted is the same as input
        }
    })

    // Regex for filtering valid email characters
    const emailCharacterRegex = /[a-zA-Z0-9@._+-]/

    /**
     * Filter input to only allow valid email characters
     */
    const filterInput = (value) => {
        if (!value) return ''
        // Filter out any characters that aren't valid in email addresses
        return value.replace(/[^a-zA-Z0-9@._+-]/g, '')
    }

    /**
     * Handle input event - prevents invalid characters
     */
    const handleInput = (event) => {
        const filteredValue = filterInput(event.target.value)
        email.value = filteredValue

        // Update the input field value to reflect filtering
        if (event.target.value !== filteredValue) {
            event.target.value = filteredValue
        }
    }

    /**
     * Handle keydown event - prevent invalid keys for email input
     */
    const handleKeydown = (event) => {
        const { key, _target } = event
        // Handle autofill or programmatic events where key might be undefined
        if (!key) return

        // Allow control keys (backspace, delete, arrows, tab, enter, etc.)
        if (key.length > 1) return

        // Allow valid email characters: letters, numbers, @, dot, underscore, plus, hyphen
        if (emailCharacterRegex.test(key)) return

        // Prevent all other characters
        event.preventDefault()
    }

    return {
        // Reactive ref - matches the pattern from phone validation
        email,

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