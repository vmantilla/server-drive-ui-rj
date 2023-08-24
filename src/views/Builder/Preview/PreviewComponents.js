import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import '../../../css/Builder/Preview/PreviewComponents.css';
import { deleteComponentRecursive, addComponentChildRecursive, moveComponent, isDescendant } from '../../Utils/treeUtils';
import { getComponentsFromAPI, saveComponentsToAPI } from '../../api';

function PreviewComponents({ setIsPropertiesOpen, projectId, selectedScreen, showNotification }) {
  const [components, setComponents] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [componentToDelete, setComponentToDelete] = useState(null);
  const [draggingComponent, setDraggingComponent] = useState(null);
  const [selectedComponentId, setSelectedComponentId] = useState(null);

  useEffect(() => {
    const loadComponents = async () => {
      try {
        const componentsData = await getComponentsFromAPI(projectId, selectedScreen);
        setComponents(componentsData);
      } catch (error) {
        console.error('Error al cargar componentes:', error);
        showNotification('error', 'Error al cargar componentes:');
      }
    };

    loadComponents();
  }, [projectId, selectedScreen]);

  const saveComponents = async () => {
    try {
      await saveComponentsToAPI(projectId, selectedScreen, components);
      showNotification('success', 'Componentes guardados exitosamente.');
    } catch (error) {
      console.error('Error al guardar componentes:', error);
      showNotification('error', 'Error al guardar los componentes.');
    }
  };

  const toggleExpanded = (targetId, currentComponents) => 
    currentComponents.map(component => {
      if (component.id === targetId) {
        return { ...component, expanded: !component.expanded };
      }
      if (component.children.length > 0) {
        return { ...component, children: toggleExpanded(targetId, component.children) };
      }
      return component;
    });

  const handleToggleExpanded = (id) => 
    setComponents(prevComponents => toggleExpanded(id, prevComponents));

  
  const deleteComponent = (compToDelete) => {
    setComponents(prevComponents => deleteComponentRecursive(compToDelete.id, prevComponents));
    setShowDeleteModal(false);
  };

  const handleDragStart = (event, component) => {
  event.dataTransfer.setData('text/plain', component.type);
  event.dataTransfer.setData('source', "tree");
  event.stopPropagation();
  setDraggingComponent(component);

  // Aplicar el estilo disabled-drop a los componentes que no pueden recibir el componente que se está arrastrando.
  const componentItems = document.querySelectorAll('.component-item');
  componentItems.forEach(item => {
    const componentId = parseInt(item.getAttribute('data-id'));
    if (isDescendant(component, componentId)) {
      item.classList.add('disabled-drop');
      item.classList.remove('ready-for-drop');
    }
  });
};

  const handleDragEnterLeaveOrOver = (event, componentId, isOver = false) => {
  event.preventDefault();
  event.stopPropagation();
  const source = event.dataTransfer.getData('source');
  const currentElement = event.currentTarget;

  if (source === 'header') {
    if (isOver) {
          currentElement.classList.remove('disabled-drop');
          currentElement.classList.add('ready-for-drop');
        } else {
          currentElement.classList.remove('ready-for-drop');
        }
  
  } else if (source === 'tree') {
    if (draggingComponent.id !== componentId) {
      if (isDescendant(draggingComponent, componentId)) {
        currentElement.classList.add('disabled-drop');
        currentElement.classList.remove('ready-for-drop');
      } else {
        if (isOver) {
          currentElement.classList.remove('disabled-drop');
          currentElement.classList.add('ready-for-drop');
        } else {
          currentElement.classList.remove('ready-for-drop');
        }
      }
    }
  }  
};


const handleDragEnd = () => {
  // Limpiar el estado del componente que se está arrastrando.
  setDraggingComponent(null);

  // Limpiar las clases de cualquier componente que se haya resaltado como destino de soltado.
  const dropTargets = document.querySelectorAll('.ready-for-drop');
  dropTargets.forEach(target => {
    target.classList.remove('ready-for-drop');
  });
};

const handleDrop = (event, parentId) => {
  event.preventDefault();
  event.stopPropagation();

  const source = event.dataTransfer.getData('source');

  if (source === 'header') {
    const componentData = event.dataTransfer.getData('component');
    const newComponent = JSON.parse(componentData);
    console.log(newComponent);
    setComponents(prevComponents => addComponentChildRecursive(parentId, components, newComponent));
    setDraggingComponent(null);
  } else if (source === 'tree') {
    if (draggingComponent) {
      try {
        const newComponents = moveComponent(draggingComponent.id, parentId, components);
        setComponents(newComponents);
      } catch (error) {
        console.error(error.message);
      }
    }
  }

  event.currentTarget.classList.remove('ready-for-drop');
  setDraggingComponent(null);
};



  const renderComponentList = (compArray, parentId = null) => 
    compArray.map(comp => (
      <div key={comp.id}>
        <div
          draggable={comp.id !== parentId}
          onDragStart={(e) => handleDragStart(e, comp)}
          onDragEnd={handleDragEnd}
          onDragOver={(e) => handleDragEnterLeaveOrOver(e, comp.id, true)}
          onDrop={(e) => handleDrop(e, comp.id)}
          onDragEnter={(e) => handleDragEnterLeaveOrOver(e, comp.id)}
          onDragLeave={handleDragEnterLeaveOrOver}
          className={`component-item ${comp === draggingComponent ? 'dragging' : ''} ${draggingComponent && comp.id !== draggingComponent.id ? 'drop-target' : ''} ${selectedComponentId === comp.id ? 'selected' : ''}`}
          onClick={() => {
            setIsPropertiesOpen(true);
            setSelectedComponentId(comp.id);
          }}
        >
          <div style={{display: 'flex', alignItems: 'center'}}>
        <span className="toggle-btn" onClick={(e) => { e.stopPropagation(); handleToggleExpanded(comp.id); }}>
            {comp.expanded ?  <i className="bi bi-node-minus"></i> : <i className="bi bi-node-plus-fill"></i>}
        </span>
        <span>{comp.properties.component_type}</span>
    </div>
  {
    comp.id === selectedComponentId && (
      <div className="component-actions">
        <span className="icon-btn delete-btn" onClick={(e) => { e.stopPropagation(); setShowDeleteModal(true); setComponentToDelete(comp); }}>
          <i className="bi bi-trash"></i>
        </span>
      </div>
    )
  }
         </div>
        {comp.expanded && comp.children.length > 0 && <div className="component-children">{renderComponentList(comp.children, comp.id)}</div>}
      </div>
    ));


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
