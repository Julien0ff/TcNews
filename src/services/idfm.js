const API_KEY = 'KB9c9Onj7XMyp9P2fupiI9pAQq0BiEHq';
const BASE_URL = 'https://prim.iledefrance-mobilites.fr/marketplace/v2/navitia';

// =============================================
// LIGNES IDFM — COULEURS OFFICIELLES
// =============================================
export const METRO_LINES = {
  '1':   { id: 'line:IDFM:C01371', color: '#F2A800', textColor: '#000000', label: 'Métro 1' },
  '2':   { id: 'line:IDFM:C01372', color: '#005CB9', textColor: '#FFFFFF', label: 'Métro 2' },
  '3':   { id: 'line:IDFM:C01373', color: '#9F971A', textColor: '#FFFFFF', label: 'Métro 3' },
  '3b':  { id: 'line:IDFM:C01386', color: '#98D4E2', textColor: '#000000', label: 'Métro 3b' },
  '4':   { id: 'line:IDFM:C01374', color: '#C04191', textColor: '#FFFFFF', label: 'Métro 4' },
  '5':   { id: 'line:IDFM:C01375', color: '#F15929', textColor: '#FFFFFF', label: 'Métro 5' },
  '6':   { id: 'line:IDFM:C01376', color: '#6ECA97', textColor: '#000000', label: 'Métro 6' },
  '7':   { id: 'line:IDFM:C01377', color: '#FA9ABA', textColor: '#000000', label: 'Métro 7' },
  '7b':  { id: 'line:IDFM:C01387', color: '#6ECA97', textColor: '#000000', label: 'Métro 7b' },
  '8':   { id: 'line:IDFM:C01378', color: '#E19BDF', textColor: '#000000', label: 'Métro 8' },
  '9':   { id: 'line:IDFM:C01379', color: '#B5BD00', textColor: '#000000', label: 'Métro 9' },
  '10':  { id: 'line:IDFM:C01380', color: '#C9910A', textColor: '#000000', label: 'Métro 10' },
  '11':  { id: 'line:IDFM:C01381', color: '#704B1C', textColor: '#FFFFFF', label: 'Métro 11' },
  '12':  { id: 'line:IDFM:C01382', color: '#007852', textColor: '#FFFFFF', label: 'Métro 12' },
  '13':  { id: 'line:IDFM:C01383', color: '#98D4E2', textColor: '#000000', label: 'Métro 13' },
  '14':  { id: 'line:IDFM:C01384', color: '#62259D', textColor: '#FFFFFF', label: 'Métro 14' },
};

export const RER_LINES = {
  'A': { id: 'line:IDFM:C01742', color: '#E2231A', textColor: '#FFFFFF', label: 'RER A' },
  'B': { id: 'line:IDFM:C01743', color: '#5191CD', textColor: '#FFFFFF', label: 'RER B' },
  'C': { id: 'line:IDFM:C01727', color: '#F3D311', textColor: '#000000', label: 'RER C' },
  'D': { id: 'line:IDFM:C01728', color: '#00AB5A', textColor: '#FFFFFF', label: 'RER D' },
  'E': { id: 'line:IDFM:C01729', color: '#BE418D', textColor: '#FFFFFF', label: 'RER E' },
};

export const ALL_LINES = { ...METRO_LINES, ...RER_LINES };

// =============================================
// HELPERS
// =============================================
/** Parse le niveau de perturbation d'un rapport de ligne */
export const parseSeverity = (lineReport) => {
  const disruptions = lineReport?.disruptions || [];
  if (disruptions.length === 0) return 'normal';

  const hasStop = disruptions.some(d =>
    d.severity?.effect === 'NO_SERVICE' ||
    d.severity?.effect === 'SIGNIFICANT_DELAYS'
  );
  if (hasStop) return 'interrupted';

  const hasWarn = disruptions.some(d =>
    d.severity?.effect === 'REDUCED_SERVICE' ||
    d.severity?.effect === 'DETOUR' ||
    d.severity?.effect === 'ADDITIONAL_SERVICE' ||
    d.severity?.effect === 'MODIFIED_SERVICE'
  );
  return hasWarn ? 'disrupted' : 'normal';
};

/** Récupère le rapport d'une ligne spécifique */
export const fetchLineReport = async (lineId) => {
  try {
    const url = `${BASE_URL}/line_reports/lines/${lineId}/line_reports`;
    const response = await fetch(url, {
      headers: { apikey: API_KEY },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('[IDFM] fetchLineReport error:', error);
    return null;
  }
};

/** Récupère les rapports globaux de toutes les lignes */
export const fetchAllLineReports = async () => {
  try {
    const url = `${BASE_URL}/line_reports/line_reports?count=100`;
    const response = await fetch(url, {
      headers: { apikey: API_KEY },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('[IDFM] fetchAllLineReports error:', error);
    return null;
  }
};
