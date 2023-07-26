import React from 'react';
import useSDPropertiesModifier, { getAlignment }  from '../../../models/modifiers/useSDPropertiesModifier'; // Asegúrate de ajustar esta ruta a la ubicación correcta de tu hook

const RenderSpaceView = ({ component, children, onClick, index, moveChildrens, selectedComponent }) => {

  const initialObjectStyle = {};

  const properties = component.properties;
  const objectStyle = useSDPropertiesModifier(properties, initialObjectStyle);
  
  // Si el componente es el seleccionado, le añadimos un borde azul
  if (component.id === selectedComponent.id) {
      initialObjectStyle.borderWidth = '2px';
      initialObjectStyle.borderStyle = 'solid';
      initialObjectStyle.borderColor = 'blue';
  }

  // Según el tipo de componente, renderizamos diferentes cosas
  const renderComponent = () => {
    const componentProps = {
      style: initialObjectStyle,
      ...component.props,
      onClick: (e) => {
        e.stopPropagation();
        onClick(e, component);
      }
    };
  
    return <div className="spacer" {...componentProps}>{children}</div>;
  };

  return renderComponent();
};

export default RenderSpaceView;
