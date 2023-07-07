// components/SDTextView.js
import React from 'react';
import useSDPropertiesModifier, { getAlignment }  from '../Common/useSDPropertiesModifier';

const SDTextView = ({ component, children }) => {
  const properties = component.properties;
  const font = properties.font?.fontValue();
  const color = properties.font?.colorValue(1.0);

  // Usamos nuestro hook para obtener los estilos finales
  const alignmentStyle = getAlignment(properties?.frame?.alignment) ?? {};
  const divStyle = useSDPropertiesModifier(properties, { color, ...font, ...alignmentStyle });

  const alignmentType = properties.textAlignment?.alignment || 'leading';

  return (
    <span style={divStyle}>{properties.text || ''}</span>
  );
};

export default SDTextView;
