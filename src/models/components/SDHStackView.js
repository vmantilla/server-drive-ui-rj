// components/SDHStackView.js
import React from 'react';
import { useDrop } from 'react-dnd';
import useSDPropertiesModifier from '../modifiers/useSDPropertiesModifier';

const SDHStackView = ({ component, children, isBuilderMode }) => {
  const properties = component.properties;
  const initialDivStyle = {};

  // Usamos nuestro hook para obtener los estilos finales
  const style = useSDPropertiesModifier(properties, initialDivStyle);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'component',
    collect: (monitor) => {
      const over = monitor.isOver({ shallow: true });
      return { isOver: over };
    },
  }));

  return (
    <div 
      ref={isBuilderMode ? drop : null} 
      className={`hstack ${isBuilderMode ? 'builderMode' : ''} ${isOver ? 'isOver' : ''}`} 
      style={style}
    >
      {children}
    </div>
  );
};

export default SDHStackView;
