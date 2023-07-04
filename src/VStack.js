// VStack.js
import React from 'react';
import { useDrop } from 'react-dnd';
import ItemTypes from './ItemTypes';

const VStack = ({ children, onDropItem }) => {
  const [, drop] = useDrop({
    accept: Object.values(ItemTypes),
    drop: (item, monitor) => {
      if (onDropItem) {
        onDropItem(item);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return <div ref={drop} className="vstack componentDroptable">{children}</div>;
};

export default VStack;
