import React from 'react';
import update from 'immutability-helper';
import useSDPropertiesModifier from '../../../models/modifiers/useSDPropertiesModifier';
import { tipoItem } from '../Componentes';
import { renderBuilderComponentTree } from '../renderBuilderComponentTree';

import { useDropHandler, useDragAndDrop } from '../useDropHandler';

const RenderContainerView = ({ component, handleDrop, onClick, index, moveChildrens }) => {
  
  const properties = component.properties;
  const initialDivStyle = { };

  const style = useSDPropertiesModifier(properties, initialDivStyle);

  const { canDrop, isOver, drop } = useDropHandler(handleDrop, tipoItem.COMPONENTE, component);
  const { ref } = useDragAndDrop(component, index, moveChildrens);
  

  const isActive = canDrop && isOver;
  if (isActive) {
        style.backgroundColor = 'darkgreen'
    } else if (canDrop) {
        style.backgroundColor = 'darkkhaki'
    }


    let className;
  switch (properties.layout) {
    case "row":
      className = "vstack";
      break;
    case "column":
      className = "hstack";
      break;
    case "overflow":
      className = "zstack";
      break;
    default:
      className = "hstack";
      break;
  }

  return (
    <div ref={drop} className={`${className} dropArea`} style={style} onClick={(e) => {
        e.stopPropagation(); 
        onClick(e, component);
      }}>
     {component.childrens && component.childrens.map((childComponent, i) =>
  renderBuilderComponentTree(childComponent, handleDrop, onClick, i, moveChildrens)
)}
 </div>
  );
};

export default RenderContainerView;
