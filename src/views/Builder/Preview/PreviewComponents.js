import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Modal from 'react-bootstrap/Modal';
import '../../../css/Builder/Preview/PreviewComponents.css';
import { debounce } from 'lodash';

import ComponentManager from '../ComponentManager';
import { getComponentsFromAPI, addComponentToAPI, editComponentToAPI, deleteComponentToAPI } from '../../api';

function PreviewComponents({ previewId, selectedComponent, setSelectedComponent, showNotification }) {
  const [components, setComponents] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [componentToDelete, setComponentToDelete] = useState(null);
  const [draggingComponent, setDraggingComponent] = useState(null);
  const [draggingComponentOver, setDraggingComponentOver] = useState(null);
  
  let componentManager = new ComponentManager(previewId);

  useEffect(() => {
    loadComponents();
  }, [previewId]);

  useEffect(() => {
    if (components && components.length > 0) {
      componentManager.components = components;
    }
  }, [components]);


  const loadComponents = async () => {
    try {
      if(componentManager.isUpdateRequired()) {
        const componentsData = await getComponentsFromAPI(previewId);
        componentManager.saveLastUpdatedTime();
        setComponents(componentsData);
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

    setComponentToDelete({ ...compToDelete, loading: true });
    
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    try {
      await deleteComponentToAPI(componentToDelete.id);
      componentManager.removeComponent(componentToDelete.id);
      setComponents([...componentManager.components]);
      showNotification('success', 'Componentes eliminado exitosamente.');
      setComponentToDelete({ ...compToDelete, loading: false });
    } catch (error) {
      setComponentToDelete({ ...compToDelete, loading: false });
      console.error('Error al eliminar el componente:', error);
      showNotification('error', 'Error al eliminar el componente.');
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
        console.log("handleDragStart", component.component_type);
        return;
      }
      event.dataTransfer.setData('text/plain', component.type);
      event.dataTransfer.setData('source', "tree");
      event.stopPropagation();
      console.log("setDraggingComponent", component)
      setDraggingComponent(component);
    };

  const handleDragEnd = () => {
      setDraggingComponent(null);
    };

  const handleDragEnterLeaveOrOver = (event, componentId) => {
    setDraggingComponentOver(componentId);
  };

  const handleDrop = async (event, parentId) => { };

//   const handleDragEnterLeaveOrOver = (event, componentId, isOver = false) => {
//   event.preventDefault();
//   event.stopPropagation();
//   const source = event.dataTransfer.getData('source');
//   const currentElement = event.currentTarget;

//   if (source === 'header') {
//     if (isOver) {
//           currentElement.classList.remove('disabled-drop');
//           currentElement.classList.add('ready-for-drop');
//         } else {
//           currentElement.classList.remove('ready-for-drop');
//         }
  
//   } else if (source === 'tree') {
//     if (draggingComponent.id !== componentId) {
//       if (componentManager.isDescendant(draggingComponent, componentId)) {
//         currentElement.classList.add('disabled-drop');
//         currentElement.classList.remove('ready-for-drop');
//       } else {
//         if (isOver) {
//           currentElement.classList.remove('disabled-drop');
//           currentElement.classList.add('ready-for-drop');
//         } else {
//           currentElement.classList.remove('ready-for-drop');
//         }
//       }
//     }
//   }  
// };


// const handleDragEnd = () => {
//   // Limpiar el estado del componente que se está arrastrando.
//   setDraggingComponent(null);

//   // Limpiar las clases de cualquier componente que se haya resaltado como destino de soltado.
//   const dropTargets = document.querySelectorAll('.ready-for-drop');
//   dropTargets.forEach(target => {
//     target.classList.remove('ready-for-drop');
//   });
// };


// const handleComponentDrop = async (event, parentId, newComponent) => {
//   const tempId = Date.now();
//   newComponent["id"] = tempId;
//   newComponent["loading"] = true;
//   newComponent["parent_id"] = parentId;

//   componentManager.addComponentChild(parentId, newComponent);
//   setComponents(componentManager.components);

//   try {
//     await new Promise(resolve => setTimeout(resolve, 500));
//     const savedComponent = await addComponentToAPI(previewId, newComponent);

//     componentManager.removeComponent(tempId);
//     componentManager.addComponentChild(parentId, savedComponent);
//     setComponents(componentManager.components);

//     showNotification('success', 'Componente agregado exitosamente.');
//   } catch (error) {
//     console.error('Error al agregar el componente:', error);
//     showNotification('error', 'Error al agregar el componente.');
//     componentManager.removeComponent(tempId);
//     setComponents(componentManager.components);
//   }
// };

// const handleTreeDrop = async (parentId) => {
//   if (!draggingComponent) return;

//   try {
//     componentManager.moveComponent(draggingComponent.id, parentId);
//     setComponents(componentManager.components);

//     await editComponentToAPI(draggingComponent.id, { parent_id: parentId });
//     showNotification('success', 'Componente movido exitosamente.');
//   } catch (error) {
//     console.error('Error al mover el componente:', error);
//     showNotification('error', 'Error al mover el componente.');
//   }
// };

// const handleDrop = async (event, parentId) => {
//   event.preventDefault();
//   event.stopPropagation();

//   const source = event.dataTransfer.getData('source');

//   if (source === 'header') {
//     const componentData = event.dataTransfer.getData('component');
//     const newComponent = JSON.parse(componentData);
//     await handleComponentDrop(event, parentId, newComponent);
//   } else if (source === 'tree') {
//     await handleTreeDrop(parentId);
//   }

//   if (event.currentTarget) {
//     event.currentTarget.classList.remove('ready-for-drop');
//   }

//   setDraggingComponent(null);
// };


const getCustomizations = (component_type) => {
  const customizations = {
    'Header': { class: 'component-type-header', label: 'HEADER', enableDrag: false },
    'Body': { class: 'component-type-body', label: 'BODY', enableDrag: false },
    'Footer': { class: 'component-type-footer', label: 'FOOTER', enableDrag: false },
    'default': { class: '', label: '', enableDrag: true },
  };

  return customizations[component_type] || customizations['default'];
};

 const computeClassNames = (comp, draggingComponent, selectedComponent, draggingComponentOver) => {
    let classes = "component-item ";

    // Logic for drag-and-drop states
    if (draggingComponent) {
      if (comp.id === draggingComponent.id) {
        classes += "disabled-drop ";
      } else {
        classes += "drop-target ";
      }
    }

    // Logic for ready-for-drop state
    if (draggingComponentOver && comp.id === draggingComponentOver) {
      classes += "ready-for-drop ";
    } else {
      // Logic for selected state (applied only if there's no draggingComponentOver)
      if (selectedComponent && selectedComponent.id === comp.id) {
        classes += "selected ";
      }
    }

    return classes;
  };

  const renderComponentList = (compArray, parentId = null) => 
  compArray.map(comp => {
    if (!comp || !comp.property) {
      console.error('Invalid component:', comp);
      return null;
    }

    const { id, component_type, property } = comp;
    const { class: customClass, label: customLabel, enableDrag } = getCustomizations(component_type);

    const CommonContent = (
      <>
        <div
          draggable={id !== parentId && enableDrag}
          onDragStart={(e) => handleDragStart(e, comp)}
          onDragEnd={handleDragEnd}
          onDragOver={(e) => handleDragEnterLeaveOrOver(e, id)}
          onDrop={(e) => handleDrop(e, id)}
          onDragLeave={(e) => handleDragEnterLeaveOrOver(e, null)}
          className={`${computeClassNames(comp, draggingComponent, selectedComponent, draggingComponentOver)}`}
          onClick={() => {
            setSelectedComponent(comp);
          }}
        >
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <div style={{display: 'flex', alignItems: 'center'}}>
              <span className="toggle-btn" onClick={(e) => { e.stopPropagation(); handleToggleExpanded(comp.id); }}>
                {comp.expanded ?  <i className="bi bi-node-minus"></i> : <i className="bi bi-node-plus-fill"></i>}
              </span>
              <span>{comp.property ? comp.property.data.component_type : 'N/A'}</span>
            </div>
            
          </div>
            {componentToDelete && comp.id === componentToDelete.id && componentToDelete.loading && (
              <div className="component-actions">
                <Spinner animation="border" size="sm" />
              </div>
            )}
          {selectedComponent && comp.id === selectedComponent.id && !(componentToDelete && componentToDelete.id === comp.id && componentToDelete.loading) && !['Header', 'Body', 'Footer'].includes(comp.component_type) && (
            <div className="component-actions">
              <span className="icon-btn delete-btn" onClick={(e) => { e.stopPropagation(); setShowDeleteModal(true); setComponentToDelete(comp); }}>
                <i className="bi bi-trash"></i>
              </span>
            </div>
          )}
        </div>
        {comp.expanded && comp.children && comp.children.length > 0 && 
          <div className="component-children">
            {renderComponentList(comp.children, id)}
          </div>
        }
      </>
    );

    return (
      <>
        {customLabel ? (
          <div key={id} className={customClass}>
            <div className="custom-label">{customLabel}</div>
            {CommonContent}
          </div>
        ) : (
          CommonContent
        )}
      </>
    );
  });


  return (
    <div className="buildercomponents">
      <span className="component-title">Components</span>
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
