// Dropzone.js
import React, { useState, useEffect } from 'react';
import { useDrop } from 'react-dnd'
import { tipoItem } from './components/Componentes'
import getDefaultProps from './components/GetDefaultProps';

import SDComponent from '../models/structs/SDComponent';
import SDComponentType from '../enums/SDComponentType';
import { renderBuilderComponentTree } from './components/renderBuilderComponentTree';

import { v4 as uuidv4 } from 'uuid'; 

const Dropzone = ( { style }) => {
    const [droppedComponents, setDroppedComponents] = useState([])
    const [draggingItem, setDraggingItem] = useState(null);

    useEffect(() => {
         console.log("droppedComponents", droppedComponents);
    }, [droppedComponents]);

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
                droppedComponents ? droppedComponents.map(component => renderBuilderComponentTree(component, handleDrop)) : 'Cargando...'
            }
        </div>
    )
}

export default Dropzone
