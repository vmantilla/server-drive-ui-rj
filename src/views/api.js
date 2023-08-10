import axios from 'axios';

// Configura axios para usar "http://localhost:3000" como URL base
axios.defaults.baseURL = "http://localhost:3000";

axios.interceptors.request.use(function (config) {
  const token = localStorage.getItem('token');
  config.headers.Authorization = token ? `Bearer ${token}` : '';
  return config;
});

export const getProjectsFromAPI = async () => {
  try {
    const response = await axios.get('/projects');
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error('Error al cargar proyectos:', error);
    throw error;
  }
};

export const deleteProjectFromAPI = async (id) => {
  try {
    await axios.delete(`/projects/${id}`);
  } catch (error) {
    console.error('Error al eliminar proyecto:', error);
    throw error;
  }
};

export const editProjectNameInAPI = async (id, newName) => {
  try {
    const response = await axios.put(`/projects/${id}`, { project: { title: newName } });
    return response.data;
  } catch (error) {
    console.error('Error al editar proyecto:', error);
    throw error;
  }
};

export const addProjectToAPI = async (name) => {
  try {
    const response = await axios.post('/projects', { project: { title: name, image_url: 'https://vanwoow.es/public/images/notfound.png', description: 'Your default description here' } });
    return response.data;
  } catch (error) {
    console.error('Error al agregar proyecto:', error);
    throw error;
  }
};


export const getComponentsFromAPI = async (selectedPreview) => {
  try {
    const response = await axios.get(`/previews/${selectedPreview}/components`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener componentes:', error);
    throw error;
  }
};

export const saveComponentsToAPI = async (selectedPreview, components) => {
  try {
    const response = await axios.put(`/previews/${selectedPreview}/components`, { components });
    return response.data;
  } catch (error) {
    console.error('Error al guardar componentes:', error);
    throw error;
  }
};


export const addPreviewToAPI = async (projectId, previewData) => {
  try {
    const response = await axios.post(`/projects/${projectId}/previews`, previewData);
    return response.data;
  } catch (error) {
    console.error('Error al agregar vista previa:', error);
    throw error;
  }
};

export const deletePreviewFromAPI = async (projectId, previewId) => {
  try {
    await axios.delete(`/projects/${projectId}/previews/${previewId}`);
  } catch (error) {
    console.error('Error al eliminar vista previa:', error);
    throw error;
  }
};

export const getAllPreviewsFromAPI = async (projectId) => {
  try {
    const response = await axios.get(`/projects/${projectId}/previews`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener todas las vistas previas:', error);
    throw error;
  }
};
