import React, { useState, useCallback } from 'react';
import { DndProvider, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ComponentItem from './ComponentItem';
import Simulator from './Simulator';
import ItemTypes from './ItemTypes';

const BuilderPage = () => {
  const [components, setComponents] = useState([
    { id: 1, type: 'button', content: 'Botón' },
    { id: 2, type: 'image', content: 'URL de tu imagen' },
    { id: 3, type: 'text', content: 'Texto' },
    { id: 4, type: 'paragraph', content: 'Párrafo' },
  ]);

  const [simulationComponents, setSimulationComponents] = useState([]);

  const moveComponent = useCallback((id) => {
    const component = components.find((component) => component.id === id);
    setSimulationComponents((components) => [...components, component]);
  }, [components]);

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
                content={component.content}
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
