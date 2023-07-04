// DropArea.js
import React from 'react';
import { useDrop } from 'react-dnd';
import ItemTypes from './ItemTypes';
import VStack from './VStack';
import HStack from './HStack';
import ZStack from './ZStack';

import { Button } from 'framework7-react';

const DropArea = ({ items }) => {
  return (
    <div className="dropArea">
      {items.map((component, index) => {
        let componentToRender;
        switch (component.type) {
          case 'button':
            componentToRender = <Button key={index}>{component.content}</Button>;
            break;
          case 'image':
            componentToRender = <img src={component.content} alt="Dropped element" key={index} />;
            break;
          case 'text':
          case 'paragraph':
            componentToRender = <p key={index}>{component.content}</p>;
            break;
          case 'vstack':
            componentToRender = <VStack key={index} />;
            break;
          case 'hstack':
            componentToRender = <HStack key={index} />;
            break;
          case 'zstack':
            componentToRender = <ZStack key={index} />;
            break;
          default:
            componentToRender = null;
        }
        return componentToRender;
      })}
    </div>
  );
};

export default DropArea;
