// Archivo: ComponentItem.js

import React from 'react';
import { useDrag } from 'react-dnd';
import '../../css/ComponentItem.css';
import DraggableCard from '../DraggableCard';

const ComponentItem = ({ component, moveCard }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'component',
    item: { id: component.name, type: component.type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
      <DraggableCard card={{ id: component.id, text: component.name, subCards: [], type: component.type}} isInDropZone={false} index={component.id} moveCard={moveCard} />
    
  );
};

export default ComponentItem;
