import React, { useRef } from 'react';
import useSDPropertiesModifier, { getAlignment } from '../../../models/modifiers/useSDPropertiesModifier'; 
import { useDragAndDrop } from '../useDropHandler';

const SDButtonView = ({ component, children, onClick, index, moveChildrens }) => {
  const { ref } = useDragAndDrop(component, index, moveChildrens);
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
    </button>
  );
};

export default SDButtonView;
