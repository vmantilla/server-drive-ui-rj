import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import '../../css/Builder/BuilderComponents.css';

function BuilderComponents({ setIsPropertiesOpen }) {
  const [components, setComponents] = useState([
    { id: 1, type: 'Texto', children: [], expanded: false },
    { id: 2, type: 'Imagen', children: [], expanded: false },
    { id: 3, type: 'Botón', children: [], expanded: false }
    ]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [componentToDelete, setComponentToDelete] = useState(null);
  const [draggingComponent, setDraggingComponent] = useState(null);

  const toggleExpanded = (targetId, currentComponents) => {
    return currentComponents.map(component => {
      if (component.id === targetId) {
        return { ...component, expanded: !component.expanded };
      }
      if (component.children.length > 0) {
        return { ...component, children: toggleExpanded(targetId, component.children) };
      }
      return component;
    });
  };

  const handleToggleExpanded = (id) => {
    setComponents(prevComponents => toggleExpanded(id, prevComponents));
  };

  const deleteComponentRecursive = (idToDelete, currentComponents) => {
    return currentComponents.filter(comp => comp.id !== idToDelete).map(component => {
      if (component.children.length > 0) {
        component.children = deleteComponentRecursive(idToDelete, component.children);
      }
      return component;
    });
  };

  const deleteComponent = (compToDelete) => {
    setComponents(prevComponents => deleteComponentRecursive(compToDelete.id, prevComponents));
    setShowDeleteModal(false);
  };

  const addComponentChildRecursive = (parentId, currentComponents, childComponent) => {
    return currentComponents.map(component => {
      if (component.id === parentId) {
        return { ...component, children: [...component.children, childComponent] };
      }
      if (component.children.length > 0) {
        return { ...component, children: addComponentChildRecursive(parentId, component.children, childComponent) };
      }
      return component;
    });
  };

  const addComponentChild = (parentId) => {
    const child = { id: Date.now(), type: `Hijo`, children: [], expanded: false };
    setComponents(prevComponents => addComponentChildRecursive(parentId, prevComponents, child));
  };

  const handleDragStart = (event, component) => {
    event.dataTransfer.setData('text/plain', component.type);
    event.stopPropagation();  // Agrega esta línea para detener la propagación
    setDraggingComponent(component);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const removeComponent = (componentId, currentComponents) => {
    return currentComponents.reduce((acc, component) => {
        // Si el componente es el que buscamos, no lo incluimos
      if (component.id === componentId) return acc;

        // Si el componente tiene hijos, revisamos dentro de ellos
      if (component.children.length) {
        component.children = removeComponent(componentId, component.children);
      }

        // Incluimos el componente en la lista resultante
      acc.push(component);
      return acc;
    }, []);
  };

  const isDescendant = (parentComponent, targetId) => {
    for (let child of parentComponent.children) {
      if (child.id === targetId) return true;
      if (isDescendant(child, targetId)) return true;
    }
    return false;
  };


  const handleDrop = (event, parentId) => {
    event.preventDefault();
    event.stopPropagation();

    // Si el componente que se está arrastrando tiene el mismo ID que parentId
    if (draggingComponent.id === parentId) {
      setDraggingComponent(null);
        return;  // Terminar la operación de arrastre si intentamos arrastrar un componente dentro de sí mismo.
      }

    // Verificar si el parentId es un descendiente del componente que se está arrastrando
      if (isDescendant(draggingComponent, parentId)) {
        setDraggingComponent(null);
        return; // Detener la ejecución si el parentId es un descendiente
      }

      if (draggingComponent) {
        // 1. Eliminar el componente de su posición original
        const updatedComponents = removeComponent(draggingComponent.id, components);
        // 2. Agregar el componente al nuevo padre
        const newComponents = addComponentChildRecursive(parentId, updatedComponents, draggingComponent);
        setComponents(newComponents);
        setDraggingComponent(null);
      }
    };



    const renderComponentList = (compArray, parentId = null) => {
        return compArray.map(comp => (
            <div 
                key={comp.id} 
                draggable={comp.id !== parentId}
                onDragStart={(event) => handleDragStart(event, comp)}
                onDragOver={handleDragOver}
                onDrop={(event) => handleDrop(event, comp.id)}
                className={`${comp === draggingComponent ? 'dragging' : ''}`}
            >
                <div className={`component-item ${draggingComponent && comp.id !== draggingComponent.id ? 'drop-target' : ''}`} 
                    onClick={() => setIsPropertiesOpen(true)}>
                        <span className="toggle-btn" onClick={(e) => { e.stopPropagation(); handleToggleExpanded(comp.id); }}>{comp.expanded ? '-' : '+'}</span>
                    <span>{comp.type}</span>
                    <Button variant="outline-danger" className="delete-btn" onClick={(e) => { e.stopPropagation(); setShowDeleteModal(true); setComponentToDelete(comp); }}>✖</Button>
                    <Button variant="outline-primary" className="add-child-btn" onClick={(e) => { e.stopPropagation(); addComponentChild(comp.id); }}>+</Button>
               
                </div>
                {comp.expanded && comp.children.length > 0 && <div className="component-children">{renderComponentList(comp.children, comp.id)}</div>}
            </div>
        ));
    };

    return (
        <div className="buildercomponents">
            <h2>Componentes</h2>
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
