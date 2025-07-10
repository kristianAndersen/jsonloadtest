/**
 * Finland Phone Number Configuration
 */

export const finlandConfig = {
  code: '358',
  name: 'Finland', 
  totalLength: [8, 9, 10],
  mobileStart: ['40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50'],
  landlineStart: ['2', '3', '5', '6', '8', '9'],
  landlineAreaCodes: {
    '2': 'Turku/Pori region',
    '3': 'Tampere region', 
    '5': 'Kymenlaakso/South Karelia',
    '6': 'Vaasa region',
    '8': 'Oulu region',
    '9': 'Helsinki region'
  }
}

/**
 * Finland-specific formatting function
 */
export const formatFinlandNumber = (nationalNumber, config) => {
  const start1 = nationalNumber.substring(0, 1)
  
  if (config.landlineStart && config.landlineStart.includes(start1)) {
    // Landline with area code
    if (nationalNumber.length === 9) {
      return nationalNumber.replace(/(\d{1})(\d{4})(\d{4})/, '$1 $2 $3')
    } else if (nationalNumber.length === 10) {
      return nationalNumber.replace(/(\d{1})(\d{4})(\d{5})/, '$1 $2 $3')
    }
  } else {
    // Mobile formatting
    if (nationalNumber.length === 8) {
      return nationalNumber.replace(/(\d{2})(\d{3})(\d{3})/, '$1 $2 $3')
    } else if (nationalNumber.length === 9) {
      return nationalNumber.replace(/(\d{2})(\d{3})(\d{4})/, '$1 $2 $3')
    }
  }
  
  return nationalNumber
}