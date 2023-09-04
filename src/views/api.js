import axios from 'axios';

// Configura axios para usar "http://localhost:3000" como URL base
axios.defaults.baseURL = "http://localhost:3000";

axios.interceptors.request.use(function (config) {
  const token = localStorage.getItem('token');
  config.headers.Authorization = token ? `Bearer ${token}` : '';
  return config;
});

export const setupInterceptors = (navigate) => { 
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

export const addProjectToAPI = async (projectData) => {
  try {
    const response = await axios.post('/projects', { project: projectData });
    return response.data;
  } catch (error) {
    console.error('Error al agregar proyecto:', error);
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

export const deleteProjectFromAPI = async (id) => {
  try {
    await axios.delete(`/projects/${id}`);
  } catch (error) {
    console.error('Error al eliminar proyecto:', error);
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

export const addWorkspaceToAPI = async (projectId, workspaceData) => {
  try {
    const response = await axios.post(`/projects/${projectId}/workspaces`, { workspace: workspaceData });
    return response.data;
  } catch (error) {
    console.error('Error al agregar workspace:', error);
    throw error;
  }
};

export const editWorkspaceInAPI = async (workspaceId, updatedWorkspaceData) => {
  try {
    const response = await axios.put(`/workspaces/${workspaceId}`, { workspace: updatedWorkspaceData } );
    return response.data;
  } catch (error) {
    console.error('Error al editar workspace:', error);
    throw error;
  }
};

export const deleteWorkspaceFromAPI = async (workspaceId) => {
  try {
    await axios.delete(`/workspaces/${workspaceId}`);
  } catch (error) {
    console.error('Error al eliminar workspace:', error);
    throw error;
  }
};

// === PREVIEW API Calls ===

export const getAllPreviewsFromAPI = async (workspaceId) => {
  try {
    const response = await axios.get(`/workspaces/${workspaceId}/previews`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener todas las vistas previas:', error);
    throw error;
  }
};

export const addPreviewToAPI = async (workspaceId, previewData) => {
  try {
    const response = await axios.post(`/workspaces/${workspaceId}/previews`, previewData);
    console.log("getAllPreviewsFromAPI", response.data);
    return response.data;
  } catch (error) {
    console.error('Error al agregar vista previa:', error);
    throw error;
  }
};

export const editPreviewInAPI = async (previewId, updatedData) => {
  try {
    const response = await axios.put(`/previews/${previewId}`, { preview: updatedData });
    return response.data;
  } catch (error) {
    console.error('Error updating preview in workspace:', error);
    throw error;
  }
};

export const deletePreviewFromAPI = async (previewId) => {
  try {
    await axios.delete(`/previews/${previewId}`);
  } catch (error) {
    console.error('Error al eliminar vista previa:', error);
    throw error;
  }
};


// === COMPONENTS API Calls ===

const removeComponentsUnpermittedParams = (component) => {
  const sanitizedComponent = { ...component };
  
  delete sanitizedComponent.id;
  delete sanitizedComponent.children;
  delete sanitizedComponent.expanded;
  delete sanitizedComponent.loading;
  delete sanitizedComponent.created_at;
  delete sanitizedComponent.updated_at;
  delete sanitizedComponent.user_id;
  delete sanitizedComponent.project_id;
  delete sanitizedComponent.isNew;
  if (sanitizedComponent.property) {
    delete sanitizedComponent.property.isNew;
    delete sanitizedComponent.property.id;
    delete sanitizedComponent.property.component_id;
    delete sanitizedComponent.property.created_at;
    delete sanitizedComponent.property.updated_at;
  }

  return sanitizedComponent;
};

export const getComponentsFromAPI = async (previewId) => {
  try {
    const response = await axios.get(`/previews/${previewId}/components`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener componentes:', error);
    throw error;
  }
};

export const addComponentToAPI = async (previewId, component) => {
  try {
    const response = await axios.post(`/previews/${previewId}/components`, { component: removeComponentsUnpermittedParams(component) });
    return response.data;
  } catch (error) {
    console.error('Error al guardar componente:', error);
    throw error;
  }
};

export const editComponentToAPI = async (componentId, updatedComponent) => {
  try {
    const response = await axios.put(`/components/${componentId}`, { component:  removeComponentsUnpermittedParams(updatedComponent) });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar componente:', error);
    throw error;
  }
};

export const deleteComponentToAPI = async (componentId) => {
  try {
    const response = await axios.delete(`/components/${componentId}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar componente:', error);
    throw error;
  }
};

export const batchUpdateComponentsToAPI = async (projectId, components) => {
  try {
    const sanitizedComponents = components.map(comp => removeComponentsUnpermittedParams(comp));
    
    const response = await axios.put(`/components/batch_update`, { component: {
        components: sanitizedComponents,
        project_id: projectId
      }});

    return response.data;
  } catch (error) {
    console.error('Error en la actualización por lotes de componentes:', error);
    throw error;
  }
};



