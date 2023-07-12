import React, { useState, useEffect } from 'react';
import { useDrop } from 'react-dnd'
import { tipoItem } from './components/Componentes'
import getDefaultProps from './components/GetDefaultProps';

import SDComponent from '../models/structs/SDComponent';
import SDProperties from '../models/structs/SDProperties';
import SDComponentType from '../enums/SDComponentType';
import { renderBuilderComponentTree } from './components/renderBuilderComponentTree';

import { v4 as uuidv4 } from 'uuid';  // Importar el generador de ID único


const Dropzone = ( { style }) => {

    const [droppedComponents, setDroppedComponents] = useState([])

    useEffect(() => {
         console.log("droppedComponents", droppedComponents);
    }, [droppedComponents]);

    const [{ canDrop, isOver }, drop] = useDrop({
        accept: tipoItem.COMPONENTE,
        drop: (item, monitor) => {
          // Comprobar si un componente hijo ya ha manejado el drop
          const didDrop = monitor.didDrop();

          if (didDrop) {
            // Si un componente hijo ya ha manejado el drop, no hacemos nada más
            return;
          }

          // Aquí creamos una nueva instancia de la clase SDComponent cada vez que se suelta un componente
          const newComponent = new SDComponent(
            uuidv4(), // Id de tu componente
            SDComponentType[item.type], // Aquí asumimos que el nombre del componente coincide con una clave en SDComponentType
            getDefaultProps(item.type), // Aquí podrías pasar las propiedades del componente si las tienes
            [], // Aquí podrías pasar los hijos del componente si los tienes
            {}  // Aquí podrías pasar los estados del componente si los tienes
          )

          // Aquí actualizamos el estado del componente padre, añadiendo el nuevo componente soltado a la lista de hijos
          setDroppedComponents(prevComponents => {
            let newComponents = [...prevComponents];
            let index = newComponents.findIndex(c => c.id === newComponent.id);
            if(index !== -1){
              newComponents[index].childrens = [...newComponents[index].childrens, newComponent];
            } else {
              newComponents.push(newComponent);
            }
            return newComponents;
          });

          return { name: 'Dropzone' }
        },
        collect: monitor => ({
            isOver: monitor.isOver(),
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
              droppedComponents ? droppedComponents.map(component => renderBuilderComponentTree(component, setDroppedComponents, droppedComponents)) : 'Cargando...'
            }
        </div>
    )
}

export default Dropzone
