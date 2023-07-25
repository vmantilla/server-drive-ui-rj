import React, { useRef } from 'react';
import useSDPropertiesModifier, { getAlignment } from '../../../models/modifiers/useSDPropertiesModifier'; 
import { useDragAndDrop } from '../useDropHandler';

const RenderObjectView = ({ component, children, onClick, index, moveChildrens, selectedComponent}) => {
  
  const { ref } = useDragAndDrop(component, index, moveChildrens);
  const properties = component.properties;
  const alignmentStyle = getAlignment(properties?.frame?.alignment) ?? {};
  
  const initialObjectStyle = {};

  const objectStyle = useSDPropertiesModifier(properties, initialObjectStyle);
  
  // Si el componente es el seleccionado, le añadimos un borde azul
  if (component.id === selectedComponent.id) {
      objectStyle.borderWidth = '2px';
      objectStyle.borderStyle = 'solid';
      objectStyle.borderColor = 'blue';
  }

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
        return <p {...componentProps}>{properties.text}</p>;
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
