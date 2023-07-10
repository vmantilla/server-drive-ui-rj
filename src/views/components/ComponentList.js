// Archivo: ComponentList.js

import React from 'react';
import { useDrag } from 'react-dnd';
import ComponentItem from './ComponentItem';

const ComponentList = ({ components }) => {
  return (
    <div>
      {components.map((component, index) => (
        <ComponentItem key={index} component={component} />
      ))}
    </div>
  );
};

export default ComponentList;
