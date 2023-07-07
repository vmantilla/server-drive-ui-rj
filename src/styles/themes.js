// themes.js

import { fetchJsonFile } from '../helpers/utils';

export let themesData = null;

export const loadThemes = async () => {
  if (themesData) {
    return themesData;
  }

  try {
    const themesJson = await fetchJsonFile('./theme.json');
    themesData = themesJson;
    return themesData;
  } catch (error) {
    console.error('Error al cargar y parsear el JSON de themes:', error);
    return null;
  }
};
