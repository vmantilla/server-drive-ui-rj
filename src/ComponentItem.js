import React from 'react';
import { useDrag } from 'react-dnd';
import ItemTypes from './ItemTypes';
import VStack from './VStack';
import HStack from './HStack';
import ZStack from './ZStack';

import { Button } from 'framework7-react';

const ComponentItem = ({ id, type, content, onMoveItem }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes[type.toUpperCase()],
    item: { id, type, content },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
        onMoveItem(item.id);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  let component;
  switch (type) {
    case 'button':
      component = <Button>{content}</Button>;
      break;
    case 'image':
      component = <img src={content} alt="Draggable element" />;
      break;
    case 'text':
    case 'paragraph':
      component = <p>{content}</p>;
      break;
    case 'vstack':
      component = <p>Placeholder VStack</p>;
      break;
    case 'hstack':
      component = <p>Placeholder HStack</p>;
      break;
    case 'zstack':
      component = <p>Placeholder ZStack</p>;
      break;
    default:
      component = null;
  }

  return (
    <div ref={drag}>
      {component}
    </div>
  );
};

export default ComponentItem;
