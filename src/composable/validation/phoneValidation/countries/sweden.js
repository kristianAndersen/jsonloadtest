/**
 * Sweden Phone Number Configuration
 */

export const swedenConfig = {
  code: '46',
  name: 'Sweden',
  totalLength: [7, 8, 9, 10],
  mobileStart: ['70', '72', '73', '76', '79'],
  landlineStart: [
    '8', '11', '13', '16', '18', '19', '21', '23', '26', '31',
    '33', '35', '36', '40', '42', '44', '46', '54', '60', '63', '90'
  ],
  landlineAreaCodes: {
    '8': 'Stockholm',
    '11': 'Norrköping',
    '13': 'Linköping',
    '16': 'Eskilstuna',
    '18': 'Uppsala',
    '19': 'Örebro',
    '21': 'Växjö',
    '23': 'Kalmar',
    '26': 'Gotland',
    '31': 'Göteborg',
    '33': 'Borås',
    '35': 'Halmstad',
    '36': 'Jönköping',
    '40': 'Malmö',
    '42': 'Helsingborg',
    '44': 'Kristianstad',
    '46': 'Lund',
    '54': 'Karlstad',
    '60': 'Sundsvall',
    '63': 'Östersund',
    '90': 'Umeå'
  }
}

/**
 * Sweden-specific formatting function
 */
export const formatSwedenNumber = (nationalNumber, config) => {
  const start2 = nationalNumber.substring(0, 2)
  
  if (config.landlineStart && config.landlineStart.includes(start2)) {
    // Landline formatting varies by length
    if (nationalNumber.length === 7) {
      return nationalNumber.replace(/(\d{2})(\d{3})(\d{2})/, '$1 $2 $3')
    } else if (nationalNumber.length === 8) {
      return nationalNumber.replace(/(\d{2})(\d{3})(\d{3})/, '$1 $2 $3')
    } else if (nationalNumber.length === 9) {
      return nationalNumber.replace(/(\d{2})(\d{3})(\d{4})/, '$1 $2 $3')
    } else {
      return nationalNumber.replace(/(\d{2})(\d{4})(\d{4})/, '$1 $2 $3')
    }
  } else {
    // Mobile formatting
    if (nationalNumber.length === 7) {
      return nationalNumber.replace(/(\d{3})(\d{2})(\d{2})/, '$1 $2 $3')
    } else if (nationalNumber.length === 8) {
      return nationalNumber.replace(/(\d{3})(\d{3})(\d{2})/, '$1 $2 $3')
    } else {
      return nationalNumber.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3')
    }
  }
}