import React, { useEffect, useRef, useState } from 'react';
import '../../css/Builder/BuilderHeader.css';

const FloatingMenu = ({ visible, options, onClose, position }) => {
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
    <button className="icon-button" key={index} onClick={option.onClick}>
      <i className={option.iconClass}></i>
    </button>
  ));

  return (
    <div
      ref={menuRef}
      className="floating-menu"
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
        transform: `translateX(-40%)`,
      }}
    >
      {buttonElements}
    </div>
  );
};

function BuilderHeader({ isComponentsOpen, setIsComponentsOpen, selectedScreen, addNewPreview }) {

  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [menuOptions, setMenuOptions] = useState([]);

  const handleButtonPress = (e, componentType) => {
    const options = getOptionsForComponentType(componentType);
    const rect = e.target.getBoundingClientRect();
    const x = rect.left;
    const y = 80;

    setMenuOptions(options);
    setMenuPosition({ x: x, y: y });
    setMenuVisible(true);
  };

  const getOptionsForComponentType = (componentType) => {
    switch (componentType) {
      case 'container':
        return ['Option 1', 'Option 2', 'Option 3'];
      case 'object':
        return ['Option A', 'Option B', 'Option C'];
      case 'space':
        return ['Option X', 'Option Y', 'Option Z'];
      default:
        return [];
    }
  };
  
  const handleDragStart = (e, componentType) => {
    e.dataTransfer.setData('text/plain', componentType);
    e.dataTransfer.setData('source', "header");

    const uniqueId = Date.now().toString() + Math.random().toString().substr(2, 5);
    const propertiesUniqueId = Date.now().toString() + Math.random().toString().substr(2, 5);

    let componentTypeName = "";

    switch (componentType) {
      case "container":
        componentTypeName = "Row";
        break;
      case "object":
        componentTypeName = "Object";
        break;
      case "space":
        componentTypeName = "Space";
        break;
      default:
        break;
    }

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
            <button className="icon-button" draggable="true" onDragStart={(e) => handleDragStart(e, "container")} onClick={(e) => handleButtonPress(e, 'container')}><i className="bi bi-columns-gap"></i></button>
            <button className="icon-button" draggable="true" onDragStart={(e) => handleDragStart(e, "object")} onClick={(e) => handleButtonPress(e, 'object')}><i className="bi bi-box"></i></button>
            <button className="icon-button" draggable="true" onDragStart={(e) => handleDragStart(e, "space")} onClick={(e) => handleButtonPress(e, 'space')}><i className="bi bi-arrows-angle-expand rotate-45 "></i></button>
          </>
        )}
      </div>
      <FloatingMenu visible={menuVisible} onClose={handleClose} position={menuPosition} options={menuOptions} />

      <div className="right-container">
        <div className="buttons-container">
          <button className="builder-button">
            <i className="bi bi-cloud-upload-fill"></i>
            Guardar
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
      </div>
    </header>
  );
}

export default BuilderHeader;
