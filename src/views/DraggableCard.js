import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import '../css/Simulator.css';

const DraggableCard = ({ card, index, moveCard, isInDropZone, setNestedCards }) => {
  const ref = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type: 'card',
    item: { ...card, index, isInDropZone },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const cardStyle = {
    padding: '10px',
    margin: '2px',
    cursor: 'move',
    opacity: isDragging ? 0 : 1,
    border: isInDropZone ? '2px dashed black' : '1px solid gray',
  };

  const [, drop] = useDrop({
    accept: 'card',
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveCard(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
    drop: (item, monitor) => {
      if (isInDropZone && !monitor.didDrop()) {
        const newCard = { ...card, subCards: [...card.subCards, item] };
        setNestedCards(prevCards =>
          prevCards.filter(c => c).map(c => c.id === card.id ? newCard : c)
        );
      }
    },
  });


  drag(drop(ref));

  
  return (
    <div ref={ref} style={cardStyle} >
      {card.text}
      <div className={card.type}>
      {card.subCards?.map((subCard, i) => (
        <DraggableCard key={i} index={i} card={subCard} moveCard={moveCard} isInDropZone={isInDropZone} setNestedCards={setNestedCards} />
      ))}
      </div>
    </div>
  );
};

export default DraggableCard;
