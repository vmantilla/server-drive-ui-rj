import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import '../../css/Builder/BuilderComponents.css';

function BuilderComponents({ setIsPropertiesOpen }) {
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

  const deleteComponentRecursive = (idToDelete, currentComponents) => 
    currentComponents.filter(comp => comp.id !== idToDelete).map(component => {
      if (component.children.length > 0) {
        component.children = deleteComponentRecursive(idToDelete, component.children);
      }
      return component;
    });

  const deleteComponent = (compToDelete) => {
    setComponents(prevComponents => deleteComponentRecursive(compToDelete.id, prevComponents));
    setShowDeleteModal(false);
  };

  const addComponentChildRecursive = (parentId, currentComponents, childComponent) => 
    currentComponents.map(component => {
      if (component.id === parentId) {
        return { ...component, children: [...component.children, childComponent] };
      }
      if (component.children.length > 0) {
        return { ...component, children: addComponentChildRecursive(parentId, component.children, childComponent) };
      }
      return component;
    });

  const addComponentChild = (parentId) => {
    const child = { id: Date.now(), type: `Hijo`, children: [], expanded: false };
    setComponents(prevComponents => addComponentChildRecursive(parentId, prevComponents, child));
  };

  const handleDragStart = (event, component) => {
    event.dataTransfer.setData('text/plain', component.type);
    event.stopPropagation();
    setDraggingComponent(component);
  };

  const handleDragEnterLeaveOrOver = (event, componentId, isOver = false) => {
    event.stopPropagation();
    if (draggingComponent.id !== componentId && !isDescendant(draggingComponent, componentId)) {
      if (isOver) {
        event.preventDefault();
        event.currentTarget.classList.add('ready-for-drop');
      } else {
        event.currentTarget.classList.remove('ready-for-drop');
      }
    }
  };

  const removeComponent = (componentId, currentComponents) => 
    currentComponents.reduce((acc, component) => {
      if (component.id !== componentId) {
        if (component.children.length) {
          component.children = removeComponent(componentId, component.children);
        }
        acc.push(component);
      }
      return acc;
    }, []);

  const isDescendant = (parentComponent, targetId) => {
    for (let child of parentComponent.children) {
      if (child.id === targetId || isDescendant(child, targetId)) {
        return true;
      }
    }
    return false;
  };

  const handleDrop = (event, parentId) => {
    event.preventDefault();
    event.stopPropagation();
    if (draggingComponent && draggingComponent.id !== parentId && !isDescendant(draggingComponent, parentId)) {
      const updatedComponents = removeComponent(draggingComponent.id, components);
      const newComponents = addComponentChildRecursive(parentId, updatedComponents, draggingComponent);
      setComponents(newComponents);
    }
    event.currentTarget.classList.remove('ready-for-drop');
    setDraggingComponent(null);
  };

  const handleDragEnd = () => {
  // Limpiar el estado del componente que se está arrastrando.
  setDraggingComponent(null);

  // Limpiar las clases de cualquier componente que se haya resaltado como destino de soltado.
  const dropTargets = document.querySelectorAll('.drop-target');
  dropTargets.forEach(target => {
    target.classList.remove('drop-target', 'ready-for-drop');
  });
};


  const renderComponentList = (compArray, parentId = null) => 
    compArray.map(comp => (
      <div key={comp.id}>
        <div
          draggable={comp.id !== parentId}
          onDragStart={(e) => handleDragStart(e, comp)}
          onDragEnd={handleDragEnd}  // Aquí está el nuevo controlador
          onDragOver={(e) => handleDragEnterLeaveOrOver(e, comp.id, true)}
          onDrop={(e) => handleDrop(e, comp.id)}
          onDragEnter={(e) => handleDragEnterLeaveOrOver(e, comp.id)}
          onDragLeave={handleDragEnterLeaveOrOver}
          className={`component-item ${comp === draggingComponent ? 'dragging' : ''} ${draggingComponent && comp.id !== draggingComponent.id ? 'drop-target' : ''}`}
          onClick={() => {
            setIsPropertiesOpen(true);
            setSelectedComponentId(comp.id);
          }}>
          <span className="toggle-btn" onClick={(e) => { e.stopPropagation(); handleToggleExpanded(comp.id); }}>{comp.expanded ? '-' : '+'}</span>
          <span>{comp.type}</span>
          {
            comp.id === selectedComponentId && (
              <>
                <span className="icon-btn add-child-btn" onClick={(e) => { e.stopPropagation(); addComponentChild(comp.id); }}>
                        <i className="bi bi-plus-circle"></i>
                    </span>
                    <span className="icon-btn delete-btn" onClick={(e) => { e.stopPropagation(); setShowDeleteModal(true); setComponentToDelete(comp); }}>
                      <i className="bi bi-trash"></i>
                    </span>
              </>
            )
          }
         </div>
        {comp.expanded && comp.children.length > 0 && <div className="component-children">{renderComponentList(comp.children, comp.id)}</div>}
      </div>
    ));

  return (
    <div className="buildercomponents">
      <span className="workspaces-title">Components</span>
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

export default BuilderComponents;
