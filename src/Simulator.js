import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import { ItemTypes } from './ComponentItem';
import { Button } from 'framework7-react';
import './css/Simulator.css'; // Importa los estilos de tu simulador

const Simulator = ({ components }) => {
  const [simulationComponents, setSimulationComponents] = useState([]);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: [ItemTypes.BUTTON, ItemTypes.IMAGE, ItemTypes.TEXT],
    drop: (item, monitor) => handleDrop(item),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const handleDrop = (item) => {
    setSimulationComponents((prev) => [...prev, item]);
  };

  return (
    <div className={`simulator ${isOver ? 'over' : ''}`} ref={drop}>
      {simulationComponents.map((component, index) => (
        <Button key={index}>{component.name}</Button>
      ))}
    </div>
  );
};

export default Simulator;
