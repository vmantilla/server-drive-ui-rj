import React, { useRef, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import useSDPropertiesModifier from '../modifiers/useSDPropertiesModifier';

const SDVStackView = ({ component, children, isBuilderMode, setActiveStackId }) => {
  const properties = component.properties;
  const initialDivStyle = {};

  // Usamos nuestro hook para obtener los estilos finales
  const style = useSDPropertiesModifier(properties, initialDivStyle);

  const componentRef = useRef(null);

  useEffect(() => {
    if (componentRef.current) {
      componentRef.current.id = component.id;
    }
  }, [component.id]);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'component',
    hover: () => {
      if (isBuilderMode) {
        setActiveStackId(component.id);
      }
    },
    collect: (monitor) => {
      const over = monitor.isOver({ shallow: true });
      return { isOver: over };
    },
  }));

  return (
    <div 
      ref={node => {
        drop(node);
        componentRef.current = node;
      }}
      className={`vstack ${isBuilderMode ? 'builderMode' : ''} ${isOver ? 'isOver' : ''}`} 
      style={style}
    >
      {children}
    </div>
  );
};

export default SDVStackView;
