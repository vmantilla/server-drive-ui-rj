import React, { useRef, useState, useCallback } from 'react';
import { useDrop } from 'react-dnd';
import update from 'immutability-helper';
import DraggableCard from './DraggableCard';

const DropZone = ({ style }) => {
  const ref = useRef(null);
  const [droppedCards, setDroppedCards] = useState([]);

  const moveCard = useCallback((dragIndex, hoverIndex) => {
    setDroppedCards(prevCards =>
      update(prevCards, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevCards[dragIndex]],
        ],
      }),
    );
  }, []);

  const [, drop] = useDrop({
    accept: 'card',
    drop: (item, monitor) => {
      if (monitor.didDrop()) {
        return;
      }
      const { text } = item;

      // Do not add the card if it is already present
      if (!droppedCards.includes(text)) {
        setDroppedCards(prev => [...prev, text]);
      }
    },
  });

  drop(ref);

  return (
    <div ref={ref} style={style}>
      {droppedCards.map((card, i) => (
        <DraggableCard key={i} index={i} text={card} moveCard={moveCard} />
      ))}
    </div>
  );
};

export default DropZone;
