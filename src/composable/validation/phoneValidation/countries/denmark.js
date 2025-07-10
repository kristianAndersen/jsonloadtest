/**
 * Denmark Phone Number Configuration
 */

export const denmarkConfig = {
  code: '45',
  name: 'Denmark',
  totalLength: 8,
  mobileStart: [
    '20', '21', '22', '23', '24', '25', '26', '27', '28', '29',
    '30', '31', '32', '40', '41', '42', '50', '51', '52', '53',
    '54', '55', '60', '61', '71', '81', '91', '92', '93'
  ],
  landlineStart: [
    '32', '33', '35', '36', '38', '39', '43', '44', '45', '46',
    '47', '48', '49', '53', '54', '55', '56', '57', '58', '59',
    '62', '63', '64', '65', '66', '68', '69', '72', '73', '74',
    '75', '76', '79', '82', '83', '86', '87', '88', '89', '96',
    '97', '98', '99'
  ],
  landlineAreaCodes: {
    '32': 'Copenhagen',
    '33': 'Copenhagen', 
    '35': 'Hvidovre/Rødovre',
    '36': 'Frederiksberg',
    '38': 'Copenhagen suburbs',
    '39': 'Copenhagen suburbs',
    '43': 'Næstved area',
    '44': 'Slagelse area',
    '45': 'Køge area',
    '46': 'Holbæk area',
    '47': 'Kalundborg area', 
    '48': 'Roskilde area',
    '49': 'Frederikssund area',
    '53': 'Fredericia area',
    '54': 'Odder area',
    '55': 'Odense area',
    '56': 'Svendborg area',
    '57': 'Sønderborg area',
    '58': 'Esbjerg area',
    '59': 'Kolding area',
    '62': 'Ribe area',
    '63': 'Tønder area',
    '64': 'Ringkøbing area',
    '65': 'Holstebro area',
    '66': 'Thisted area',
    '68': 'Viborg area',
    '69': 'Skive area',
    '72': 'Silkeborg area',
    '73': 'Vejle area',
    '74': 'Horsens area',
    '75': 'Randers area',
    '76': 'Herning area',
    '79': 'Skagen area',
    '82': 'Ringsted area',
    '83': 'Sorø area',
    '86': 'Århus area',
    '87': 'Århus area',
    '88': 'Hobro area',
    '89': 'Ålborg area',
    '96': 'Torshavn (Faroe Islands)',
    '97': 'Faroe Islands',
    '98': 'Aalborg area',
    '99': 'Hjørring area'
  }
}

/**
 * Denmark-specific formatting function
 */
export const formatDenmarkNumber = (nationalNumber, config) => {
  const start2 = nationalNumber.substring(0, 2)
  
  if (config.landlineStart && config.landlineStart.includes(start2)) {
    // Landline: XX XX XX XX
    return nationalNumber.replace(/(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4')
  } else {
    // Mobile: XX XX XX XX
    return nationalNumber.replace(/(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4')
  }
}