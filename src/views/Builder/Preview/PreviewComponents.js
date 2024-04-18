import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Modal from 'react-bootstrap/Modal';
import { Menu, Item, Separator, Submenu, useContextMenu } from 'react-contexify';
import 'react-contexify/ReactContexify.css';

import '../../../css/Builder/Preview/PreviewComponents.css';

import { 
  addComponentToAPI, editComponentToAPI, deleteComponentToAPI, duplicateComponentToAPI
 } from '../../../services/api';
import { useBuilder } from '../BuilderContext';

const MENU_ID = 'blahblah';

function PreviewComponents({ showNotification, componentToAdd, onOrderUpdated, updateChanges }) {

  const { 
    uiComponents, setUiComponents,
    uiComponentsProperties, setUiComponentsProperties,
    selectedScreen, setSelectedScreen,
    selectedComponent, setSelectedComponent,
    buildTree,
    recursiveDeleteComponent,
    updatecomponentProperties,
    handleJSONUpdate
  } = useBuilder();

  const [components, setComponents] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [componentToDelete, setComponentToDelete] = useState(null);
  const [draggingComponent, setDraggingComponent] = useState(null);
  const [draggingComponentOver, setDraggingComponentOver] = useState(null);
  const [componentLoading, setComponentLoading] = useState(null);
  const [orderableComponent, setOrderableComponent] = useState(null);
  const [originalIndex, setOriginalIndex] = useState(null);
  const [contextMenuComponentId, setContextMenuComponentId] = useState(null);
  const [expandedComponents, setExpandedComponents] = useState([]);

  useEffect(() => {
    loadBuildTree();
  }, [selectedScreen, uiComponents]);

  const loadBuildTree = (component) => {
    setComponents(buildTree(selectedScreen));
  };

  const handleToggleExpanded = (id) => {
    setExpandedComponents(prev => {
      if (prev.includes(id)) {
        return prev.filter(componentId => componentId !== id);
      } else {
        return [...prev, id];
      }
    });
  }

  const handleDrop = async (event, parentId) => {
    event.preventDefault();
    event.stopPropagation();

    draggingComponent["parent_id"] = parentId;
    setComponentLoading(draggingComponent.id);

    const { isNew, selected_option } = draggingComponent;

    if (isNew) {
      addComponent(parentId);
    } else {
      moveComponent(parentId);
    }
  };

  const handleError = (error, message) => {
    loadBuildTree();
    setComponentLoading(null);
    setDraggingComponent(null);
    setSelectedComponent(null);
    console.error(message, error);
    showNotification('error', message);
  };

  const addComponent = async (parentId) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const savedComponent = await addComponentToAPI(selectedScreen, draggingComponent);
      updatecomponentProperties(savedComponent);

      setComponentLoading(null);
      setDraggingComponent(null);
      setSelectedComponent(null);

      showNotification('success', 'Componente agregado exitosamente.');
    } catch (error) {
      handleError(error, 'Error al agregar el componente:');
    }
  };

  const modifyComponent = async (componentId, params, successMessage) => {
    try {
    // Es posible que quieras agregar un delay aquí también
      await new Promise(resolve => setTimeout(resolve, 500));

      const updatedComponent = await editComponentToAPI(componentId, params);

    updatecomponentProperties(updatedComponent); // Si es necesario
    setComponentLoading(null);
    setSelectedComponent(null);
    
    if (successMessage) {
      showNotification('success', successMessage);
    }
  } catch (error) {
    console.error('Error al modificar el componente:', error);
    showNotification('error', error.message);
    setComponentLoading(null);
    if (params.position !== undefined) setOrderableComponent(null);
    if (params.parent_id !== undefined) setDraggingComponent(null);
  }
};

// Uso de modifyComponent para cambiar parent_id
const moveComponent = (parentId) => {
  const originalParentId = uiComponents[draggingComponent.id].parent_id;
  modifyComponent(draggingComponent.id, { parent_id: parentId }, 'Componente movido exitosamente.');
};

// Uso de modifyComponent para cambiar position
const handleEditComponentOrder = (newIndex) => {
  setComponentLoading(orderableComponent.id);
  setOrderableComponent(null);
  modifyComponent(orderableComponent.id, { position: newIndex });
};

