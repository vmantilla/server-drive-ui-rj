// Archivo: ComponentItem.js

import React from 'react';
import { useDrag } from 'react-dnd';
import '../../css/ComponentItem.css';

const ComponentItem = ({ component }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'component',
    item: { id: component.name },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div ref={drag} className={`component-item ${isDragging ? 'dragging' : ''}`}>
      {component.name}
    </div>
  );
};

export default ComponentItem;
