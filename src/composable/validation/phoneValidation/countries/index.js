/**
 * Countries Configuration Index
 * Import and export all country configurations and formatters
 */

import { denmarkConfig, formatDenmarkNumber } from './denmark.js'
import { swedenConfig, formatSwedenNumber } from './sweden.js'
import { finlandConfig, formatFinlandNumber } from './finland.js'
import { norwayConfig, formatNorwayNumber } from './norway.js'

// Country configurations
export const countries = {
  DK: denmarkConfig,
  SE: swedenConfig,
  FI: finlandConfig,
  NO: norwayConfig
}

// Country-specific formatters
export const formatters = {
  DK: formatDenmarkNumber,
  SE: formatSwedenNumber,
  FI: formatFinlandNumber,
  NO: formatNorwayNumber
}

// Export individual configs for direct import if needed
export { denmarkConfig, swedenConfig, finlandConfig, norwayConfig }
export { formatDenmarkNumber, formatSwedenNumber, formatFinlandNumber, formatNorwayNumber }