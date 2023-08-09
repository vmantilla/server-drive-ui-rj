import React from 'react';
import RenderContainerView from './RenderContainerView';

const RenderScrollView = ({ component, handleDrop, onClick, index, moveChildrens, selectedComponent }) => {
  // Clase inicial para el contenedor de desplazamiento
  let scrollClass = "container-scrollview";
  const properties = component.properties || {};

  switch (properties.component_type) {
    case "Row":
      scrollClass += " container-scrollview-row";
      break;
    case "Column":
      scrollClass += " container-scrollview-column";
      break;
    default:
      break;
  }

  return (
    <div className={scrollClass}>
      <RenderContainerView 
        component={component}
        handleDrop={handleDrop}
        onClick={onClick}
        index={index}
        moveChildrens={moveChildrens}
        selectedComponent={selectedComponent}
      />
    </div>
  );
};

export default RenderScrollView;
