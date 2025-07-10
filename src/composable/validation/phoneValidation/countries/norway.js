/**
 * Norway Phone Number Configuration
 */

export const norwayConfig = {
  code: '47',
  name: 'Norway',
  totalLength: 8,
  mobileStart: [
    '40', '41', '45', '46', '47', '48', '90', '91', '92', '93',
    '94', '95', '96', '97', '98', '99'
  ],
  landlineStart: [
    '22', '23', '24', '32', '33', '35', '37', '38', '51', '52',
    '53', '55', '56', '57', '58', '59', '61', '62', '63', '64',
    '65', '66', '67', '69', '71', '72', '73', '74', '75', '76',
    '77', '78', '79'
  ],
  landlineAreaCodes: {
    '22': 'Oslo',
    '23': 'Oslo area',
    '24': 'Follo area',
    '32': 'Drammen',
    '33': 'Buskerud',
    '35': 'Halden/Sarpsborg',
    '37': 'Tønsberg',
    '38': 'Lørenskog/Lillestrøm',
    '51': 'Stavanger/Sandnes',
    '52': 'Haugesund/Karmøy',
    '53': 'Haugesund area',
    '55': 'Bergen',
    '56': 'Sogndal/Førde',
    '57': 'Ålesund/Molde',
    '58': 'Florø',
    '59': 'Odda/Sauda',
    '61': 'Lillehammer',
    '62': 'Kristiansund',
    '63': 'Trondheim',
    '64': 'Steinkjer',
    '65': 'Mo i Rana',
    '66': 'Harstad/Lofoten',
    '67': 'Sortland',
    '69': 'Tromsø',
    '71': 'Røros area',
    '72': 'Namsos',
    '73': 'Orkanger',
    '74': 'Verdal',
    '75': 'Karasjok',
    '76': 'Vadsø/Kirkenes',
    '77': 'Longyearbyen (Svalbard)',
    '78': 'Svalbard',
    '79': 'Hammerfest/Alta'
  }
}

/**
 * Norway-specific formatting function
 */
export const formatNorwayNumber = (nationalNumber) => {
  // All numbers are 8 digits: XXX XX XXX  
  return nationalNumber.replace(/(\d{3})(\d{2})(\d{3})/, '$1 $2 $3')
}