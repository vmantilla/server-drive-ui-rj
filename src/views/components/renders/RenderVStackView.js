// components/SDVStackView.js
import React from 'react';
import useSDPropertiesModifier from '../../../models/modifiers/useSDPropertiesModifier'; // Asegúrate de ajustar esta ruta a la ubicación correcta de tu hook
import { useDrop } from 'react-dnd';
import { v4 as uuidv4 } from 'uuid';
import { tipoItem } from '../Componentes'; // Asegúrate de ajustar esta ruta a la ubicación correcta
import getDefaultProps from '../GetDefaultProps';
import SDComponent from '../../../models/structs/SDComponent';
import SDComponentType from '../../../enums/SDComponentType';
import { renderBuilderComponentTree } from '../renderBuilderComponentTree';


const SDVStackView = ({ component, children, setDroppedComponents, droppedComponents }) => {
  // Obtenemos las propiedades de nuestro componente
  const properties = component.properties;

  // Configuramos nuestro estilo inicial del div
  const initialDivStyle = {
  };

  // Usamos nuestro hook para obtener los estilos finales
  const style = useSDPropertiesModifier(properties, initialDivStyle);

  const [{ canDrop, isOver }, drop] = useDrop({
  accept: tipoItem.COMPONENTE,
  drop: (item, monitor) => {
    // Aquí creamos una nueva instancia de la clase SDComponent cada vez que se suelta un componente
    const newComponent = new SDComponent(
      uuidv4(),
      SDComponentType[item.type],
      getDefaultProps(item.type),
      [],
      {}
    );

    // Comprobar si un componente hijo ya ha manejado el drop
    const didDrop = monitor.didDrop();

    if (didDrop) {
      // Si un componente hijo ya ha manejado el drop, no hacemos nada más
      return;
    }

    // Aquí actualizamos el estado del componente padre, añadiendo el nuevo componente soltado a la lista de hijos
    setDroppedComponents(prevComponents => {
      let newComponents = [...prevComponents];
      let index = newComponents.findIndex(c => c.id === component.id);
      if(index !== -1){
        newComponents[index].childrens.push(newComponent);
      }
      return newComponents;
    });
    return { name: 'SDVStackView' };
  },
  collect: monitor => ({
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
  }),
});



  const isActive = canDrop && isOver;
  if (isActive) {
      style.backgroundColor = 'MidnightBlue';
  } else if (canDrop) {
      style.backgroundColor = 'Gold';
  }

  // Aquí puedes usar las propiedades del componente para configurar tu VStack.
// Por ahora, solo se está utilizando el tipo de componente como texto de placeholder.
return (
  <div ref={drop} className="vstack dropArea" style={style}>
    {component.children && component.children.map(childComponent => renderBuilderComponentTree(childComponent, setDroppedComponents, droppedComponents))}
  </div>
);

};


export default SDVStackView;
