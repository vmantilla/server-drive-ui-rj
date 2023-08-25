import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import '../../../css/Builder/Preview/PreviewComponents.css';
import { deleteComponentRecursive, addComponentChildRecursive, moveComponent, isDescendant } from '../../Utils/treeUtils';
import { getComponentsFromAPI, addComponentToAPI, deleteComponentToAPI } from '../../api';

function PreviewComponents({ setIsPropertiesOpen, projectId, selectedScreen, showNotification }) {
  const [components, setComponents] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [componentToDelete, setComponentToDelete] = useState(null);
  const [draggingComponent, setDraggingComponent] = useState(null);
  const [selectedComponentId, setSelectedComponentId] = useState(null);

  useEffect(() => {
    const loadComponents = async () => {
      try {
        const componentsData = await getComponentsFromAPI(selectedScreen);
        setComponents(componentsData);
      } catch (error) {
        console.error('Error al cargar componentes:', error);
        showNotification('error', 'Error al cargar componentes:');
      }
    };

    loadComponents();
  }, [projectId, selectedScreen]);


  const deleteComponentToApi = async (compToDeleteId) => {
    try {
      await deleteComponentToAPI(compToDeleteId);
      showNotification('success', 'Componentes eliminado exitosamente.');
    } catch (error) {
      console.error('Error al guardar componentes:', error);
      showNotification('error', 'Error al guardar los componentes.');
    }
  };

  const handleToggleExpanded = (id) => 
    setComponents(prevComponents => toggleExpanded(id, prevComponents));

  
  const deleteComponent = (compToDelete) => {
    setComponents(prevComponents => deleteComponentRecursive(compToDelete.id, prevComponents));
    deleteComponentToApi(compToDelete.id)
    setShowDeleteModal(false);
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

  const handleDragStart = (event, component) => {
  event.dataTransfer.setData('text/plain', component.type);
  event.dataTransfer.setData('source', "tree");
  event.stopPropagation();
  setDraggingComponent(component);

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

const handleDrop = async (event, parentId) => {
  event.preventDefault();
  event.stopPropagation();

  const source = event.dataTransfer.getData('source');

  if (source === 'header') {
    const componentData = event.dataTransfer.getData('component');
    const newComponent = JSON.parse(componentData);

    // Actualizamos primero el estado local
    setComponents(prevComponents => addComponentChildRecursive(parentId, components, newComponent));
    setDraggingComponent(null);

    // Luego llamamos a la API para sincronizar el estado
    try {
      newComponent["parent_id"] = parentId;
      await addComponentToAPI(selectedScreen, newComponent);  // Asumiendo que tienes una función para hacer esto
      showNotification('success', 'Componente agregado exitosamente.');
    } catch (error) {
      console.error('Error al agregar el componente:', error);
      showNotification('error', 'Error al agregar el componente.');
      // Aquí puedes decidir si deseas revertir el cambio en el estado local
    }

  } else if (source === 'tree') {
    if (draggingComponent) {
      try {
        const newComponents = moveComponent(draggingComponent.id, parentId, components);
        setComponents(newComponents);
        // Aquí también puedes llamar a tu API si necesitas sincronizar este cambio
      } catch (error) {
        console.error(error.message);
      }
    }
  }

  if (event.currentTarget) {
    event.currentTarget.classList.remove('ready-for-drop');
  }

  setDraggingComponent(null);
};



  const renderComponentList = (compArray, parentId = null) => 
  compArray.map(comp => {
    // Safety check: if comp or comp.property is undefined, log an error and skip this iteration.
    if (!comp || !comp.property) {
      console.error('Invalid component:', comp);
      return null;
    }

    return (
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
            <span>{comp.property ? comp.property.data.component_type : 'N/A'}</span>
          </div>

          {comp.id === selectedComponentId && (
            <div className="component-actions">
              <span className="icon-btn delete-btn" onClick={(e) => { e.stopPropagation(); setShowDeleteModal(true); setComponentToDelete(comp); }}>
                <i className="bi bi-trash"></i>
              </span>
            </div>
          )}
        </div>

        {/* Safety check: before accessing the length property of children, ensure that comp.children is defined */}
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
