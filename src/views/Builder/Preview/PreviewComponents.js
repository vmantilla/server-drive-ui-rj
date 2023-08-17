import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import '../../../css/Builder/Preview/PreviewComponents.css';
import { deleteComponentRecursive, addComponentChildRecursive, removeComponent, moveComponent, isDescendant } from '../../Utils/treeUtils';

function PreviewComponents({ setIsPropertiesOpen }) {
  const [components, setComponents] = useState(initialComponents());
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [componentToDelete, setComponentToDelete] = useState(null);
  const [draggingComponent, setDraggingComponent] = useState(null);
  const [selectedComponentId, setSelectedComponentId] = useState(null);

  function initialComponents() {
    return [
      { id: 1, type: 'Texto', children: [], expanded: false },
      { id: 2, type: 'Imagen', children: [], expanded: false },
      { id: 3, type: 'Botón', children: [], expanded: false }
    ];
  }

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

  const addComponentChild = (parentId) => {
    const child = { id: Date.now(), type: `Hijo`, children: [], expanded: false };
    setComponents(prevComponents => addComponentChildRecursive(parentId, prevComponents, child));
  };

  const handleDragStart = (event, component) => {
  event.dataTransfer.setData('text/plain', component.type);
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
  const currentElement = event.currentTarget;
  if (draggingComponent.id !== componentId) {
    if (isDescendant(draggingComponent, componentId)) {
      // No permitir soltar en un descendiente.
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

  if (draggingComponent) {
    try {
      const newComponents = moveComponent(draggingComponent.id, parentId, components);
      setComponents(newComponents);
    } catch (error) {
      console.error(error.message);
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
            {comp.expanded ?  <i class="bi bi-node-minus"></i> : <i class="bi bi-node-plus-fill"></i>}
        </span>
        <span>{comp.type}</span>
    </div>
  {
    comp.id === selectedComponentId && (
      <div className="component-actions">
        <span className="icon-btn add-child-btn" onClick={(e) => { e.stopPropagation(); addComponentChild(comp.id); }}>
          <i className="bi bi-plus-circle"></i>
        </span>
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
      {renderComponentList(components)}
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
