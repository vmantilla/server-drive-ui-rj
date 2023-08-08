import React, { useState, useRef, useEffect } from 'react';
import SDComponent from '../models/structs/SDComponent';
import SDComponentType from '../enums/SDComponentType';

import 'bootstrap-icons/font/bootstrap-icons.css';

const SDComponentTree = ({ component, selectedComponent, setSelectedComponent, setDroppedComponents, handleAddComponent, handleDeleteComponent, handleDuplicateComponent, handleEmbedComponent, handleMoveComponent }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const componentRef = useRef(null);

  const menuItems = [
    {
      label: "Add Container",
      isNonInteractive: true,
      subItems: ["ContainerView", "Button", "ScrollView"].map((type) => ({
        label: `Add ${type}`,
        type: type,
        action: () => handleAddComponent(type)
      })),
    },
    { label: "Add Object", type: "Object", action: () => handleAddComponent("Object") },
    { label: "Add Space", type: "Space", action: () => handleAddComponent("Space") },
    { separator: true },
    {
      label: "Duplicate Component",
      action: () => handleDuplicateComponent(component.id),
      style: { color: "black" },
    },
    { separator: true },
    {
      label: "Embed in",
      isNonInteractive: true, // Marcar este elemento como no interactivo
      subItems: ["ContainerView", "Button", "ScrollView"].map((type) => ({
        label: `Add ${type}`,
        type: type,
        action: () => handleEmbedComponent(type, component.id)
      })),
    },
    { separator: true },
    {
      label: "Delete Component",
      action: () => handleDeleteComponent(component.id),
      style: { color: "red" },
    },
  ];

  useEffect(() => {
    const handleClickOutside = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleExpanded = (e) => { e.stopPropagation(); setIsExpanded(!isExpanded); };
  const selectComponent = () => { setMenuOpen(false); setSelectedComponent(component); };
  const handleComponentSelected = (type) => {
  	handleAddComponent(type)
    setTimeout(() => {
    setMenuOpen(false);
  }, 1000);
  };
  
  let menuStyle = { position: 'absolute', background: 'white', border: '1px solid #ccc' };
  if (menuOpen && componentRef.current) {
    const rect = componentRef.current.getBoundingClientRect();
    menuStyle = { ...menuStyle, top: `${rect.bottom - 85}px`, left: `${rect.left + 20}px` };
  }

  const hasChildren = component.children && component.children.length > 0;
  const childrenCount = hasChildren ? component.children.length : 0;
  const isObject = component.component_type === 'Object';
  const isSelected = selectedComponent && selectedComponent.id === component.id;
  const componentLabel = component.component_type === SDComponentType.Button ? 'Button' : component.properties.component_type;

  return (
    <div>
   <div>
    <div ref={componentRef} onClick={selectComponent} className={`mb-1 p-2 ${isSelected ? 'border border-primary rounded' : ''}`} style={{ cursor: 'pointer', background: isSelected ? '#f0f8ff' : 'transparent' }}>
      <span onClick={toggleExpanded} className="me-2" style={{ cursor: 'pointer' }}>{hasChildren ? (isExpanded ? <i className="bi bi-chevron-down"></i> : <i className="bi bi-chevron-right"></i>) : <span style={{ width: '1rem', display: 'inline-block' }} />}</span>
      <i className={`bi ${isObject ? 'bi-file-earmark' : 'bi-file-earmark-text'}`} />
      <span className="ms-2" style={{ fontSize: '0.8rem', color: 'black' }}>{componentLabel} {childrenCount > 0 && <span style={{ fontSize: '0.8rem', color: 'black' }}>{`[${childrenCount}]`}</span>}</span> {/* Aquí aplicamos los estilos a las etiquetas de componentes y el contador de hijos */}
      {isSelected && (
  <span onClick={(e) => e.stopPropagation()} style={{ cursor: 'pointer', marginLeft: '15px' }}>
    <i className="bi bi-three-dots" onClick={() => setMenuOpen(!menuOpen)}></i>
    {menuOpen && (
      <div ref={menuRef} style={menuStyle}>
        {menuItems.map((item, index) => (
          <React.Fragment key={index}>
            {item.separator ? (
              <hr style={{ margin: '5px 0' }} />
            ) : (
              <div
                style={{
                  padding: '5px',
                  fontSize: '0.8rem',
                  color: item.subItems ? 'grey' : 'black',
                  cursor: item.subItems ? 'default' : 'pointer',
                  ...item.style,
                }}
                onClick={() => {
				    if (item.action) {
				      item.action();
				      setMenuOpen(false);
				    }
				  }}
                onMouseOver={item.subItems ? null : (e) => (e.target.style.background = '#f0f8ff')}
                onMouseOut={item.subItems ? null : (e) => (e.target.style.background = 'transparent')}
              >
                {item.label}
                {item.subItems &&
                  item.subItems.map((subItem, subIndex) => (
                    <div
                      key={subIndex}
                      onClick={() => {
						    if (subItem.action) {
						      subItem.action();
						      setMenuOpen(false);
						    }
						  }}
                      style={{
                        padding: '5px 20px',
                        cursor: 'pointer',
                        color: 'black', // Asegurando que los hijos tengan el color negro
                      }}
                      onMouseOver={(e) => (e.target.style.background = '#f0f8ff')}
                      onMouseOut={(e) => (e.target.style.background = 'transparent')}
                    >
                      {subItem.label}
                    </div>
                  ))}
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    )}
  </span>
)}



      </div>
      </div>
      {isExpanded && hasChildren && (<div style={{ marginLeft: '20px' }}>{component.children.map((child, index) => (<SDComponentTree key={index} component={child} selectedComponent={selectedComponent} setSelectedComponent={setSelectedComponent} setDroppedComponents={setDroppedComponents} handleAddComponent={handleAddComponent} handleDeleteComponent={handleDeleteComponent} handleDuplicateComponent={handleDuplicateComponent} handleEmbedComponent={handleEmbedComponent} handleMoveComponent={handleMoveComponent}/>))}</div>)}
    </div>
  );
};

export default SDComponentTree;