const deleteComponent = async (compToDelete) => { 
  if (['header', 'body', 'footer'].includes(compToDelete.sub_type)) {
    return;
  }

  setShowDeleteModal(false);
  setComponentToDelete(null);
  setComponentLoading(compToDelete.id);
  
  await new Promise(resolve => setTimeout(resolve, 500));
  
  try {
    await deleteComponentToAPI(compToDelete.id);
    recursiveDeleteComponent(compToDelete.id)
    setComponentLoading(null);
    setSelectedComponent(null);
    showNotification('success', 'Componentes eliminado exitosamente.');
  } catch (error) {
    setComponentLoading(null);
    setSelectedComponent(null);
    console.error('Error al eliminar el componente:', error);
    showNotification('error', 'Error al eliminar el componente.');
  }
};


useEffect(() => {
  setDraggingComponent(componentToAdd);
}, [componentToAdd]);

useEffect(() => {
  const findComponentByIdRecursive = (id, components) => {
    for (let comp of components) {
      if (comp.id === id) return comp;
      if (comp.children) {
        let found = findComponentByIdRecursive(id, comp.children);
        if (found) return found;
      }
    }
    return null;
  };

  const updateComponentInTree = (updatedComp, components) => {
    console.log(`Updating component ${updatedComp.id} in tree.`);
    return components.map(comp => {
      if (comp.id === updatedComp.id) return updatedComp;
      if (comp.children) comp.children = updateComponentInTree(updatedComp, comp.children);
      return comp;
    });
  };

  const handleKeyPress = (e) => {
    if (orderableComponent) {
      const parentId = orderableComponent.parent_id;

      const parentComponent = findComponentByIdRecursive(parentId, components);

      if (!parentComponent || !parentComponent.children) {
        console.log("Parent component or children not found!");
        return;
      }

      const siblings = parentComponent.children;
      let currentIndex = siblings.findIndex(comp => comp.id === orderableComponent.id);

      if (currentIndex === -1) return;

      if (e.key === "ArrowUp" && currentIndex > 0) {
        const [moved] = siblings.splice(currentIndex, 1);
        siblings.splice(currentIndex - 1, 0, moved);
        onOrderUpdated(new Date().toISOString());
      } else if (e.key === "ArrowDown" && currentIndex < siblings.length - 1) {
        const [moved] = siblings.splice(currentIndex, 1);
        siblings.splice(currentIndex + 1, 0, moved);
        onOrderUpdated(new Date().toISOString());
      } else if (e.key === "Enter") {
        handleEditComponentOrder(currentIndex);
      } else if (e.key === "Escape") {
        if (originalIndex !== null) {
          const [moved] = siblings.splice(currentIndex, 1);
          siblings.splice(originalIndex, 0, moved);
          setOrderableComponent(null);
          setOriginalIndex(null);
        }
        setSelectedComponent(orderableComponent);
      }

      parentComponent.children = siblings;
      const newComponents = updateComponentInTree(parentComponent, components);
      setComponents(newComponents);
    }
  };

  window.addEventListener("keydown", handleKeyPress);
  return () => {
    window.removeEventListener("keydown", handleKeyPress);
  };
}, [orderableComponent]);


  const findParentByIdRecursive = (id, components, parent = null) => {
    console.log(`Searching for parent of component with id: ${id}`);
    for (let comp of components) {
      console.log(`Checking component ${comp.id}`);
      if (comp.id === id) return parent;
      if (comp.children) {
        let foundParent = findParentByIdRecursive(id, comp.children, comp);
        if (foundParent !== null) return foundParent;
      }
    }
    console.log("Parent component not found!");
    return null;
  };

  const makeComponentOrderable = (component) => {
    const parentComponent = findParentByIdRecursive(component.id, components, null)
    if (parentComponent && parentComponent.children) {
      const index = parentComponent.children.findIndex(comp => comp.id === component.id);
      setOriginalIndex(index);
    }
    
    setOrderableComponent(component);
    setSelectedComponent(null);
  };

const handleDragStart = (event, component) => {
  if (['header', 'body', 'footer'].includes(component.sub_type)) {
    return;
  }
  event.stopPropagation();
  setDraggingComponent(component);
};

const handleDragEnd = () => {
  setDraggingComponent(null);
};

const handleDragEnterLeaveOrOver = (event, componentId) => {
  event.preventDefault();
  setDraggingComponentOver(componentId);
};


