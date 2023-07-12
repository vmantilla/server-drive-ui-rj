// SDVStackView.js
import React from 'react';
import useSDPropertiesModifier from '../../../models/modifiers/useSDPropertiesModifier';
import { useDrop } from 'react-dnd';
import { v4 as uuidv4 } from 'uuid';
import { tipoItem } from '../Componentes';
import getDefaultProps from '../GetDefaultProps';
import SDComponent from '../../../models/structs/SDComponent';
import SDComponentType from '../../../enums/SDComponentType';
import { renderBuilderComponentTree } from '../renderBuilderComponentTree';


const SDVStackView = ({ component, children, handleDrop }) => {
  const properties = component.properties;

  const initialDivStyle = {
  };

  const style = useSDPropertiesModifier(properties, initialDivStyle);

  const [{ canDrop, isOver }, drop] = useDrop({
    accept: tipoItem.COMPONENTE,
    drop: (item, monitor) => {
      // Calling handleDrop from Dropzone component.
      if (handleDrop) {
        handleDrop(item, component);
      }
      return { name: 'SDVStackView' };
    },
    collect: monitor => ({
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
    }),
  });

  const isActive = canDrop && isOver;
  if (isActive) {
        style.backgroundColor = 'darkgreen'
    } else if (canDrop) {
        style.backgroundColor = 'darkkhaki'
    }

  return (
    <div ref={drop} className="vstack dropArea" style={style}>
      {component.children && component.children.map(childComponent => renderBuilderComponentTree(childComponent, handleDrop))}
    </div>
  );
};

export default SDVStackView;
