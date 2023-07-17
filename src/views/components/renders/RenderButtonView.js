import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import useSDPropertiesModifier, { getAlignment } from '../../../models/modifiers/useSDPropertiesModifier'; 
import { tipoItem } from '../Componentes';

const SDButtonView = ({ component, children, onClick, index, moveButton }) => {
  const ref = useRef(null);

  const [, drag] = useDrag({
    type: tipoItem.COMPONENTE,
    item: { id: component.id, index },
  });

  const [, drop] = useDrop({
    accept: tipoItem.COMPONENTE,
    hover(item, monitor) {
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      moveButton(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));
  const properties = component.properties;
  
  const alignmentStyle = getAlignment(properties?.frame?.alignment) ?? {};
  
  const initialButtonStyle = {
    boxShadow: 'none',
    outline: 'none',
    transform: 'none',
    WebkitTransform: 'translateZ(0)',
    MozTransform: 'translateZ(0)',
    msTransform: 'translateZ(0)',
    OTransform: 'translateZ(0)',
    WebkitTapHighlightColor: 'transparent',
    ...alignmentStyle
  };

  const buttonStyle = useSDPropertiesModifier(properties, initialButtonStyle);

  return (
    <button ref={ref} className="buttonView" style={buttonStyle} onClick={(e) => {
        e.stopPropagation(); 
        onClick(e, component);
      }}>
      {children}
    </button>
  );
};

export default SDButtonView;
