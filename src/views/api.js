import axios from 'axios';

// Configura axios para usar "http://localhost:3000" como URL base
axios.defaults.baseURL = "http://localhost:3000";

axios.interceptors.request.use(function (config) {
  const token = localStorage.getItem('token');
  config.headers.Authorization = token ? `Bearer ${token}` : '';
  return config;
});

export const setupInterceptors = (navigate) => {  // Cambia el parámetro a "navigate"
  axios.interceptors.response.use(
    response => {
      return response;
    },
    error => {
      if (error.response && error.response.status === 401) {
        navigate('/');
      }
      return Promise.reject(error);
    }
  );
};

// === PROJECT API Calls ===

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

export const editProjectNameInAPI = async (id, projectData) => {
  try {
    const response = await axios.put(`/projects/${id}`, { project: projectData });
    return response.data;
  } catch (error) {
    console.error('Error al editar proyecto:', error);
    throw error;
  }
};

export const addProjectToAPI = async (projectData) => {
  try {
    const response = await axios.post('/projects', { project: projectData });
    return response.data;
  } catch (error) {
    console.error('Error al agregar proyecto:', error);
    throw error;
  }
};

// === WORKSPACE API Calls ===

export const getWorkspacesFromAPI = async (projectId) => {
  try {
    const response = await axios.get(`/projects/${projectId}/workspaces`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener los workspaces:', error);
    throw error;
  }
};

export const showWorkspaceFromAPI = async (projectId, workspaceId) => {
  try {
    const response = await axios.get(`/projects/${projectId}/workspaces/${workspaceId}`);
    return response.data;
  } catch (error) {
    console.error('Error al mostrar el espacio de trabajo:', error);
    throw error;
  }
};


export const addWorkspaceToAPI = async (projectId, workspaceData) => {
  try {
    const response = await axios.post(`/projects/${projectId}/workspaces`, { workspace: workspaceData });
    return response.data;
  } catch (error) {
    console.error('Error al agregar workspace:', error);
    throw error;
  }
};

export const deleteWorkspaceFromAPI = async (projectId, workspaceId) => {
  try {
    await axios.delete(`/projects/${projectId}/workspaces/${workspaceId}`);
  } catch (error) {
    console.error('Error al eliminar workspace:', error);
    throw error;
  }
};

export const editWorkspaceInAPI = async (projectId, workspaceId, updatedWorkspaceData) => {
  try {
    const response = await axios.put(`/projects/${projectId}/workspaces/${workspaceId}`, { workspace: updatedWorkspaceData } );
    return response.data;
  } catch (error) {
    console.error('Error al editar workspace:', error);
    throw error;
  }
};

export const createPreviewInWorkspaceAPI = async (projectId, workspaceId, previewData) => {
  try {
    const response = await axios.post(`/projects/${projectId}/workspaces/${workspaceId}/previews`, { preview: previewData });
    return response.data;
  } catch (error) {
    console.error('Error al crear vista previa en el espacio de trabajo:', error);
    throw error;
  }
};


// === COMPONENTS API Calls ===


export const getComponentsFromAPI = async (projectId, selectedPreview) => {
  try {
    const response = await axios.get(`/projects/${projectId}/previews/${selectedPreview}/components`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error al obtener componentes:', error);
    throw error;
  }
};

export const saveComponentsToAPI = async (projectId, selectedPreview, components) => {
  try {
    const response = await axios.put(`/projects/${projectId}/previews/${selectedPreview}/components`, { components });
    return response.data;
  } catch (error) {
    console.error('Error al guardar componentes:', error);
    throw error;
  }
};

// === PREVIEW API Calls ===

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


// === Color API Calls ===

export const getAllColorsFromAPI = async (projectId) => {
  try {
    const response = await axios.get(`/projects/${projectId}/colors`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener todos los colores:', error);
    throw error;
  }
};

export const addColorToAPI = async (projectId, colorData) => {
  try {
    const response = await axios.post(`/projects/${projectId}/colors`, colorData);
    return response.data;
  } catch (error) {
    console.error('Error al agregar color:', error);
    throw error;
  }
};

export const editColorInAPI = async (projectId, colorId, updatedColorData) => {
  try {
    const response = await axios.put(`/projects/${projectId}/colors/${colorId}`, updatedColorData);
    return response.data;
  } catch (error) {
    console.error('Error al editar color:', error);
    throw error;
  }
};

export const deleteColorFromAPI = async (projectId, colorId) => {
  try {
    await axios.delete(`/projects/${projectId}/colors/${colorId}`);
  } catch (error) {
    console.error('Error al eliminar color:', error);
    throw error;
  }
};

// === Font API Calls ===

export const getAllFontsFromAPI = async (projectId) => {
  try {
    const response = await axios.get(`/projects/${projectId}/fonts`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener todas las fuentes:', error);
    throw error;
  }
};

export const addFontToAPI = async (projectId, fontData) => {
  try {
    const response = await axios.post(`/projects/${projectId}/fonts`, fontData);
    return response.data;
  } catch (error) {
    console.error('Error al agregar fuente:', error);
    throw error;
  }
};

export const editFontInAPI = async (projectId, fontId, updatedFontData) => {
  try {
    const response = await axios.put(`/projects/${projectId}/fonts/${fontId}`, updatedFontData);
    return response.data;
  } catch (error) {
    console.error('Error al editar fuente:', error);
    throw error;
  }
};

export const deleteFontFromAPI = async (projectId, fontId) => {
  try {
    await axios.delete(`/projects/${projectId}/fonts/${fontId}`);
  } catch (error) {
    console.error('Error al eliminar fuente:', error);
    throw error;
  }
};


