// Archivo: ComponentList.js

import React from 'react';
import { useDrag } from 'react-dnd';
import ComponentItem from './ComponentItem';

const ComponentList = ({ components, moveCard }) => {
  return (
    <div>
      {components.map((component, index) => (
        <ComponentItem key={index} component={component} moveCard={moveCard}/>
      ))}
    </div>
  );
};

export default ComponentList;
