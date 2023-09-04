import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Modal from 'react-bootstrap/Modal';
import '../../../css/Builder/Preview/PreviewComponents.css';
import { debounce } from 'lodash';

import ComponentManager from '../ComponentManager';
import { getComponentsFromAPI, addComponentToAPI, editComponentToAPI, deleteComponentToAPI } from '../../api';

function PreviewComponents({ previewId, selectedComponent, setSelectedComponent, showNotification, componentToAdd, updateProperties }) {
  const [components, setComponents] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [componentToDelete, setComponentToDelete] = useState(null);
  const [draggingComponent, setDraggingComponent] = useState(null);
  const [draggingComponentOver, setDraggingComponentOver] = useState(null);
  const [componentLoading, setComponentLoading] = useState(null);
  
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
    if (updateProperties !== null) {
      componentManager.updateComponentProperties(updateProperties.component.id, updateProperties.newProperties);
      setComponents([...componentManager.components]);
    }
  }, [updateProperties]);


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

    setComponentToDelete(compToDelete);
    setComponentLoading(compToDelete.id);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      await deleteComponentToAPI(componentToDelete.id);
      componentManager.removeComponent(componentToDelete.id);
      setComponents([...componentManager.components]);
      showNotification('success', 'Componentes eliminado exitosamente.');
      setComponentLoading(null);
    } catch (error) {
      setComponentLoading(null);
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
        componentManager.addComponentChild(parentId, savedComponent);
        setComponents(componentManager.components);
        showNotification('success', 'Componente agregado exitosamente.');
      } catch (error) {
        setComponentLoading(null);
        setDraggingComponent(null);
        console.error('Error al agregar el componente:', error);
        showNotification('error', 'Error al agregar el componente.');
        componentManager.removeComponent(draggingComponent.id);
        setComponents(componentManager.components);
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
      } catch (error) {
        setComponentLoading(null);
        setDraggingComponent(null);
        console.error('Error al mover el componente:', error);
        showNotification('error', error.message);
      }
    }
  };

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

const renderComponentList = (compArray, parentId = null) => 
  compArray.map(comp => {
    if (!comp || !comp.property) {
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
          className={`component-item ${computeClassNames(comp, draggingComponent, selectedComponent, draggingComponentOver)}`}
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
            {componentLoading && comp.id === componentLoading && (
              <div className="component-actions">
                <Spinner animation="border" size="sm" />
              </div>
            )}
          {selectedComponent && comp.id === selectedComponent.id && !(componentToDelete && componentToDelete.id === comp.id && componentLoading != null) && !['Header', 'Body', 'Footer'].includes(comp.component_type) && (
            <div className="component-actions">
              <span className="icon-btn delete-btn" onClick={(e) => { e.stopPropagation(); setShowDeleteModal(true); setComponentToDelete(comp); }}>
                <i className="bi bi-trash"></i>
              </span>
            </div>
          )}
        </div>

        {comp.expanded && comp.children && comp.children.length > 0 && 
          <div className="component-children">
            {renderComponentList(comp.children, comp.id)}
          </div>
        }
      </div>
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
