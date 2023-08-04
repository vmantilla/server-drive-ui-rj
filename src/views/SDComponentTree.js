import React, { useState, useRef, useEffect } from 'react';
import SDComponent from '../models/structs/SDComponent';
import SDComponentType from '../enums/SDComponentType';
import { getDefaultProps, getDefaultTextViewProperties } from './components/GetDefaultProps';
import { v4 as uuidv4 } from 'uuid';
import 'bootstrap-icons/font/bootstrap-icons.css';

const SDComponentTree = ({ component, selectedComponent, setSelectedComponent, setDroppedComponents, deleteComponentfunc }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const componentRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleExpanded = (e) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const selectComponent = () => {
    setMenuOpen(false);
    setSelectedComponent(component);
  };

  const menuItems = Object.keys(SDComponentType).map((key) => ({
    label: `Add ${SDComponentType[key]}`,
    type: SDComponentType[key]
  }));

  const handleAddComponent = (type) => {
    const componentChildren = [];

    if (type === SDComponentType.Button) {
      componentChildren.push(new SDComponent(
        uuidv4(),
        SDComponentType.Object,
        getDefaultTextViewProperties(),
        [],
        {}
      ));
    }

    const newComponent = new SDComponent(
      uuidv4(),
      type,
      getDefaultProps(type),
      componentChildren,
      {}
    );

    setDroppedComponents(prevComponents => {
      const addComponentToSelected = (comp) => {
        if (comp.id === selectedComponent.id) {
          comp.children.push(newComponent);
          return;
        }
        comp.children.forEach(addComponentToSelected);
      };

      let newComponents = [...prevComponents];
      newComponents.forEach(addComponentToSelected);
      return newComponents;
    });

    setMenuOpen(false);
  };

  const handleDeleteComponent = (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este componente?")) {
      deleteComponentfunc(id);
    }
  };


  let menuStyle = { position: 'absolute', background: 'white', border: '1px solid #ccc' };

  if (menuOpen && componentRef.current) {
    const rect = componentRef.current.getBoundingClientRect();
    menuStyle = {
      ...menuStyle,
      top: `${rect.bottom - 85}px`,
      left: `${rect.left + 20}px`,
    };
  }

  const hasChildren = component.children && component.children.length > 0;
  const childrenCount = hasChildren ? component.children.length : 0;
  const isObject = component.component_type === 'Object';
  const isSelected = selectedComponent && selectedComponent.id === component.id;
  const componentLabel = component.component_type === SDComponentType.Button ? 'Button' : component.properties.component_type;

  return (
    <div>
      <div
        ref={componentRef}
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
        <span className="ms-2">{componentLabel} {childrenCount > 0 && `[${childrenCount}]`}</span>
        {isSelected && (
          <span onClick={(e) => e.stopPropagation()} style={{ cursor: 'pointer', marginLeft: '15px' }}>
            <i className="bi bi-three-dots" onClick={() => setMenuOpen(!menuOpen)}></i>
            {menuOpen && (
              <div ref={menuRef} style={menuStyle}>
                {menuItems.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => handleAddComponent(item.type)}
                    style={{ padding: '5px', cursor: 'pointer' }}
                    onMouseOver={(e) => (e.target.style.background = '#f0f8ff')}
                    onMouseOut={(e) => (e.target.style.background = 'transparent')}
                  >
                    {item.label}
                  </div>
                ))}
                <hr />
                <div
                  onClick={() => handleDeleteComponent(component.id)}
                  style={{ padding: '5px', cursor: 'pointer', color: 'red' }}
                  onMouseOver={(e) => (e.target.style.background = '#f0f8ff')}
                  onMouseOut={(e) => (e.target.style.background = 'transparent')}
                >
                  Delete Component
                </div>
              </div>
            )}
          </span>
        )}
      </div>
      {isExpanded && hasChildren && (
        <div style={{ marginLeft: '20px' }}>
          {component.children.map((child, index) => (
            <SDComponentTree
              key={index}
              component={child}
              selectedComponent={selectedComponent}
              setSelectedComponent={setSelectedComponent}
              setDroppedComponents={setDroppedComponents}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SDComponentTree;
