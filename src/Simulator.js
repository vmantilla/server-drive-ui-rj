import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import ItemTypes from './ItemTypes';

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
    setSimulationComponents((prev) => [...prev, item]);
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
