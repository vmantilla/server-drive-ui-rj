// components/SDZStackView.js
import React from 'react';
import { useDrop } from 'react-dnd';
import useSDPropertiesModifier from '../modifiers/useSDPropertiesModifier';

const SDZStackView = ({ component, children, isBuilderMode }) => {
  const properties = component.properties;
  // Configuramos nuestro estilo inicial del div
  const initialDivStyle = {
    display: 'flex', 
    flexDirection: 'column',
    position: 'relative',
  };

  const style = useSDPropertiesModifier(properties, initialDivStyle);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'component',
    collect: (monitor) => {
      const over = monitor.isOver({ shallow: true });
      console.log(`Is over: ${over}`);
      return { isOver: over };
    },
  }));

  return (
    <div 
      ref={isBuilderMode ? drop : null} 
      className={`zstack ${isBuilderMode ? 'builderMode' : ''} ${isOver ? 'isOver' : ''}`} 
      style={style}
    >
      {children}
    </div>
  );
};

export default SDZStackView;
