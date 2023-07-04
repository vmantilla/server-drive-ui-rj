import React, { useState, useCallback } from 'react';
import { DndProvider, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Button } from 'framework7-react';
import ComponentItem from './ComponentItem';

const ItemTypes = {
  BUTTON: 'button',
  IMAGE: 'image',
  TEXT: 'text',
};

const Simulator = ({ accept, onDrop, items }) => {
  const [, drop] = useDrop({
    accept,
    drop: () => ({ name: accept }),
  });

  return (
    <div ref={drop} style={{ height: '100%', width: '100%' }}>
      {items.map((item, index) => (
        item.type === 'button' ? <Button key={index}>Button</Button> : null
      ))}
    </div>
  );
};

const BuilderPage = () => {
  const [components, setComponents] = useState([
	  { id: 1, type: 'button' },
	  { id: 2, type: 'image' },
	  { id: 3, type: 'text' },
	]);

  const [simulationComponents, setSimulationComponents] = useState([]);

  const moveComponent = useCallback((fromId, toId) => {
    setComponents((components) => components.filter((component) => component.id !== fromId));
    setSimulationComponents((components) => [...components, components.find((component) => component.id === fromId)]);
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="row">
        <div className="col-6">
          <h3>Simulador</h3>
          <Simulator accept={Object.values(ItemTypes)} onDrop={moveComponent} items={simulationComponents} />
        </div>
        <div className="col-6">
          <h3>Componentes</h3>
          <div className="component-list">
            {components.map((component) => (
			  <ComponentItem
			    key={component.id}
			    id={component.id}
			    type={component.type}
			    onMoveItem={moveComponent}
			  />
			))}
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default BuilderPage;
