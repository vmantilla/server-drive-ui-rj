import React, { useEffect } from 'react';
import update from 'immutability-helper';
import useSDPropertiesModifier from '../../../models/modifiers/useSDPropertiesModifier';
import { tipoItem } from '../Componentes';
import { renderBuilderComponentTree } from '../renderBuilderComponentTree';

import { useDropHandler, useDragAndDrop } from '../useDropHandler';

const RenderContainerView = ({ component, handleDrop, onClick, index, moveChildrens, selectedComponent }) => {
  
  const handleKeyDown = (e) => {

    if (!selectedComponent) return;

    // Verifica si el componente seleccionado está en este contenedor
    const childIndex = component.children.findIndex(child => child.id === selectedComponent.id);
    if (childIndex < 0) return;
      
    if ((properties.component_type === 'Row' && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) ||
        (properties.component_type === 'Column' && (e.key === 'ArrowUp' || e.key === 'ArrowDown'))) {
      const newIndex = e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? childIndex - 1 : childIndex + 1;
      
      // Asegura que el nuevo índice esté dentro del rango válido
      if (newIndex < 0 || newIndex >= component.children.length) return;

      // Mueve el componente seleccionado
      moveChildrens(selectedComponent, childIndex, newIndex);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    // Limpiamos el evento al desmontar el componente
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedComponent, moveChildrens]); // Dependencias del useEffect


  const properties = component.properties;
  const initialDivStyle = { };

  const style = useSDPropertiesModifier(properties, initialDivStyle);
  // Si el componente es el seleccionado, le añadimos un borde azul
  if (component.id === selectedComponent.id) {
      style.borderWidth = '2px';
      style.borderStyle = 'solid';
      style.borderColor = 'blue';
  }

  const { canDrop, isOver, drop } = useDropHandler(handleDrop, tipoItem.COMPONENTE, component);
  

  const isActive = canDrop && isOver;
  if (isActive) {
        style.backgroundColor = 'darkgreen'
    } else if (canDrop) {
        style.backgroundColor = 'darkkhaki'
    }


    let className;
  switch (properties.component_type) {
    case "Row":
      className = "container-row";
      break;
    case "Column":
      className = "container-column";
      break;
    case "Overflow":
      className = "container-overflow";
      break;
    default:
      className = "container-row";
      break;
  }

  return (
    <div ref={drop} className={`container ${className}`} style={style} onClick={(e) => {
        e.stopPropagation(); 
        onClick(e, component);
      }}>
     {component.children && component.children.map((childComponent, i) =>
      renderBuilderComponentTree(childComponent, handleDrop, onClick, i, moveChildrens, selectedComponent)
)}
 </div>
  );
};

export default RenderContainerView;
