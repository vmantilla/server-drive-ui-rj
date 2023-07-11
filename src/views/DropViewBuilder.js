import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DragDropContext from './DragDropContext';
import DropZone from './DropZone';
import DraggableCard from './DraggableCard';

const DropViewBuilder = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{display: 'flex'}}>
        <DragDropContext>
          {/* Aquí es donde colocarías tus tarjetas arrastrables. */}
          <DraggableCard text="Card 1" />
          <DraggableCard text="Card 2" />
          <DraggableCard text="Card 3" />
          <DraggableCard text="Card 4" />
          <DraggableCard text="Card 5" />
          <DraggableCard text="Card 6" />
          <DraggableCard text="Card 7" />
          <DraggableCard text="Card 8" />
          {/* ... */}
        </DragDropContext>
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