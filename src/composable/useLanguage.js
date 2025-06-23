// composables/useLanguage.js
import { ref, readonly, provide, inject } from 'vue'


import { useConfigStore } from './../stores/ConfigStore'; // Import config store for configuration


// Symbol for unique injection key
const LanguageKey = Symbol('language')

// Create state in module scope so it's shared between all components
const currentLanguage = ref('en-GB')
const availableLanguages = ['en-GB', 'da-DK', 'fi-FI']

// Create the main composable
export function createLanguageContext() {
  // Initialize current language from data store


  const configStore = useConfigStore(); // Access configuration from config store
  if (configStore.getLanguage) {
    currentLanguage.value = configStore.getLanguage || 'en-GB' // Default to English if not set
  }
  // Function to get localized text
  function t(textObj) {
    if (!textObj) return ''

    // Try current language
    if (textObj[currentLanguage.value]) {
      return textObj[currentLanguage.value]
    }

    // Fallback to any available language
    const langs = Object.keys(textObj)
    if (langs.length > 0) {
      return textObj[langs[0]]
    }

    return ''
  }

  // Function to change language
  function setLanguage(lang) {
    if (availableLanguages.includes(lang)) {
      currentLanguage.value = lang
    }
  }

  // Package functions and state
  const languageContext = {
    current: readonly(currentLanguage),
    available: availableLanguages,
    t,
    setLanguage
  }

  // Provide to component tree
  provide(LanguageKey, languageContext)

  return languageContext
}

// Composable for components to use
export function useLanguage() {



  const context = inject(LanguageKey)

  if (!context) {
    throw new Error('useLanguage must be used within a component that has called createLanguageContext')
  }

  return context
}
