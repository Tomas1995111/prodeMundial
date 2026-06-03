export function flagUrl(team: string): string {
  const code = COUNTRY_CODE[normalize(team)]
  return code ? `https://flagcdn.com/${code}.svg` : ''
}

function normalize(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '')
    .toLowerCase()
}

const COUNTRY_CODE: Record<string, string> = {
  alemania: 'de',
  arabiasaudita: 'sa',
  argelia: 'dz',
  argentina: 'ar',
  australia: 'au',
  austria: 'at',
  belgica: 'be',
  bosniayherzegovina: 'ba',
  brasil: 'br',
  caboverde: 'cv',
  camerun: 'cm',
  canada: 'ca',
  chequia: 'cz',
  colombia: 'co',
  coreadelsur: 'kr',
  costademarfil: 'ci',
  croacia: 'hr',
  curazao: 'cw',
  ecuador: 'ec',
  egipto: 'eg',
  emiratosarabesunidos: 'ae',
  escocia: 'gb-sct',
  espana: 'es',
  estadosunidos: 'us',
  francia: 'fr',
  ghana: 'gh',
  haiti: 'ht',
  inglaterra: 'gb-eng',
  irak: 'iq',
  iran: 'ir',
  japon: 'jp',
  jordania: 'jo',
  marruecos: 'ma',
  mexico: 'mx',
  noruega: 'no',
  nuevazelanda: 'nz',
  paisesbajos: 'nl',
  panama: 'pa',
  paraguay: 'py',
  portugal: 'pt',
  qatar: 'qa',
  senegal: 'sn',
  sudafrica: 'za',
  suecia: 'se',
  suiza: 'ch',
  tunez: 'tn',
  turquia: 'tr',
  uruguay: 'uy',
}
