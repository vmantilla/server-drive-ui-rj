import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Modal from 'react-bootstrap/Modal';
import '../../../css/Builder/Preview/PreviewComponents.css';
import { deleteComponentRecursive, addComponentChildRecursive, moveComponent, removeComponent, isDescendant } from '../../Utils/treeUtils';
import { getComponentsFromAPI, addComponentToAPI, editComponentToAPI, deleteComponentToAPI } from '../../api';

function PreviewComponents({ setIsPropertiesOpen, projectId, selectedScreen, showNotification, setSelectedComponents, selectedComponent, setSelectedComponent  }) {
  const [components, setComponents] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [componentToDelete, setComponentToDelete] = useState(null);
  const [draggingComponent, setDraggingComponent] = useState(null);
  
  useEffect(() => {
    setSelectedComponents(components);
  }, [components]);

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


  const deleteComponentToApi = async (compToDelete) => {
    if (['Header', 'Body', 'Footer'].includes(compToDelete.component_type)) {
      return;
    }
    compToDelete["loading"] = true;
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      await deleteComponentToAPI(compToDelete.id);
      setComponents(prevComponents => deleteComponentRecursive(compToDelete.id, prevComponents));
      showNotification('success', 'Componentes eliminado exitosamente.');
    } catch (error) {
      compToDelete["loading"] = false;
      console.error('Error al eliminar el componente:', error);
      showNotification('error', 'Error al eliminar el componente.');
    }
  };

  const handleToggleExpanded = (id) => 
    setComponents(prevComponents => toggleExpanded(id, prevComponents));

  
  const deleteComponent = (compToDelete) => {
    if (['Header', 'Body', 'Footer'].includes(compToDelete.component_type)) {
      return;
    }
    deleteComponentToApi(compToDelete)
    setShowDeleteModal(false);
  };

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
  let previousComponents = null;

  if (source === 'header') {
    const componentData = event.dataTransfer.getData('component');
    const newComponent = JSON.parse(componentData);
    const tempId = Date.now(); // Genera un ID temporal único
    
    newComponent["loading"] = true;
    newComponent["id"] = tempId;

    setComponents(prevComponents => addComponentChildRecursive(parentId, prevComponents, newComponent));
    
    try {

      await new Promise(resolve => setTimeout(resolve, 500));

      newComponent["parent_id"] = parentId;
      const savedComponent = await addComponentToAPI(selectedScreen, newComponent);
      console.log("savedComponent", savedComponent);
      setComponents(prevComponents => {
        const tempTree = removeComponent(tempId, prevComponents);
        return addComponentChildRecursive(parentId, tempTree, savedComponent);
      });

      showNotification('success', 'Componente agregado exitosamente.');
    } catch (error) {
      console.error('Error al agregar el componente:', error);
      showNotification('error', 'Error al agregar el componente.');
      setComponents(prevComponents => removeComponent(tempId, prevComponents));
    }
  } else if (source === 'tree') {
    if (draggingComponent) {
      try {
        // Guardar el estado anterior del árbol de componentes
        previousComponents = [...components];

        // Intentar mover el componente
        const newComponents = moveComponent(draggingComponent.id, parentId, components);

        // Poner el componente en estado de carga
        setComponents(prevComponents => {
          return prevComponents.map(comp => {
            if (comp.id === draggingComponent.id) {
              return { ...comp, loading: true };
            }
            return comp;
          });
        });

        // Llamar al API para editar
        await editComponentToAPI(draggingComponent.id, { parent_id: parentId });

        // Finalizar la operación de carga y actualizar el árbol de componentes
        setComponents(newComponents.map(comp => {
          if (comp.id === draggingComponent.id) {
            return { ...comp, loading: false };
          }
          return comp;
        }));

        showNotification('success', 'Componente movido exitosamente.');
      } catch (error) {
        console.error('Error al mover el componente:', error);
        
        // Restaurar el árbol de componentes al estado anterior
        setComponents(previousComponents);

        showNotification('error', 'Error al mover el componente.');
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
    if (!comp || !comp.property) {
      console.error('Invalid component:', comp);
      return null;
    }

    let customClass = '';
    let customLabel = '';

    if (comp.component_type === 'Header') {
          customClass = 'component-type-header';
          customLabel = 'HEADER';
        } else if (comp.component_type === 'Body') {
          customClass = 'component-type-body';
          customLabel = 'BODY';
        } else if (comp.component_type === 'Footer') {
          customClass = 'component-type-footer';
          customLabel = 'FOOTER';
        }

    return (
      <div key={comp.id} className={customClass}>
        {customLabel && (
          <div className="custom-label">{customLabel}</div>
        )}
        <div
          draggable={comp.id !== parentId}
          onDragStart={(e) => handleDragStart(e, comp)}
          onDragEnd={handleDragEnd}
          onDragOver={(e) => handleDragEnterLeaveOrOver(e, comp.id, true)}
          onDrop={(e) => handleDrop(e, comp.id)}
          onDragEnter={(e) => handleDragEnterLeaveOrOver(e, comp.id)}
          onDragLeave={handleDragEnterLeaveOrOver}
          className={`component-item ${comp === draggingComponent ? 'dragging' : ''} ${draggingComponent && comp.id !== draggingComponent.id ? 'drop-target' : ''} ${selectedComponent && selectedComponent.id === comp.id ? 'selected' : ''}`}
          onClick={() => {
            setIsPropertiesOpen(true);
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
            {comp.loading && (
              <div className="component-actions">
                <Spinner animation="border" size="sm" />
              </div>
            )}
          {selectedComponent && comp.id === selectedComponent.id && !comp.loading && !['Header', 'Body', 'Footer'].includes(comp.component_type) && (
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
