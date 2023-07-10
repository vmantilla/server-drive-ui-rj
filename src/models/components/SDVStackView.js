// components/SDVStackView.js
import React from 'react';
import { useDrop } from 'react-dnd';
import useSDPropertiesModifier from '../modifiers/useSDPropertiesModifier';

const SDVStackView = ({ component, children, isBuilderMode }) => {
  const properties = component.properties;
  const initialDivStyle = {};

  // Usamos nuestro hook para obtener los estilos finales
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
  className={`vstack ${isBuilderMode ? 'builderMode' : ''} ${isOver ? 'isOver' : ''}`} 
  style={style}
>
  {children}
</div>

  );
};

export default SDVStackView;