import React, { useRef } from 'react';
import useSDPropertiesModifier, { getAlignment } from '../../../models/modifiers/useSDPropertiesModifier'; 
import { useDragAndDrop } from '../useDropHandler';

const RenderObjectView = ({ component, children, onClick, index, moveChildrens }) => {
  
  const { ref } = useDragAndDrop(component, index, moveChildrens);
  const properties = component.properties;
  const alignmentStyle = getAlignment(properties?.frame?.alignment) ?? {};
  
  const initialObjectStyle = {};

  const objectStyle = useSDPropertiesModifier(properties, initialObjectStyle);

  // Según el tipo de componente, renderizamos diferentes cosas
  const renderComponent = () => {
    const componentProps = {
      style: objectStyle,
      ...component.props,
      ref: ref,
      onClick: (e) => {
        e.stopPropagation();
        onClick(e, component);
      }
    };

    switch (properties.componentType) {
      case 'Button':
        return <button {...componentProps}>{children}</button>;
      case 'Image':
        return <img {...componentProps} />;
      case 'Text':
        return <p {...componentProps}>{children}</p>;
      case 'TextField':
        return <input {...componentProps} />;
      case 'View':
      default:
        return <div {...componentProps}>{children}</div>;
    }
  };

  return renderComponent();
};

export default RenderObjectView;
