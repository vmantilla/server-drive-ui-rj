import React, { useState, useEffect } from 'react';
import { App, View } from 'framework7-react';
import '../css/DragDropPreview.css';
import { createSDComponent } from '../helpers/createSDComponent';
import { renderComponentTree } from '../helpers/renderComponentTree';
import { useDrop } from 'react-dnd';
import SDComponent from '../models/structs/SDComponent'; // Asegúrate de importar tu clase SDComponent

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


  const handleDrop = (item) => {
    // Verificar si el componente ya existe en el simulador
    const isComponentAlreadyAdded = viewData.some((component) => component.id === item.id);
    if (isComponentAlreadyAdded) {
      return;
    }

    console.log('Component:', item.type);

    // Generar un ID aleatorio
    const randomId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    if (['VStack', 'HStack', 'ZStack'].includes(item.type)) {
      setBuilderData(prev => [...prev, new SDComponent(randomId, item.type, item.properties, [], item.states)]);
       console.log('Component stack:', item);
    } else {
      setBuilderData(prev => {
        const lastStackIndex = prev.length - 1;
        if (lastStackIndex >= 0 && ['VStack', 'HStack', 'ZStack'].includes(prev[lastStackIndex].type)) {
          prev[lastStackIndex].childrens.push(new SDComponent(randomId, item.type, item.properties, [], item.states));
        }
        return [...prev];
      });
       console.log('Component dropped:', item);
    }
};

  return (
    <App>
      <View main>
            <div className='simulator'>
              <div ref={drop} className={`${isOver ? 'isOver' : ''}`}>
            {sdComponents && sdComponents.length > 0 && sdComponents.map(childComponent => renderComponentTree(childComponent, true, isOver))}

    </div>
    </div>
      </View>
    </App>
  );
};

export default DragDropPreview;
