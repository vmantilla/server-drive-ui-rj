import React from 'react';

const ComponentList = ({ onAddComponent, onSelectComponent }) => {
  const components = [
    { id: '1', name: 'ButtonTest' },
    { id: '2', name: 'ImageTest' },
    { id: '3', name: 'TextFieldTest' },
    { id: '4', name: 'HStackTest' },
    { id: '5', name: 'VStackTest' },
    { id: '6', name: 'ZStackTest' },
    { id: '7', name: 'TextTest' },
    { id: '8', name: 'ScrollViewTest' },
  ];

  const handleAddClick = (componentName) => {
    onAddComponent(componentName);
  };

  const handleSelectClick = (componentName) => {
    onSelectComponent(componentName);
  };

  return (
    <ul className="component-list">
      {components.map((component) => (
        <li key={component.id}>
          <button onClick={() => handleAddClick(component.name)}>Añadir</button>
          <button onClick={() => handleSelectClick(component.name)}>Seleccionar</button>
          {component.name}
        </li>
      ))}
    </ul>
  );
};

export default ComponentList;
