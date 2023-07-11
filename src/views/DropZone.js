import React, { useRef, useState, useCallback, useEffect } from 'react';

import { useDrop } from 'react-dnd';
import update from 'immutability-helper';
import DraggableCard from './DraggableCard';

const createNewCard = (id,text) => {
  return { id: id, text, subCards: [] };
}

const DropZone = ({ style }) => {
  const ref = useRef(null);
  const [droppedCards, setDroppedCards] = useState([]);

  useEffect(() => {
    console.log(droppedCards);
  }, [droppedCards]);

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

  const setNestedCards = useCallback((newCards) => {
    setDroppedCards(newCards);
  }, []);

  const [, drop] = useDrop({
    accept: 'card',
    drop: (item, monitor) => {
      const { id, isInDropZone } = item;

      if (monitor.didDrop() || isInDropZone) {
        return;
      }

      if (!droppedCards.find(card => card.id === id)) {
        const randomId =
          Math.random().toString(36).substring(2, 15) +
          Math.random().toString(36).substring(2, 15);
        setDroppedCards(prev => [...prev, {...item, id: randomId, isInDropZone: true }]);
      }
    },
  });


  drop(ref);

  return (
    <div ref={ref} style={style}>
      {droppedCards.map((card, i) => (
        card && card.id ? <DraggableCard key={card.id} index={i} card={card} moveCard={moveCard} isInDropZone={true} setNestedCards={setNestedCards} /> : null
      ))}
    </div>
  );
};

export default DropZone;

