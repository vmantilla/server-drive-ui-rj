import React from 'react';
import { useDrag } from 'react-dnd';
import ItemTypes from './ItemTypes';

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

  const opacity = isDragging ? 0.5 : 1;

  let component;
  switch (type) {
    case 'button':
      component = <Button>{content}</Button>;
      break;
    case 'image':
      component = <img src={content} alt="Draggable element" />;
      break;
    case 'text':
      component = <p>{content}</p>;
      break;
    case 'paragraph':
      component = <p>{content}</p>;
      break;
    default:
      component = null;
  }

  return (
    <div ref={drag} style={{ opacity }}>
      {component}
    </div>
  );
};

export default ComponentItem;
