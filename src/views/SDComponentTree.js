import React, { useState, useRef, useEffect } from 'react';
import SDComponent from '../models/structs/SDComponent';
import SDComponentType from '../enums/SDComponentType';

const SDComponentTree = ({ component, selectedComponent, setSelectedComponent, handleAddComponent, handleDeleteComponent, handleDuplicateComponent, handleEmbedComponent, handleMoveComponent }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const componentRef = useRef(null);
  const [hoverComponent, setHoverComponent] = useState(null);

const handleDragEnter = (e) => {
  e.preventDefault();
  if (e.currentTarget === componentRef.current) {
    setHoverComponent(component);
  }
};

const handleDragLeave = (e) => {
  e.preventDefault();
  if (e.currentTarget === componentRef.current) {
    setHoverComponent(null);
  }
};


  const handleDragStart = (e) => {
    e.stopPropagation();
    e.dataTransfer.setData('text/plain', component.id);
  };

  const handleDragOver = (e) => {
  const childId = e.dataTransfer.getData('text/plain');
  
  // Comprobar si el componente es un objeto
  if (component.component_type === 'Object') return;

  // Comprobar si el componente es un Spacer
  if (component.component_type === 'Space') return;

  // Comprobar si el origen y el destino son el mismo
  if (component.id === childId) return;

  // Comprobar si el ID del padre es el mismo que el del hijo
  if (component.parentId === childId) return;

  // Comprobar si es dentro del mismo padre
  if (component.parentId && selectedComponent && component.parentId === selectedComponent.parentId) return;

  e.preventDefault();
};

const handleDrop = (e) => {
  e.preventDefault();
  e.stopPropagation();
  
  const childId = e.dataTransfer.getData('text/plain');
  
  // Comprobar si el componente es un objeto
  if (component.component_type === 'Object') return;

  // Comprobar si el componente es un Spacer
  if (component.component_type === 'Space') return;

  // Comprobar si el origen y el destino son el mismo
  if (component.id === childId) return;

  // Comprobar si el ID del padre es el mismo que el del hijo
  if (component.parentId === childId) return;

  // Comprobar si es dentro del mismo padre
  if (component.parentId && selectedComponent && component.parentId === selectedComponent.parentId) return;

  handleMoveComponent(childId, component.id);
};


  const menuItems = [];

// Solo agregar estas opciones si el componente no es "Object" o "Space"
if (component.component_type !== 'Object' && component.component_type !== 'Space') {
  menuItems.push(
    {
      label: "Add",
      isNonInteractive: true,
      subItems: ["ContainerView", "Button", "ScrollView"].map((type) => ({
        label: `${type}`,
        type: type,
        action: () => handleAddComponent(type)
      })),
    },
    { label: "Add Object", type: "Object", action: () => handleAddComponent("Object") },
    { label: "Add Space", type: "Space", action: () => handleAddComponent("Space") },
    { separator: true }
  );
}

// Aquí están el resto de los elementos del menú, que siempre estarán presentes
menuItems.push(
  {
    label: "Duplicate Component",
    action: () => handleDuplicateComponent(component.id),
    style: { color: "black" },
  },
  { separator: true },
  {
    label: "Embed",
    isNonInteractive: true, // Marcar este elemento como no interactivo
    subItems: ["ContainerView", "Button", "ScrollView"].map((type) => ({
      label: `In ${type}`,
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
);


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
  const componentLabel = component && component.component_type === SDComponentType.Button
  ? 'Button'
  : component && component.component_type === SDComponentType.ScrollView
  ? 'ScrollView'
  : component && component.properties
    ? component.properties.component_type
    : 'Unknown';

  return (
  	<div >
  	<div >
    <div ref={componentRef}
  draggable
  onDragStart={handleDragStart}
  onDragOver={handleDragOver}
  onDragEnter={handleDragEnter}
  onDragLeave={handleDragLeave}
  onDrop={handleDrop}
  onClick={selectComponent}
  className={`mb-0 p-1 ${isSelected ? 'border border-primary rounded' : ''}`}
  style={{
    cursor: 'pointer',
    background: isSelected ? '#f0f8ff' : (hoverComponent === component ? '#00aaff' : 'transparent'),
    border: hoverComponent === component ? '3px solid #0077cc' : '',
    borderRadius: '5px',
    width: hoverComponent === component ? '100%' : ''
  }}>
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
      {isExpanded && hasChildren && (<div style={{ marginLeft: '20px' }}>{component.children.map((child, index) => (<SDComponentTree key={index} component={child} selectedComponent={selectedComponent} setSelectedComponent={setSelectedComponent} handleAddComponent={handleAddComponent} handleDeleteComponent={handleDeleteComponent} handleDuplicateComponent={handleDuplicateComponent} handleEmbedComponent={handleEmbedComponent} handleMoveComponent={handleMoveComponent}/>))}</div>)}
    </div>
  );
};

export default SDComponentTree;
