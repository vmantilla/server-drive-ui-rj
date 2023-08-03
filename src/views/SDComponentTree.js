import React, { useState } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';

const SDComponentTree = ({ component, selectedComponent, setSelectedComponent }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = (e) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const selectComponent = () => {
    setSelectedComponent(component);
  };

  const hasChildren = component.children && component.children.length > 0;
  const childrenCount = hasChildren ? component.children.length : 0; // Cantidad de hijos
  const isObject = component.component_type === 'Object';
  const isSelected = selectedComponent && selectedComponent.id === component.id;

  return (
    <div>
      <div
        onClick={selectComponent}
        className={`mb-1 p-2 ${isSelected ? 'border border-primary rounded' : ''}`}
        style={{
          cursor: 'pointer',
          background: isSelected ? '#f0f8ff' : 'transparent',
        }}
      >
        <span onClick={toggleExpanded} className="me-2" style={{ cursor: 'pointer' }}>
          {hasChildren ? (
            isExpanded ? <i className="bi bi-chevron-down"></i> : <i className="bi bi-chevron-right"></i>
          ) : (
            <span style={{ width: '1rem', display: 'inline-block' }} />
          )}
        </span>
        <i className={`bi ${isObject ? 'bi-file-earmark' : 'bi-file-earmark-text'}`} />
        <span className="ms-2">{component.properties.component_type} {childrenCount > 0 && `[${childrenCount}]`}</span>
        {/* Mostrar cantidad de hijos entre corchetes solo si es mayor a cero */}
      </div>
      {isExpanded && hasChildren && (
        <div style={{ marginLeft: '20px' }}>
          {component.children.map((child, index) => (
            <SDComponentTree
              key={index}
              component={child}
              selectedComponent={selectedComponent}
              setSelectedComponent={setSelectedComponent}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SDComponentTree;
