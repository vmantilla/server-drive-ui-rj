import axios from 'axios';

// Configura axios para usar "http://localhost:3000" como URL base
axios.defaults.baseURL = "http://192.168.20.35:3002";

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

export const fetchTemplates = async () => {
  try {
    const response = await axios.get('/templates');
    const templates = response.data;
    
    return response.data;
  } catch (error) {
     console.error('Error al obtener plantillas:', error);
  }
}

export const getProjectsFromAPI = async () => {
  try {
    const response = await axios.get('/projects');
    return response.data;
  } catch (error) {
    console.error('Error al cargar proyectos:', error);
    throw error;
  }
};

export const getProjectFromAPI = async (id) => {
  try {
    const response = await axios.get(`/projects/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al cargar el proyecto:', error);
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

export const batchUpdatesToAPI = async (id, updateObject) => {
  try {
    const response = await axios.put(`/projects/${id}/batch_update`, { batch_update: updateObject });
    return response.data;
  } catch (error) {
    console.error('Error al editar batch:', error);
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

const removePreviewsUnpermittedParams = (preview) => {
  const sanitizedPreview = { ...preview };
  
  delete sanitizedPreview.created_at;
  delete sanitizedPreview.updated_at;
  
  return sanitizedPreview;
};

export const batchUpdatePreviewsToAPI = async (workspaceId, previews) => {
  try {
    const sanitizedPreviews = previews.map(preview => removePreviewsUnpermittedParams(preview));
    const response = await axios.put(`/workspaces/${workspaceId}/batch_update`, {
      workspace: {
        previews: sanitizedPreviews
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error en la actualización por lotes de previews:', error);
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
  delete sanitizedComponent.selected_option;
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

export const duplicateComponentToAPI = async (componentId) => {
  try {
    const response = await axios.post(`/components/${componentId}/duplicate`, {});
    return response.data;
  } catch (error) {
    console.error('Error al duplicar el componente:', error);
    throw error;
  }
};


// === PROPERTY API Calls ===

const removePropertiesUnpermittedParams = (property) => {
  const sanitizedProperty = { ...property };
  
  delete sanitizedProperty.id;
  delete sanitizedProperty.error;
  delete sanitizedProperty.loading;
  delete sanitizedProperty.action;
  delete sanitizedProperty.created_at;
  delete sanitizedProperty.updated_at;
  delete sanitizedProperty.user_id;
  delete sanitizedProperty.project_id;
  delete sanitizedProperty.component_id;
  delete sanitizedProperty.preview_id;

  return sanitizedProperty;
};

export const getPropertiesFromAPI = async (componentId) => {
  try {
    const response = await axios.get(`/components/${componentId}/properties`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener propiedades:', error);
    throw error;
  }
};

export const addPropertyToAPI = async (componentId, propertyData) => {
  try {
    const response = await axios.post(`/components/${componentId}/properties`, { property: removePropertiesUnpermittedParams(propertyData) });
    return response.data;
  } catch (error) {
    console.error('Error al agregar propiedad:', error);
    throw error;
  }
};

export const editPropertyInAPI = async (componentId, property) => {
  console(editPropertyInAPI)
  try {
    let response;
    const modifiedProperty = removePropertiesUnpermittedParams(property);
    console(property.name)
    console(modifiedProperty.data)
    if (property.name === "image" && modifiedProperty.data.virtual_image) {
      const formData = new FormData();
      formData.append('property[virtual_image]', modifiedProperty.data.virtual_image);
      const specificData = {
        contentMode: modifiedProperty.data.contentMode,
        url: modifiedProperty.data.url
      };
      formData.append('property[name]', modifiedProperty.name);
      formData.append('property[platform]', modifiedProperty.platform);
      formData.append('property[data]', JSON.stringify(specificData));
      response = await axios.put(`/properties/${property.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } else {
      response = await axios.put(`/properties/${property.id}`, {
        property: modifiedProperty,
      });
    }

    return response.data;
  } catch (error) {
    console.error('Error al editar propiedad:', error);
    throw error;
  }
};


export const deletePropertyFromAPI = async (componentId, property) => {
  try {
    await axios.delete(`/properties/${property.id}`);
  } catch (error) {
    console.error('Error al eliminar propiedad:', error);
    throw error;
  }
};


// === AMAZON CALL ===

export const getSignedURLFromAPI = async (property, content_type, extension) => {
  try {
    const response = await axios.get(`/properties/${property.id}/get_signed_url?extension=${extension}&content_type=${content_type}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener la URL prefirmada:', error);
    throw error;
  }
};


// === ACTIONS API CALL ===


const removeActionUnpermittedParams = (action) => {
  const sanitizedAction = { ...action };
  
  sanitizedAction.action_type = sanitizedAction.sub_type;

  delete sanitizedAction.id;
  delete sanitizedAction.selected_option;
  delete sanitizedAction.created_at;
  delete sanitizedAction.updated_at;
  delete sanitizedAction.user_id;
  delete sanitizedAction.project_id;
  delete sanitizedAction.component_id;
  delete sanitizedAction.preview_id;
  delete sanitizedAction.parent_id;
  delete sanitizedAction.children;
  delete sanitizedAction.isNew;
  delete sanitizedAction.expanded;
  delete sanitizedAction.loading;
  delete sanitizedAction.sub_type;

  return sanitizedAction;
};

export const addActionToAPI = async (componentId, action) => {
  try {
    console.log(addActionToAPI, removeActionUnpermittedParams(action))
    const response = await axios.post(`/components/${componentId}/component_actions`, { component_action: removeActionUnpermittedParams(action) });
    return response.data;
  } catch (error) {
    console.error('Error al guardar la acción:', error);
    throw error;
  }
};

export const editActionToAPI = async (actionId, action) => {
  try {
    const response = await axios.put(`/component_actions/${actionId}`, { component_action:  removeActionUnpermittedParams(action) });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar acción:', error);
    throw error;
  }
};

export const deleteActionToAPI = async (actionId) => {
  try {
    const response = await axios.delete(`/component_actions/${actionId}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar la acción:', error);
    throw error;
  }
};


// Helper function to remove unpermitted parameters
const removeInstructionUnpermittedParams = (instruction) => {
  const sanitizedInstruction = { ...instruction };
  
  sanitizedInstruction.instruction_type = sanitizedInstruction.sub_type;

  delete sanitizedInstruction.id;
  delete sanitizedInstruction.selected_option;
  delete sanitizedInstruction.created_at;
  delete sanitizedInstruction.updated_at;
  delete sanitizedInstruction.user_id;
  delete sanitizedInstruction.project_id;
  delete sanitizedInstruction.component_id;
  delete sanitizedInstruction.preview_id;
  delete sanitizedInstruction.parent_id;
  delete sanitizedInstruction.children;
  delete sanitizedInstruction.isNew;
  delete sanitizedInstruction.expanded;
  delete sanitizedInstruction.loading;
  delete sanitizedInstruction.sub_type;
  
  return sanitizedInstruction;
};

// === COMPONENT ACTION INSTRUCTIONS API CALLS ===

export const addInstructionToAPI = async (componentActionId, instruction) => {
  try {
    const response = await axios.post(`/component_actions/${componentActionId}/instructions`, { component_action_instruction: removeInstructionUnpermittedParams(instruction) });
    return response.data;
  } catch (error) {
    console.error('Error al guardar la instrucción:', error);
    throw error;
  }
};

export const editInstructionToAPI = async (instructionId, instruction) => {
  try {
    const response = await axios.put(`/component_action_instructions/${instructionId}`, { component_action_instruction: removeInstructionUnpermittedParams(instruction) });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar instrucción:', error);
    throw error;
  }
};

export const deleteInstructionToAPI = async (instructionId) => {
  try {
    const response = await axios.delete(`/component_action_instructions/${instructionId}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar la instrucción:', error);
    throw error;
  }
};