const duplicateComponent = async (compId) => {
  try {
    // Es posible que quieras agregar un delay aquí también
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const updatedComponent = await duplicateComponentToAPI(compId);
    
    console.log("updatedComponent", updatedComponent);
    updatecomponentProperties(updatedComponent); 
    setComponentLoading(null);
    setSelectedComponent(null);
  } catch (error) {
    console.error('Error al duplicar el componente:', error);
    showNotification('error', "Error al duplicar el componente");
    setComponentLoading(null);
  }
};

const getCustomizations = (sub_type) => {
  const customizations = {
    'header': { class: 'component-type-header', label: '', enableDrag: false },
    'body': { class: 'component-type-body', label: '', enableDrag: false },
    'footer': { class: 'component-type-footer', label: '', enableDrag: false },
    'default': { class: '', label: '', enableDrag: true },
  };

  return customizations[sub_type] || customizations['default'];
};

const computeClassNames = (comp, draggingComponent, selectedComponent, draggingComponentOver, orderableComponent) => {
  let classes = "component-item ";

  if (comp.component_type === 'component') {
    classes += "component ";
  }

  if (comp.component_type === 'action') {
    classes += "action ";
  }

  if (comp.component_type === 'instruction') {
    classes += "instruction ";
  }

  if (orderableComponent && comp.id === orderableComponent.id) {
    return "reorder-component-selected";
  }

  if (draggingComponent) {
    if (comp.id === draggingComponent.id) {
      classes += "disabled-drop ";
    } else {
      classes += "drop-target ";
    }
  }

  // Logic for ready-for-drop state
  if (draggingComponent && draggingComponentOver && comp.id === draggingComponentOver && draggingComponent != comp.id) {
    classes += "ready-for-drop ";
  } else {
    // Logic for selected state (applied only if there's no draggingComponentOver)
    if (selectedComponent && selectedComponent.id === comp.id) {
      classes += "selected ";
    }
  }

  return classes;
};

const { show } = useContextMenu({
  id: MENU_ID,
});

function handleContextMenu(event, component){

  if (component && ['header', 'body', 'footer'].includes(component.sub_type)) {
    return; 
  }
  setContextMenuComponentId(component.id);
  setSelectedComponent(component)
  setDraggingComponent(null);
  setOrderableComponent(null);
  show({
    event,
    props: {
      key: 'value'
    }
  })
}

function handleItemClick(e, itemID) {
  if (contextMenuComponentId !== null) {
    switch(itemID) {
    case 'duplicate':
      duplicateComponent(contextMenuComponentId);
      break;
    case 'move':
      if (selectedComponent && selectedComponent.id !== null) {
        makeComponentOrderable(selectedComponent);
        setOrderableComponent(selectedComponent);
      }
      break;
    case 'delete':
      if (selectedComponent && selectedComponent.id !== null) {
        setShowDeleteModal(true);
        setComponentToDelete(selectedComponent);
      }
      break;
    default:
      break;
    }
  }
}

// Exporta el arreglo 'components' como un archivo JSON
const exportComponents = () => {
  console.log(components)
  const componentsJSON = JSON.stringify(convertToNewStructure(components));
  const blob = new Blob([componentsJSON], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
a.download = 'componentes.json'; // Nombre del archivo JSON
a.style.display = 'none';
document.body.appendChild(a);

a.click();

// Limpia y revierte los cambios en el DOM
document.body.removeChild(a);
URL.revokeObjectURL(url);
};

// Importa un archivo JSON y lo convierte en el arreglo 'components'
const importComponents = async () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'application/json';
  input.style.display = 'none';
  document.body.appendChild(input);

  return new Promise((resolve, reject) => {
    input.onchange = async () => {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        const newJson = JSON.parse(reader.result);
        const oldComponents = convertToOldStructure(newJson);
        resolve(oldComponents);
      };

      reader.onerror = () => {
        reject(new Error('Error reading file'));
      };

      reader.readAsText(file);
    };

    input.click();
    document.body.removeChild(input);
  });
};

// Convierte de la primera estructura a la nueva
function convertOldToNew(oldComponent) {
  if (!oldComponent) return null;

  const newComponent = {
    id: oldComponent.id.toString(),
    componentType: oldComponent.property?.data?.sub_type || oldComponent.sub_type,
  commonStyleIds: [], // Puedes añadir aquí según necesites
  children: oldComponent.children.map(convertOldToNew)
};

return newComponent;
}

