import React from 'react';
import update from 'immutability-helper';
import useSDPropertiesModifier from '../../../models/modifiers/useSDPropertiesModifier';
import { tipoItem } from '../Componentes';
import { renderBuilderComponentTree } from '../renderBuilderComponentTree';

import useDropHandler from '../useDropHandler';

const SDHStackView = ({ component, handleDrop, onClick }) => {
  const [childrens, setChildrens] = React.useState(component.childrens);

  const moveButton = (dragIndex, hoverIndex) => {
  const dragButton = childrens[dragIndex];
  
  console.log('Before moving button: ', dragIndex);

  setChildrens(
    update(childrens, {
      $splice: [
        [dragIndex, 1],
        [hoverIndex, 0, dragButton],
      ],
    }),
  );

  console.log('After moving button: ', hoverIndex);
};

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
    <div ref={drop} className="hstack dropArea" style={style} onClick={(e) => {
        e.stopPropagation(); 
        onClick(e, component);
      }}>
     {component.childrens && component.childrens.map((childComponent, i) =>
  renderBuilderComponentTree(childComponent, handleDrop, onClick, i, moveButton)
)}
 </div>
  );
};

export default SDHStackView;
