import React from 'react';
import useSDPropertiesModifier, { getAlignment }  from '../../../models/modifiers/useSDPropertiesModifier'; // Asegúrate de ajustar esta ruta a la ubicación correcta de tu hook

import { useDragAndDrop } from '../useDropHandler';

const RenderSpaceView = ({ component, children, onClick, index, moveChildrens, selectedComponent }) => {

  const { ref } = useDragAndDrop(component, index, moveChildrens);
  const initialObjectStyle = {};

  const properties = component.properties;
  const objectStyle = useSDPropertiesModifier(properties, initialObjectStyle);
  
  // Si el componente es el seleccionado, le añadimos un borde azul
  if (component.id === selectedComponent.id) {
      objectStyle.borderWidth = '2px';
      objectStyle.borderStyle = 'solid';
      objectStyle.borderColor = 'blue';
  }

  return (
  	<div ref={ref} className="spacer"></div>
  );
};

export default RenderSpaceView;
