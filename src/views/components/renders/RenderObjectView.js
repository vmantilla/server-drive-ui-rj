import React, { useRef } from 'react';
import useSDPropertiesModifier, { getAlignment } from '../../../models/modifiers/useSDPropertiesModifier'; 
import { useDragAndDrop } from '../useDropHandler';

const RenderObjectView = ({ component, children, onClick, index, moveChildrens }) => {
  
  const { ref } = useDragAndDrop(component, index, moveChildrens);
  const properties = component.properties;
  const alignmentStyle = getAlignment(properties?.frame?.alignment) ?? {};
  
  const initialObjectStyle = {};

  const objectStyle = useSDPropertiesModifier(properties, initialObjectStyle);

  return (
    <div ref={ref} style={objectStyle} onClick={(e) => {
        e.stopPropagation(); 
        onClick(e, component);
      }}>
    </div>
  );
};

export default RenderObjectView;
