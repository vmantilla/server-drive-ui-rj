import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Modal from 'react-bootstrap/Modal';
import { Menu, Item, Separator, Submenu, useContextMenu } from 'react-contexify';
import 'react-contexify/ReactContexify.css';

import '../../../css/Builder/Preview/PreviewComponents.css';

import ComponentManager from '../ComponentManager';
import { getComponentsFromAPI, addComponentToAPI, editComponentToAPI, deleteComponentToAPI, duplicateComponentToAPI } from '../../api';


const MENU_ID = 'blahblah';

function PreviewComponents({ previewId, selectedComponent, setSelectedComponent, propertyWasUpdated, showNotification, componentToAdd, updateComponentProperties, onOrderUpdated }) {
  const [components, setComponents] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [componentToDelete, setComponentToDelete] = useState(null);
  const [draggingComponent, setDraggingComponent] = useState(null);
  const [draggingComponentOver, setDraggingComponentOver] = useState(null);
  const [componentLoading, setComponentLoading] = useState(null);
  const [orderableComponent, setOrderableComponent] = useState(null);
  const [originalIndex, setOriginalIndex] = useState(null);
  const [contextMenuComponentId, setContextMenuComponentId] = useState(null);
  
  let componentManager = new ComponentManager(previewId);

  useEffect(() => {
    loadComponents();
  }, [previewId]);

  useEffect(() => {
    if (components && components.length > 0) {
      componentManager.components = components;
    }
  }, [components]);

  useEffect(() => {
    setDraggingComponent(componentToAdd);
  }, [componentToAdd]);

  useEffect(() => {
    const handleKeyPress = (e) => {

      if (orderableComponent) {

        const parentId = orderableComponent.parent_id;
        const parentComponent = componentManager.findComponentByIdRecursive(parentId, componentManager.components);

        if (!parentComponent || !parentComponent.children) {
          return;
        }

        const siblings = parentComponent.children;
        let currentIndex = siblings.findIndex(comp => comp.id === orderableComponent.id);

        if (currentIndex === -1) {
          return;
        }

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
            const parentId = orderableComponent.parent_id;
            const parentComponent = componentManager.findComponentByIdRecursive(parentId, componentManager.components);
            if (parentComponent && parentComponent.children) {
              const currentIndex = parentComponent.children.findIndex(comp => comp.id === orderableComponent.id);
              const [moved] = parentComponent.children.splice(currentIndex, 1);
              parentComponent.children.splice(originalIndex, 0, moved);
              parentComponent.children = siblings;
              componentManager.components = componentManager.updateComponentInTree(parentComponent);
              setComponents(componentManager.components);
            }
          }
          setSelectedComponent(orderableComponent);
          setOrderableComponent(null);
          setOriginalIndex(null);
        }
        
        parentComponent.children = siblings;
        componentManager.components = componentManager.updateComponentInTree(parentComponent);
        setComponents(componentManager.components);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [orderableComponent]);


  const handleEditComponentOrder = async (newIndex) => {
      setComponentLoading(orderableComponent.id);
      setOrderableComponent(null);
        
      try {
        await editComponentToAPI(orderableComponent.id, { position: newIndex });
        setSelectedComponent(orderableComponent);
        setComponentLoading(null);
      } catch (error) {
        setComponentLoading(null);
        setOrderableComponent(null);
        console.error('Error al mover el componente:', error);
        showNotification('error', error.message);
      }
    };


  const makeComponentOrderable = (component) => {
    const parentId = component.parent_id;
    const parentComponent = componentManager.findComponentByIdRecursive(parentId, componentManager.components);
    if (parentComponent && parentComponent.children) {
      const index = parentComponent.children.findIndex(comp => comp.id === component.id);
      setOriginalIndex(index);
    }
    
    setOrderableComponent(component);
    setSelectedComponent(null);
  };

  const loadComponents = async () => {
    try {
      if(componentManager.isUpdateRequired()) {
        const componentsData = await getComponentsFromAPI(previewId);
        const convertJsonToTree = componentManager.convertJsonToTree(componentsData)
        componentManager.saveLastUpdatedTime();
        componentManager.components = convertJsonToTree
        setComponents(convertJsonToTree);
      } else {
        setComponents(componentManager.components);
      }
    } catch (error) {
      setComponents([]);
      console.error('Error al cargar componentes:', error);
      showNotification('error', 'Error al cargar componentes:');
    }
  };

  const deleteComponent = async (compToDelete) => { 
    if (['Header', 'Body', 'Footer'].includes(compToDelete.component_type)) {
      return;
    }

    setShowDeleteModal(false);

    setComponentToDelete(compToDelete);
    setComponentLoading(compToDelete.id);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      await deleteComponentToAPI(componentToDelete.id);
      componentManager.removeComponent(componentToDelete.id);
      setComponents(componentManager.components);
      showNotification('success', 'Componentes eliminado exitosamente.');
      setComponentLoading(null);
      setSelectedComponent(null);
    } catch (error) {
      setComponentLoading(null);
      console.error('Error al eliminar el componente:', error);
      showNotification('error', 'Error al eliminar el componente.');
      setSelectedComponent(null);
    }
  };

  const handleToggleExpanded = (id) => 
    setComponents(prevComponents => toggleExpanded(id, prevComponents));
  
   const toggleExpanded = (targetId, currentComponents) => 
    currentComponents.map(component => {
      if (component.id === targetId) {
        return { ...component, expanded: !component.expanded };
      }
      if (component.children && component.children.length > 0) {
        return { ...component, children: toggleExpanded(targetId, component.children) };
      }
      return component;
    });


  const handleDragStart = (event, component) => {
      if (['Header', 'Body', 'Footer'].includes(component.component_type)) {
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

  const handleDrop = async (event, parentId) => {
    event.preventDefault();
    event.stopPropagation();

    draggingComponent["parent_id"] = parentId;
    setComponentLoading(draggingComponent.id);

    if (draggingComponent.isNew) {
      try {
        componentManager.addComponentChild(parentId, draggingComponent);
        setComponents(componentManager.components);
        
        await new Promise(resolve => setTimeout(resolve, 500));
        const savedComponent = await addComponentToAPI(previewId, draggingComponent);
        savedComponent.isNew = false;
        setComponentLoading(null);
        setDraggingComponent(null);
        componentManager.removeComponent(draggingComponent.id);
        const convertJsonToTree = componentManager.convertJsonToTree(savedComponent, parentId);
        if (convertJsonToTree, convertJsonToTree.length > 0) {
          componentManager.saveLastUpdatedTime();
          componentManager.addComponentChild(parentId, convertJsonToTree[0]);
          setComponents(componentManager.components);
        }
        showNotification('success', 'Componente agregado exitosamente.');
        setSelectedComponent(convertJsonToTree);
      } catch (error) {
        setComponentLoading(null);
        setDraggingComponent(null);
        console.error('Error al agregar el componente:', error);
        showNotification('error', 'Error al agregar el componente.');
        componentManager.removeComponent(draggingComponent.id);
        setComponents(componentManager.components);
        setSelectedComponent(null);
      }
    } else {
      try {
        componentManager.moveComponent(draggingComponent.id, parentId);
        setComponents(componentManager.components);
        await new Promise(resolve => setTimeout(resolve, 500));
        await editComponentToAPI(draggingComponent.id, { parent_id: parentId });
        setComponents(componentManager.components);
        setComponentLoading(null);
        setDraggingComponent(null);
        showNotification('success', 'Componente movido exitosamente.');
        setSelectedComponent(draggingComponent);
      } catch (error) {
        setComponentLoading(null);
        setDraggingComponent(null);
        console.error('Error al mover el componente:', error);
        showNotification('error', error.message);
        setSelectedComponent(null);
      }
    }
  };

  const duplicateComponent = async (compId) => {
    const compToDuplicate = componentManager.findComponentByIdRecursive(compId, componentManager.components);

    if (!compToDuplicate) {
      showNotification('error', 'Error duplicating component. Component not found.');
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const componentsData = await duplicateComponentToAPI(compToDuplicate.id);
      const convertJsonToTree = componentManager.convertJsonToTree(componentsData, compToDuplicate.parent_id);
      if (convertJsonToTree, convertJsonToTree.length > 0) {
        componentManager.saveLastUpdatedTime();
        componentManager.addComponentChild(compToDuplicate.parent_id, convertJsonToTree[0], compToDuplicate.position);
        setComponents(componentManager.components);
      }
      showNotification('success', 'Component duplicated successfully.');
    } catch (error) {
      console.error('Error duplicating component:', error);
      showNotification('error', 'Error duplicating component.');
    }
  };

  const getCustomizations = (component_type) => {
    const customizations = {
      'Header': { class: 'component-type-header', label: '', enableDrag: false },
      'Body': { class: 'component-type-body', label: '', enableDrag: false },
      'Footer': { class: 'component-type-footer', label: '', enableDrag: false },
      'default': { class: '', label: '', enableDrag: true },
    };

    return customizations[component_type] || customizations['default'];
  };

  const computeClassNames = (comp, draggingComponent, selectedComponent, draggingComponentOver, orderableComponent) => {
    let classes = "component-item ";

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

    if (component && ['Header', 'Body', 'Footer'].includes(component.component_type)) {
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
    widgetType: oldComponent.property?.data?.component_type || oldComponent.component_type,
    commonStyleIds: [], // Puedes añadir aquí según necesites
    children: oldComponent.children.map(convertOldToNew)
  };

  return newComponent;
}

function convertToNewStructure(oldJson) {
  const uiWidgets = oldJson.map(convertOldToNew);
  const newJson = {
    uiWidgets,
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
    component_type: newComponent.widgetType,
    parent_id: null, // Esto tendrás que ajustarlo según tu lógica
    children: newComponent.children.map(convertNewToOld),
    property: {} // Completar según las necesidades
  };

  return oldComponent;
}

function convertToOldStructure(newJson) {
  const oldComponents = newJson.uiWidgets.map(convertNewToOld);
  return oldComponents;
}



const renderComponentList = (compArray, parentId = null) => 
  compArray.map(comp => {
    if (!comp || !comp.component_type) {
      console.error('Invalid component:', comp);
      return null;
    }

    const { id, component_type, property } = comp;
    const { class: customClass, label: customLabel, enableDrag } = getCustomizations(component_type);

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
          className={`component-item ${computeClassNames(comp, draggingComponent, selectedComponent, draggingComponentOver, orderableComponent)}`}
          onClick={() => {
            setSelectedComponent(comp);
          }}
          onContextMenu={(e) => handleContextMenu(e, comp)}
        >
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <div style={{display: 'flex', alignItems: 'center'}}>
              <span className="toggle-btn" onClick={(e) => { e.stopPropagation(); handleToggleExpanded(comp.id); }}>
                {comp.expanded ?  <i className="bi bi-node-minus"></i> : <i className="bi bi-node-plus-fill"></i>}
              </span>
              <span>{comp.component_type ? comp.component_type : 'N/A'}</span>
            </div>
            
          </div>
            {componentLoading && comp.id === componentLoading && (
              <div className="component-actions">
                <Spinner animation="border" size="sm" />
              </div>
            )}
        </div>

        {comp.expanded && comp.children && comp.children.length > 0 && 
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
