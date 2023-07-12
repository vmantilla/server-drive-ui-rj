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

    const addChildToTree = (tree, parentId, child) => {
      if (tree.id === parentId) {
        // Verify that there isn't already a child with the same ID
        const existingChild = tree.childrens.find(c => c.id === child.id);
        if (!existingChild) {
          tree.childrens.push(child);
        }
        return;
      }
      for (const c of tree.childrens) {
        addChildToTree(c, parentId, child);
      }
    };


    const handleDrop = (item, parentComponent) => {
        console.log("handleDrop", item);

        const newComponent = new SDComponent(
            uuidv4(),
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
