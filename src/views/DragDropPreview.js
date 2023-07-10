import React, { useState, useEffect, useRef } from 'react';
import { App, View } from 'framework7-react';
import '../css/DragDropPreview.css';
import { createSDComponent } from '../helpers/createSDComponent';
import { renderComponentTree } from '../helpers/renderComponentTree';
import { useDrop } from 'react-dnd';
import SDComponent from '../models/structs/SDComponent';

const DragDropPreview = ({ themesData, viewData, setBuilderData }) => {
  const [sdComponents, setSdComponents] = useState([]);
  const [activeStackId, setActiveStackId] = useState(null);

  const activeStackIdRef = useRef(null);

  useEffect(() => {
    const components = viewData.map((componentData) => {
      return createSDComponent(componentData, themesData);
    });
    setSdComponents(components);
  }, [viewData, themesData]);

  useEffect(() => {
    console.log("activeStackId changed:", activeStackIdRef.current);
    activeStackIdRef.current = activeStackId;
  }, [activeStackId]);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'component',
    drop: (item, monitor) => handleDrop(item, monitor),
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

    console.log("Dropped item: ", item);
    console.log("Generated ID for dropped item: ", randomId);
    console.log("activeStackId before setBuilderData: ", activeStackIdRef.current);

    setBuilderData(prev => {
      if (['VStack', 'HStack', 'ZStack'].includes(item.type)) {
        console.log("Dropped item 1: ", item);
        if (activeStackIdRef.current) {
          return addChildComponent(prev, activeStackIdRef.current, newComponent);
        } else {
          return [...prev, { ...newComponent, childrens: [] }];
        }
      } else if (activeStackIdRef.current && addNewComponent(prev, activeStackIdRef.current, newComponent)) {
        console.log("Dropped item 2: ", item);
        return [...prev];
      } else {
        console.log("Dropped item 3: ", item);
        const lastStack = prev.slice().reverse().find(component => ['VStack', 'HStack', 'ZStack'].includes(component.type));
        if (lastStack) {
          lastStack.childrens.push(newComponent);
        }
      }
      return [...prev];
    });

    setActiveStackId(null);
  };

  const addNewComponent = (components, activeId, newComponent) => {
    for (let component of components) {
      if (component.id === activeId) {
        component.childrens.push(newComponent);
        return true;
      } else if (component.childrens && addNewComponent(component.childrens, activeId, newComponent)) {
        return true;
      }
    }
    return false;
  };

  const addChildComponent = (components, parentId, childComponent) => {
    for (let component of components) {
      if (component.id === parentId) {
        component.childrens.push(childComponent);
        return components;
      } else if (component.childrens && component.childrens.length > 0) {
        const updatedChildrens = addChildComponent(component.childrens, parentId, childComponent);
        if (updatedChildrens !== component.childrens) {
          return components.map(c => c.id === component.id ? { ...component, childrens: updatedChildrens } : c);
        }
      }
    }
    return components;
  };

  return (
    <App>
      <View main>
        <div className='simulator'>
          <div ref={drop} className={`${isOver ? 'isOver' : ''}`}>
            {sdComponents && sdComponents.length > 0 && sdComponents.map(childComponent => renderComponentTree(childComponent, true, setActiveStackId))}
          </div>
        </div>
      </View>
    </App>
  );
};

export default DragDropPreview;
