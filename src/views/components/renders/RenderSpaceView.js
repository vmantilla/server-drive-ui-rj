import React from 'react';
import useSDPropertiesModifier, { getAlignment }  from '../../../models/modifiers/useSDPropertiesModifier'; // Asegúrate de ajustar esta ruta a la ubicación correcta de tu hook

import { useDragAndDrop } from '../useDropHandler';

const RenderSpaceView = ({ component, children, onClick, index, moveChildrens }) => {

  const { ref } = useDragAndDrop(component, index, moveChildrens);
  

  return (
  	<div ref={ref} className="spacer"></div>
  );
};

export default RenderSpaceView;
