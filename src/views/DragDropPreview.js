// Archivo: DragDropPreview.js

import React, { useState, useEffect } from 'react';
import { App, View } from 'framework7-react';
import '../css/Simulator.css';
import { createSDComponent } from '../helpers/createSDComponent';
import { renderComponentTree } from '../helpers/renderComponentTree';
import { useDrop } from 'react-dnd';

const DragDropPreview = ({ themesData, viewData, setBuilderData }) => {
  const [sdComponents, setSdComponents] = useState([]);

  useEffect(() => {
    const components = viewData.map((componentData) => {
      return createSDComponent(componentData, themesData);
    });
    setSdComponents(components);
  }, [viewData, themesData]);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'component',
    drop: (item, monitor) => handleDrop(item, monitor),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const handleDrop = (item, monitor) => {
    console.log('Component dropped:', item);
    // Here you would typically handle the dropped component, e.g., add it to your component list
      setBuilderData([...viewData, item]);
  };

  return (
    <App>
      <View main>
        <div ref={drop} className={`simulator ${isOver ? 'over' : ''}`}>
          {sdComponents ? sdComponents.map(renderComponentTree) : 'Cargando...'}
        </div>
      </View>
    </App>
  );
};

export default DragDropPreview;
