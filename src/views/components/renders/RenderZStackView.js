// SDZStackView.js
import React from 'react';
import useSDPropertiesModifier from '../../../models/modifiers/useSDPropertiesModifier';
import { tipoItem } from '../Componentes';
import { renderBuilderComponentTree } from '../renderBuilderComponentTree';

import useDropHandler from '../useDropHandler';

const SDZStackView = ({ component, children, handleDrop, onClick }) => {
  const properties = component.properties;

  const initialDivStyle = {
    
  };

  const style = useSDPropertiesModifier(properties, initialDivStyle);

  const { canDrop, isOver, drop } = useDropHandler(handleDrop, tipoItem.COMPONENTE, component);

  const isActive = canDrop && isOver;
  if (isActive) {
        style.backgroundColor = 'darkgreen'
    } else if (canDrop) {
        style.backgroundColor = 'darkkhaki'
    }

  return (
    <div ref={drop} className="zstack" style={style} onClick={(e) => {
        e.stopPropagation(); 
        onClick(e, component);
      }}>
      {component.childrens && component.childrens.map(childComponent => renderBuilderComponentTree(childComponent, handleDrop, onClick))}
    </div>
  );
};

export default SDZStackView;
