import React, { useState, useEffect } from 'react';
import { App, View } from 'framework7-react';
import '../css/DragDropPreview.css';
import { createSDComponent } from '../helpers/createSDComponent';
import { renderComponentTree } from '../helpers/renderComponentTree';
import { useDrop } from 'react-dnd';
import SDComponent from '../models/structs/SDComponent';

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
    drop: (item) => handleDrop(item),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const handleDrop = (item) => {
    const randomId =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    const newComponent = new SDComponent(
      randomId,
      item.type,
      item.properties,
      [],
      item.states
    );

    setBuilderData(prev => {
      const isStackType = ['VStack', 'HStack', 'ZStack'].includes(item.type);

      if (isStackType) {
        return [...prev, { ...newComponent, childrens: [] }];
      } else {
        const lastStack = prev.slice().reverse().find(component => ['VStack', 'HStack', 'ZStack'].includes(component.type));
        if (lastStack) {
          lastStack.childrens.push(newComponent);
        }
        return [...prev];
      }
    });
  };

  return (
    <App>
      <View main>
        <div className='simulator'>
          <div ref={drop} className={`${isOver ? 'isOver' : ''}`}>
            {sdComponents && sdComponents.length > 0 && sdComponents.map(childComponent => renderComponentTree(childComponent, true))}
          </div>
        </div>
      </View>
    </App>
  );
};

export default DragDropPreview;
