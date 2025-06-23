// composables/useLogger.js
import { ref } from 'vue'

const isLoggingEnabled = ref(true) // or false by default
const logLevel = ref('debug') // debug, info, warn, error

export function useLogger() {
  const log = (message, level = 'debug', ...args) => {
    if (!isLoggingEnabled.value) return

    const levels = { debug: 0, info: 1, warn: 2, error: 3 }
    if (levels[level] >= levels[logLevel.value]) {
      console[level === 'debug' ? 'log' : level](
        `[${new Date().toISOString()}] ${message}`,
        ...args
      )
    }
  }

  const toggleLogging = () => {
    isLoggingEnabled.value = !isLoggingEnabled.value
  }

  const setLogLevel = (level) => {
    logLevel.value = level
  }

  return {
    log,
    toggleLogging,
    setLogLevel,
    isLoggingEnabled,
    logLevel
  }
}
/*
//use in any component
import { useLogger } from '@/composables/useLogger'

export default {
  setup() {
    const { log } = useLogger()

    log('Component mounted!')
    log('User clicked button', 'info', { userId: 123 })

    return {}
  }
}
*/
