// SDZStackView.js
import React from 'react';
import useSDPropertiesModifier from '../../../models/modifiers/useSDPropertiesModifier';
import { tipoItem } from '../Componentes';
import { renderBuilderComponentTree } from '../renderBuilderComponentTree';

import useDropHandler from '../useDropHandler';

const SDZStackView = ({ component, children, handleDrop, color }) => {
  const properties = component.properties;

  const initialDivStyle = {
    display: 'flex', 
    flexDirection: 'column',
    position: 'relative',
    backgroundColor: '#f2f2f2', 
    border: '1px dashed #000000'
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
    <div ref={drop} className="zstack" style={style}>
      {component.childrens && component.childrens.map(childComponent => renderBuilderComponentTree(childComponent, handleDrop))}
    </div>
  );
};

export default SDZStackView;
