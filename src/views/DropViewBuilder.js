import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DropZone from './DropZone';
import DraggableCard from './DraggableCard';

const DropViewBuilder = () => {

  // Definir tu función moveCard aquí. Tendrás que ajustarla a tus necesidades.
  const moveCard = (dragIndex, hoverIndex) => {
    console.log("Mover tarjeta desde: ", dragIndex, " a ", hoverIndex);
    // Aquí es donde realizarías la lógica para reordenar tus tarjetas en el estado.
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{display: 'flex'}}>
        <div>
          {/* Aquí es donde colocarías tus tarjetas arrastrables. */}
          <DraggableCard card={{ id: 1, text: "Card 1", subCards: [] }} index={0} moveCard={moveCard} />
          <DraggableCard card={{ id: 2, text: "Card 2", subCards: [] }} index={1} moveCard={moveCard} />
          <DraggableCard card={{ id: 3, text: "Card 3", subCards: [] }} index={2} moveCard={moveCard} />
          <DraggableCard card={{ id: 4, text: "Card 4", subCards: [] }} index={3} moveCard={moveCard} />
          <DraggableCard card={{ id: 5, text: "Card 5", subCards: [] }} index={4} moveCard={moveCard} />
          <DraggableCard card={{ id: 6, text: "Card 6", subCards: [] }} index={5} moveCard={moveCard} />
          <DraggableCard card={{ id: 7, text: "Card 7", subCards: [] }} index={6} moveCard={moveCard} />
          <DraggableCard card={{ id: 8, text: "Card 8", subCards: [] }} index={7} moveCard={moveCard} />
          {/* ... */}
        </div>
        <DropZone 
          style={{
            width: '375px', 
            height: '812px', 
            borderRadius: '40px',
            backgroundColor: '#F0F0F0',
            boxShadow: '0 0 10px rgba(0,0,0,0.15)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px',
            overflow: 'auto'
          }} 
        />
      </div>
    </DndProvider>
  );
};

export default DropViewBuilder;
