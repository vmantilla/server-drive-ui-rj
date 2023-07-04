// ZStack.js
import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import ItemTypes from './ItemTypes';
import DropArea from './DropArea';

const ZStack = () => {
  const [childComponents, setChildComponents] = useState([]);

  const [, drop] = useDrop({
    accept: Object.values(ItemTypes),
    drop: (item, monitor) => {
      if (!monitor.didDrop()) {
        setChildComponents(prev => [...prev, item]);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  return (
    <div ref={drop} className="zstack dropArea">
      <DropArea items={childComponents} />
    </div>
  );
};

export default ZStack;
