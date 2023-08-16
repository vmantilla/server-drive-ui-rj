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

    const addComponentChildRecursive = (parentId, currentComponents) => {
        const child = { id: Date.now(), type: `Hijo`, children: [], expanded: false };

        return currentComponents.map(component => {
            if (component.id === parentId) {
                return { ...component, children: [...component.children, child] };
            }

            if (component.children.length > 0) {
                return { ...component, children: addComponentChildRecursive(parentId, component.children) };
            }

            return component;
        });
    };

    const deleteComponentRecursive = (idToDelete, currentComponents) => {
        let filteredComponents = currentComponents.filter(comp => comp.id !== idToDelete);
        filteredComponents.forEach(component => {
            if (component.children.length > 0) {
                component.children = deleteComponentRecursive(idToDelete, component.children);
            }
        });
        return filteredComponents;
    };

    const deleteComponent = (compToDelete) => {
        setComponents(prevComponents => deleteComponentRecursive(compToDelete.id, prevComponents));
        setShowDeleteModal(false);
    };

    const addComponentChild = (parentId) => {
        setComponents(prevComponents => addComponentChildRecursive(parentId, prevComponents));
    };

    const handleDragStart = (event, component) => {
        event.dataTransfer.setData('text/plain', component.type);
    };

    const renderComponentList = (compArray) => {
        return compArray.map(comp => (
            <div key={comp.id} draggable="true" onDragStart={(event) => handleDragStart(event, comp)}>
                <div className="component-item" onClick={() => setIsPropertiesOpen(true)}>
                    <span className="toggle-btn" onClick={(e) => { e.stopPropagation(); handleToggleExpanded(comp.id); }}>{comp.expanded ? '-' : '+'}</span>
                    <span>{comp.type}</span>
                    <Button variant="outline-danger" className="delete-btn" onClick={(e) => { e.stopPropagation(); setShowDeleteModal(true); setComponentToDelete(comp); }}>✖</Button>
                    <Button variant="outline-primary" className="add-child-btn" onClick={(e) => { e.stopPropagation(); addComponentChild(comp.id); }}>+</Button>
                </div>
                {comp.expanded && comp.children.length > 0 && <div className="component-children">{renderComponentList(comp.children)}</div>}
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
