// Dropzone.js
import React, { useState, useEffect } from 'react';
import { useDrop } from 'react-dnd'
import { tipoItem } from './components/Componentes'
import getDefaultProps from './components/GetDefaultProps';

import SDComponent from '../models/structs/SDComponent';
import SDComponentType from '../enums/SDComponentType';
import { renderBuilderComponentTree } from './components/renderBuilderComponentTree';

import { v4 as uuidv4 } from 'uuid'; 

const Dropzone = ( { style, onComponentClick, droppedComponents, setDroppedComponents, selectedComponent }) => {
    const [draggingItem, setDraggingItem] = useState(null);
    
    const findInTree = (tree, childId) => {
        if (tree.id === childId) {
            return true;
        }
        for (const c of tree.childrens) {
            if (findInTree(c, childId)) {
                return true;
            }
        }
        return false;
    };

    const addChildToTree = (tree, parentId, child) => {
        if (tree.id === parentId) {
            // Verificar que no exista ya un hijo con el mismo ID en cualquier parte del árbol
            if (!findInTree(tree, child.id)) {
                tree.childrens.push(child);
            }
            return;
        }
        for (const c of tree.childrens) {
            addChildToTree(c, parentId, child);
        }
    };


    const handleDrop = (item, parentComponent) => {
        const newComponent = new SDComponent(
            item.id,
            SDComponentType[item.type],
            getDefaultProps(item.type),
            [],
            {}
        );

        setDroppedComponents(prevComponents => {
            let newComponents = [...prevComponents];
            if(parentComponent) {
                newComponents.forEach(component => {
                    addChildToTree(component, parentComponent.id, newComponent);
                });
            } else {
                newComponents.push(newComponent);
            }
            return newComponents;
        });
    };

    const [{ canDrop, isOver }, drop] = useDrop({
        accept: tipoItem.COMPONENTE,
        drop: (item, monitor) => {
            const didDrop = monitor.didDrop();
            if (didDrop) {
                return;
            }
            handleDrop(item);
            return { name: 'Dropzone' }
        },
        collect: monitor => ({
            isOver: monitor.isOver({ shallow: true }),
            canDrop: monitor.canDrop(),
        }),
    })

    const findParentAndReorder = (tree, childId, dragIndex, hoverIndex) => {
if (tree.childrens.some(c => c && c.id === childId)) {
        // We found the parent of the node being moved. Reorder its children.
        let childrenCopy = [...tree.childrens];
        let draggedChild = childrenCopy[dragIndex];

        // Check if the dragged child exists
        if (!draggedChild) {
            // The dragged child does not exist yet, so return the original tree without reordering
            return tree;
        }

        childrenCopy.splice(dragIndex, 1);
        childrenCopy.splice(hoverIndex, 0, draggedChild);
            
        return { ...tree, childrens: childrenCopy };
    } else {
        // We didn't find the parent at the current node. Search in the children.
        let childrenCopy = tree.childrens.map(c => c ? findParentAndReorder(c, childId, dragIndex, hoverIndex) : c);
        
        return { ...tree, childrens: childrenCopy };
    }
};


const moveChildrens = (component, dragIndex, hoverIndex) => {
    setDroppedComponents(prevComponents => {
        let newComponents = prevComponents.map(c => findParentAndReorder(c, component.id, dragIndex, hoverIndex));
        return newComponents;
    });
};


    const isActive = canDrop && isOver
    let backgroundColor = '#FFF';
    if (isActive) {
        backgroundColor = 'darkgreen'
    } else if (canDrop) {
        backgroundColor = 'darkkhaki'
    }

    return (
       <div ref={drop} style={{ ...style, backgroundColor }}>
    {
        droppedComponents 
        ? droppedComponents.map((component, i) => {
            if (component.properties) {
                return renderBuilderComponentTree(component, handleDrop, onComponentClick, i, moveChildrens, selectedComponent)
            } else {
                console.warn(`El componente principal en el índice ${i} no tiene propiedades y no se renderizará.`);
            }
        }) 
        : 'Cargando...'
    }
</div>
    )
}

export default Dropzone
