import React from 'react';
import useSDPropertiesModifier from '../../../models/modifiers/useSDPropertiesModifier';
import { tipoItem } from '../Componentes';
import { renderBuilderComponentTree } from '../renderBuilderComponentTree';


import useDropHandler from '../useDropHandler';

const SDScrollView = ({ component, handleDrop, onClick }) => {
  const properties = component.properties;

  const initialDivStyle = {
   
  };

 const scrollAxis = component.properties?.axis || 'vertical';

  const style = useSDPropertiesModifier(properties, initialDivStyle);

  if (style.maxHeight === '100%') {
    style.maxHeight = undefined;
  }

  const { canDrop, isOver, drop } = useDropHandler(handleDrop, tipoItem.COMPONENTE, component);

  const isActive = canDrop && isOver;
  if (isActive) {
        style.backgroundColor = 'darkgreen'
    } else if (canDrop) {
        style.backgroundColor = 'darkkhaki'
    }

  return (
    <div ref={drop} className={`sd-scroll-view sd-scroll-view-${scrollAxis}`} style={style}  onClick={(e) => {
    e.stopPropagation(); 
    onClick(e, component);
  }}>
      {component.childrens && component.childrens.map(childComponent => renderBuilderComponentTree(childComponent, handleDrop, onClick))}
    </div>
  );
};

export default SDScrollView;
