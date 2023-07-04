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
    if (isComponentAlreadyAdded) {
      return;
    }

    if (['vstack', 'hstack', 'zstack'].includes(item.type)) {
      setSimulationComponents((prev) => [...prev, { ...item, children: [] }]);
    } else {
      setSimulationComponents((prev) => {
        const lastStackIndex = prev.length - 1;
        if (lastStackIndex >= 0 && ['vstack', 'hstack', 'zstack'].includes(prev[lastStackIndex].type)) {
          prev[lastStackIndex].children.push(item);
        }
        return [...prev];
      });
    }
  };

  return (
    <App>
      <View main>
        <div className="simulator" ref={drop}>
          {simulationComponents.map((component, index) => {
            let componentToRender;
            switch (component.type) {
              case 'vstack':
                componentToRender = <VStack key={index}>{component.children.map((child, i) => createChildComponent(child, i))}</VStack>;
                break;
              case 'hstack':
                componentToRender = <HStack key={index}>{component.children.map((child, i) => createChildComponent(child, i))}</HStack>;
                break;
              case 'zstack':
                componentToRender = <ZStack key={index}>{component.children.map((child, i) => createChildComponent(child, i))}</ZStack>;
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
  
  function createChildComponent(child, index) {
    switch (child.type) {
      case 'button':
        return <Button key={index}>{child.content}</Button>;
      case 'image':
        return <img src={child.content} alt="Dropped element" key={index} />;
      case 'text':
      case 'paragraph':
        return <p key={index}>{child.content}</p>;
      default:
        return null;
    }
  }
};

export default Simulator;
