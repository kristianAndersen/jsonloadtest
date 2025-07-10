//ssnValidation.js
import { ref, computed, onMounted } from 'vue';

export const useSsnValidation = (_country) => {
   
    const ssn = ref('')
    const country = _country;
    const isFormatted = ref(false) // Track if currently showing formatted value
    const validationFunction = ref(null) // Store the loaded validation function
    const isLoading = ref(true) // Track if validation function is loading

    // Load the appropriate validation function based on country
    const loadValidationFunction = async (country) => {
        isLoading.value = true;
        
        try {
            switch (country) {
                case 'da-DK':
                    const dkModule = await import('./countries/useDKssnValidation');
                    const { validateDanishSSN } = dkModule.useDKssnValidation();
                    validationFunction.value = validateDanishSSN;
                    break;
                    
                case 'fi-FI':
                    const fiModule = await import('./countries/useFIssnValidation');
                    const { validateFinishSSN } = fiModule.useFIssnValidation();
                    validationFunction.value = validateFinishSSN;
                    break;
                    
                case 'sv-SE':
                    validationFunction.value = () => ({ valid: false, reason: 'Swedish validation not implemented yet' });
                    break;
                    
                case 'nn-NO':
                    validationFunction.value = () => ({ valid: false, reason: 'Norwegian validation not implemented yet' });
                    break;
                    
                case 'de-DE':
                    validationFunction.value = () => ({ valid: false, reason: 'German validation not implemented yet' });
                    break;
                    
                default:
                    validationFunction.value = () => ({ 
                        valid: false, 
                        reason: 'Unsupported country. Use: da-DK, fi-FI, se-SE, nn-NO, or de-DE' 
                    });
            }
        } catch (error) {
            console.error('Error loading validation function:', error);
            validationFunction.value = () => ({ 
                valid: false, 
                reason: 'Error loading validation function' 
            });
        } finally {
            isLoading.value = false;
        }
    }

    // Load validation function when component mounts
    onMounted(() => {
        loadValidationFunction(country);
    });

    /**
     * Main validation - computed property that auto-updates
     */
    const validation = computed(() => {
        if (isLoading.value) {
            return {
                isValid: false,
                error: 'Loading validation...',
                formatted: ''
            }
        }

        if (!ssn.value) {
            return {
                isValid: false,
                error: null,
                formatted: ''
            }
        }

        if (!validationFunction.value) {
            return {
                isValid: false,
                error: 'Validation function not loaded',
                formatted: ''
            }
        }

        const result = validationFunction.value(ssn.value);
        const isValid = result.valid;
     
        console.log(`Validating SSN: "${ssn.value}" for country: ${country} - Valid: ${isValid}`);
        return {
            isValid: isValid,
            error: isValid ? null : 'Please enter a valid SSN',
            formatted: result.value || ''
        }
    })

    /**
     * Filter input to only allow numeric characters
     */
    const filterInput = (value) => {
        console.log('Filtering input:', value)
        
        if (!value) return ''
        
        // Remove any characters that aren't letters, numbers, or hyphens
        return value.replace(/[^a-zA-Z0-9-]/g, '')
    }

    /**
     * Handle input event - prevents invalid characters
     */
    const handleInput = (event) => {
        const filteredValue = filterInput(event.target.value)

        console.log('Handling input:', filteredValue)
        ssn.value = filteredValue

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

        // Allow only numbers, letters, and hyphens
        if (/[a-zA-Z0-9-]/.test(key)) return

        // Prevent all other characters
        event.preventDefault()
    }

    return {
        // Reactive ref
        ssn,
        
        // Computed validation
        validation,
        
        // Loading state
        isLoading,
        
        // Input handling methods
        filterInput,
        handleInput,
        handleKeydown,
    }
}

if (import.meta.hot) {
    import.meta.hot.accept()
}