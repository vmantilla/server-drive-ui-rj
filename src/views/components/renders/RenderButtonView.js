// components/SDButtonView.js
import React from 'react';
import useSDPropertiesModifier, { getAlignment } from '../../../models/modifiers/useSDPropertiesModifier'; // Asegúrate de ajustar esta ruta a la ubicación correcta de tu hook

const SDButtonView = ({ component, children, onClick }) => {
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
    <button className="buttonView" style={buttonStyle} onClick={onClick}>
      {children}
    </button>
  );
};

export default SDButtonView;
