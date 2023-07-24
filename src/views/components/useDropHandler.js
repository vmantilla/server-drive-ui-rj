import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { tipoItem } from './Componentes';

export const useDropHandler = (handleDrop, itemTypes, component) => {
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: itemTypes,
    drop: (item, monitor) => {
      // Calling handleDrop from Dropzone component.
      if (handleDrop) {
        handleDrop(item, component);
      }
      return { name: component.constructor.name }; // or provide a suitable name.
    },
    collect: monitor => ({
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
    }),
  });

  return { canDrop, isOver, drop };
};


export const useDragAndDrop = (component, index, moveChildrens) => {
  const ref = useRef(null);

  const [, drag] = useDrag({
    type: tipoItem.COMPONENTE,
    item: { id: component.id, index },
  });

  const [, dropHover] = useDrop({
    accept: tipoItem.COMPONENTE,
    hover(item, monitor) {
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      moveChildrens(component, dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  drag(dropHover(ref));

  return { ref };
};
