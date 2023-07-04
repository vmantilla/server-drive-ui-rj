import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import ItemTypes from './ItemTypes';
import VStack from './VStack';
import HStack from './HStack';
import ZStack from './ZStack';

import { App, View, Button } from 'framework7-react';
import './css/Simulator.css';

const Simulator = ({ onDrop, items }) => {
  const [simulationComponents, setSimulationComponents] = useState([]);

  const [, drop] = useDrop({
    accept: Object.values(ItemTypes),
    drop: (item, monitor) => handleDrop(item),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const handleDrop = (item) => {
    // Verificar si el componente ya existe en el simulador
    const isComponentAlreadyAdded = simulationComponents.some((component) => component.id === item.id);
    if (!isComponentAlreadyAdded) {
      setSimulationComponents((prev) => [...prev, item]);
    }
  };

  return (
    <App>
      <View main>
        <div className="simulator" ref={drop}>
          {simulationComponents.map((component, index) => {
            let componentToRender;
            switch (component.type) {
              case 'button':
                componentToRender = <Button key={index}>{component.content}</Button>;
                break;
              case 'image':
                componentToRender = <img src={component.content} alt="Dropped element" key={index} />;
                break;
              case 'text':
                componentToRender = <p key={index}>{component.content}</p>;
                break;
              case 'paragraph':
                componentToRender = <p key={index}>{component.content}</p>;
                break;
              case 'vstack':
                componentToRender = <VStack key={index}></VStack>;
                break;
              case 'hstack':
                componentToRender = <HStack key={index}></HStack>;
                break;
              case 'zstack':
                componentToRender = <ZStack key={index}></ZStack>;
                break;
              default:
                componentToRender = null;
            }
            return componentToRender;
          })}
        </div>
      </View>
    </App>
  );
};

export default Simulator;