function convertToNewStructure(oldJson) {
  const uiComponents = oldJson.map(convertOldToNew);
  const newJson = {
    uiComponents,
  sharedStyles: {}, // Completar según las necesidades
  localizedTexts: {} // Completar según las necesidades
};

return newJson;
}

// Convierte de la nueva estructura a la primera
function convertNewToOld(newComponent) {
  if (!newComponent) return null;

  const oldComponent = {
    id: parseInt(newComponent.id),
    sub_type: newComponent.componentType,
  parent_id: null, // Esto tendrás que ajustarlo según tu lógica
  children: newComponent.children.map(convertNewToOld),
  property: {} // Completar según las necesidades
};

return oldComponent;
}

function convertToOldStructure(newJson) {
  const oldComponents = newJson.uiComponents.map(convertNewToOld);
  return oldComponents;
}



const renderComponentList = (compArray, parentId = null) => 
  compArray.map(comp => {
    if (!comp || !comp.sub_type) {
      console.error('Invalid component:', comp);
      return null;
    }

    const { id, sub_type, property } = comp;
    const { class: customClass, label: customLabel, enableDrag } = getCustomizations(sub_type);

    return (
      <div key={comp.id} className={customClass} 
        draggable={comp.id !== parentId && enableDrag}
        onDragStart={(e) => handleDragStart(e, comp)}
        onDragEnd={handleDragEnd}
        onDrop={(e) => handleDrop(e, comp.id)}
        >
        {customLabel && (
          <div className="custom-label">{customLabel}</div>
        )}
        <div 
          onDragOver={(e) => handleDragEnterLeaveOrOver(e, comp.id)}
          onDrop={(e) => handleDrop(e, comp.id)}

          onDragLeave={(e) => handleDragEnterLeaveOrOver(e, null)}
          className={`${computeClassNames(comp, draggingComponent, selectedComponent, draggingComponentOver, orderableComponent)}`}
          onClick={() => {
            setSelectedComponent(comp);
          }}
          onContextMenu={(e) => handleContextMenu(e, comp)}
        >
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <div style={{display: 'flex', alignItems: 'center'}}>
              <span className="toggle-btn" onClick={(e) => { e.stopPropagation(); handleToggleExpanded(comp.id); }}>
                {expandedComponents.includes(comp.id) ?  <i className="bi bi-node-minus"></i> : <i className="bi bi-node-plus-fill"></i>}
              </span>
              <span>{comp.sub_type ? comp.name : 'N/A'}</span>
            </div>
            
          </div>
            {componentLoading && comp.id === componentLoading && (
              <div className="component-actions">
                <Spinner animation="border" size="sm" />
              </div>
            )}
        </div>

        {expandedComponents.includes(comp.id) && comp.children && comp.children.length > 0 && 
          <div className="component-children">
            {renderComponentList(comp.children, comp.id)}
          </div>
        }

        <Menu id={MENU_ID}>
        <Item id="copy" onClick={(e) => handleItemClick(e, 'duplicate')}><i className="bi bi-files"></i>&nbsp;Duplicate</Item>
        <Item id="move" onClick={(e) => handleItemClick(e, 'move')}><i className="bi bi-arrows-move"></i>&nbsp;Reorder</Item>
        <Separator />
          <Item id="delete" onClick={(e) => handleItemClick(e, 'delete')}><i className="bi bi-trash"></i>&nbsp;Delete</Item>
      </Menu>
      </div>                
    );
  });


  return (
    <div className="buildercomponents">
      <span className="component-title">Components</span>
      <span onClick={exportComponents}>
      <i className="bi bi-cloud-upload"></i>
      </span>
    <div className="components-container">
      {renderComponentList(components)}
    </div>
      {showDeleteModal && (
        <Modal show={showDeleteModal}>
          <Modal.Header>
            <Modal.Title>Eliminar Componente</Modal.Title>
          </Modal.Header>
          <Modal.Body>¿Desea eliminar este componente?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancelar</Button>
            <Button variant="danger" onClick={() => deleteComponent(componentToDelete)}>Eliminar</Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}

export default PreviewComponents;
