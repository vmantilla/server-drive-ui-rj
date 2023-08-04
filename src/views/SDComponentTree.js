import React, { useState, useRef, useEffect } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';

const SDComponentTree = ({ component, selectedComponent, setSelectedComponent }) => {
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
        <span className="ms-2">{component.properties.component_type} {childrenCount > 0 && `[${childrenCount}]`}</span>
        {isSelected && (
          <span onClick={(e) => e.stopPropagation()} style={{ cursor: 'pointer', marginLeft: '15px' }}>
            <i className="bi bi-three-dots" onClick={() => setMenuOpen(!menuOpen)}></i>
            {menuOpen && (
              <div ref={menuRef} style={menuStyle}>
                <div
                  onClick={() => console.log('Embeber dentro de un Contenedor')}
                  style={{ padding: '5px', cursor: 'pointer' }}
                  onMouseOver={(e) => (e.target.style.background = '#f0f8ff')}
                  onMouseOut={(e) => (e.target.style.background = 'transparent')}
                >
                  Embeber dentro de un Contenedor
                </div>
                <div
                  onClick={() => console.log('Agregar un contenedor')}
                  style={{ padding: '5px', cursor: 'pointer' }}
                  onMouseOver={(e) => (e.target.style.background = '#f0f8ff')}
                  onMouseOut={(e) => (e.target.style.background = 'transparent')}
                >
                  Agregar un contenedor
                </div>
                <hr style={{ margin: '5px 0' }} />
                <div
                  onClick={() => console.log('Agregar un objeto')}
                  style={{ padding: '5px', cursor: 'pointer' }}
                  onMouseOver={(e) => (e.target.style.background = '#f0f8ff')}
                  onMouseOut={(e) => (e.target.style.background = 'transparent')}
                >
                  Agregar un objeto
                </div>
                {/* ... otras opciones ... */}
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
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SDComponentTree;
