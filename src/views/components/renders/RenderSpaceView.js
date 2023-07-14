import React from 'react';
import useSDPropertiesModifier, { getAlignment }  from '../../../models/modifiers/useSDPropertiesModifier'; // Asegúrate de ajustar esta ruta a la ubicación correcta de tu hook

const RenderSpaceView = ({ component, children, onClick }) => {
  const properties = component.properties;
  const font = properties.font?.fontValue();
  const color = properties.font?.colorValue(1.0);

  // Usamos nuestro hook para obtener los estilos finales
  const alignmentStyle = getAlignment(properties?.frame?.alignment) ?? {};
  const divStyle = useSDPropertiesModifier(properties, { color, ...font, ...alignmentStyle });

  const alignmentType = properties.textAlignment?.alignment || 'leading';

  return (
  	<div className="dotted-line"></div>
  );
};

export default RenderSpaceView;
