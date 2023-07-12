// components/SDButtonView.js
import React from 'react';
import useSDPropertiesModifier, { getAlignment } from '../../../models/modifiers/useSDPropertiesModifier'; // Asegúrate de ajustar esta ruta a la ubicación correcta de tu hook

const SDButtonView = ({ component, children }) => {
  const properties = component.properties;
  
  const alignmentStyle = getAlignment(properties?.frame?.alignment) ?? {};


  const buttonStyle = useSDPropertiesModifier(properties, alignmentStyle);

  return (
    <button className="buttonView" style={buttonStyle}>
      {children}
    </button>
  );
};

export default SDButtonView;
