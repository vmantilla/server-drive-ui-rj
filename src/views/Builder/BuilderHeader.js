import React, { useEffect, useRef, useState } from 'react';
import '../../css/Builder/BuilderHeader.css';

const FloatingMenu = ({ visible, options, onClose, position, handleDragStart }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  if (!visible) return null;

  const buttonElements = options.map((option, index) => (
    <button draggable="true" onDragStart={(e) => handleDragStart(e, "container", option.type)} className="floating-icon-button" key={index} onClick={option.onClick}>
      <i className={option.iconClass}></i>
      {option.type}
    </button>
  ));


  return (
    <div
      ref={menuRef}
      className="floating-menu"
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
        transform: `translateX(-50%)`,
      }}
    >
      {buttonElements}
    </div>
  );
};

function BuilderHeader({ isComponentsOpen, setIsComponentsOpen, selectedScreen, addNewPreview, updatePreview, onDelete }) {

  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [menuOptions, setMenuOptions] = useState([]);

  const handleButtonPress = (e, componentType) => {
    const options = getOptionsForComponentType(componentType);
    const rect = e.target.getBoundingClientRect();
    const x = rect.left + (rect.width / 2);
    const y = rect.bottom + 20;

    setMenuOptions(options);
    setMenuPosition({ x: x, y: y });
    setMenuVisible(true);
  };

  const getOptionsForComponentType = (componentType) => {
  const options = [];

  switch (componentType) {
    case 'container':
      options.push(
        { iconClass: "bi bi-distribute-horizontal", type: "Row", onClick: () => { /* Handle Row */ } },
        { iconClass: "bi bi-distribute-vertical", type: "Column", onClick: () => { /* Handle Column */ } },
        { iconClass: "bi bi-stack", type: "Overlay", onClick: () => { /* Handle Overlay */ } },
        { iconClass: "bi bi-card-text", type: "Scroll", onClick: () => { /* Handle Scroll */ } },
        { iconClass: "bi bi-square", type: "Button", onClick: () => { /* Handle Button */ } }
      );
      break;

    case 'object':
      options.push(
        { iconClass: "bi bi-card-text", type: "Text", onClick: () => { /* Handle Text */ } },
        { iconClass: "bi bi-image", type: "Image", onClick: () => { /* Handle Image */ } },
        { iconClass: "bi bi-input-cursor", type: "InputText", onClick: () => { /* Handle InputText */ } },
        { iconClass: "bi bi-list-columns-reverse", type: "TextView", onClick: () => { /* Handle TextView */ } }
      );
      break;

    case 'space':
      options.push(
        { iconClass: "bi bi-arrows-angle-expand rotate-45", type: "Space", onClick: () => { /* Handle Space */ } }
      );
      break;

    default:
      break;
  }

  return options;
};

  
  const handleDragStart = (e, componentType, componentTypeName) => {
    e.dataTransfer.setData('text/plain', componentType);
    e.dataTransfer.setData('source', "header");

    const uniqueId = Date.now().toString() + Math.random().toString().substr(2, 5);
    const propertiesUniqueId = Date.now().toString() + Math.random().toString().substr(2, 5);

    const newComponent = {
      id: uniqueId,
      type: componentType,
      children: [],
      expanded: false,
      properties: {
        id: propertiesUniqueId,
        component_type: componentTypeName,
      },
    };
    e.dataTransfer.setData('component', JSON.stringify(newComponent));
  };

  const handleClose = () => {
    setMenuVisible(false);
  };

  return (
    <header className={`builder-header collapsed`}>
      <div className="left-container">
        <button 
          className={`menu-toggle ${isComponentsOpen ? 'pressed' : ''}`} 
          onClick={() => setIsComponentsOpen(!isComponentsOpen)}
        >
          <i className="bi bi-bezier2"></i>
        </button>

        <h1>Workspace</h1>
      </div>

      <div className="icons-container">
        {selectedScreen === null ? (
          <button className="icon-button" onClick={addNewPreview}><i className="bi bi-window-plus"></i></button>
        ) : (
          <>
            <button className="icon-button" onClick={(e) => handleButtonPress(e, 'container')}><i className="bi bi-columns-gap"></i></button>
            <button className="icon-button" onClick={(e) => handleButtonPress(e, 'object')}><i className="bi bi-box"></i></button>
            <button className="icon-button" onClick={(e) => handleButtonPress(e, 'space')}><i className="bi bi-arrows-angle-expand rotate-45 "></i></button>
          </>
        )}
      </div>
      <FloatingMenu visible={menuVisible} onClose={handleClose} position={menuPosition} options={menuOptions} handleDragStart={handleDragStart} />

      <div className="right-container">
      { selectedScreen !== null && (
        <div className="buttons-container">
          <button className="builder-button" onClick={() => updatePreview(selectedScreen)}>
            <i className="bi bi-cloud-upload-fill"></i>
            Guardar
          </button>
          <button className="builder-button" onClick={() => onDelete(selectedScreen)}>
            <i className="bi bi-trash"></i>
            Eliminar
          </button>
          <button className="builder-button">
            <i className="bi bi-collection-play-fill"></i>
            Preview
          </button>
          <button className="builder-button">
            <i className="bi bi-x"></i>
            Salir
          </button>
        </div>
        )}
      </div>
    </header>
  );
}

export default BuilderHeader;
