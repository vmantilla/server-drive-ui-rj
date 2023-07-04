import React from 'react';
import { useDrag } from 'react-dnd';
import { Button } from 'framework7-react'; 

const ItemTypes = {
  BUTTON: 'button',
  IMAGE: 'image',
  TEXT: 'text',
};

const ComponentItem = ({ name, type, id, onMoveItem }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes[type.toUpperCase()],
    item: { id },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
        onMoveItem(item.id, dropResult.id);
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
      component = <Button>Button</Button>;
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
