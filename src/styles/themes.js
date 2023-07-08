import { fetchJsonFile } from '../helpers/utils';

export let themesData = null;

export const setThemesData = (newThemesData) => {
  themesData = newThemesData;
  console.log('themesData updated:', themesData);
};

export const getThemesData = () => {
  return themesData;
};

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
