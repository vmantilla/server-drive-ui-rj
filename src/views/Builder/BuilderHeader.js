import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBuilder } from './BuilderContext';
import '../../css/Builder/BuilderHeader.css';

const FloatingMenu = ({ visible, selectedOption, options, onClose, position, handleDragStart, handleDragEnd }) => {
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
    <button draggable="true" onDragEnd={handleDragEnd} onDragStart={(e) => handleDragStart(e, option.type, option.type)} className="floating-icon-button" key={index} onClick={option.onClick}>
      <i className={option.iconClass}></i>
      {option.type}
    </button>
  ));

  return (
    <div
      ref={menuRef}
      className={`floating-menu-${selectedOption}`}
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

function BuilderHeader({ isComponentsOpen, setIsComponentsOpen, projectName, selectedScreen, addNewPreview, onDelete, setComponentToAdd, shouldUpdate, updateChanges }) {
  const navigate = useNavigate();


  const { 
    uiScreens, setUiScreens,
    uiComponents, setUiComponents,
    uiComponentsProperties, setUiComponentsProperties
  } = useBuilder();


  const handleExit = () => {
    navigate('/dashboard'); 
  };
  

  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [menuOptions, setMenuOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState([]);

  const handleButtonPress = (e, componentType) => {
    const options = getOptionsForComponentType(componentType);
    const rect = e.target.getBoundingClientRect();
    const x = rect.left + (rect.width / 2);
    const y = rect.bottom + 20;

    setMenuOptions(options);
    setMenuPosition({ x: x, y: y });
    setMenuVisible(true);
    setSelectedOption(componentType);
  };

  const getOptionsForComponentType = (componentType) => {
  const options = [];

  switch (componentType) {
    case 'widget':
      options.push(
        { iconClass: "bi bi-distribute-horizontal", type: "Row", onClick: () => { /* Handle Row */ } },
        { iconClass: "bi bi-distribute-vertical", type: "Column", onClick: () => { /* Handle Column */ } },
        { iconClass: "bi bi-stack", type: "Overlay", onClick: () => { /* Handle Overlay */ } },
        { iconClass: "bi bi-card-text", type: "Scroll", onClick: () => { /* Handle Scroll */ } },
        { iconClass: "bi bi-list-task", type: "List", onClick: () => { /* Handle Button */ } },
        { iconClass: "bi bi-square", type: "Button", onClick: () => { /* Handle Button */ } },
        { iconClass: "bi bi-card-text", type: "Text", onClick: () => { /* Handle Text */ } },
        { iconClass: "bi bi-image", type: "Image", onClick: () => { /* Handle Image */ } },
        { iconClass: "bi bi-input-cursor", type: "InputText", onClick: () => { /* Handle InputText */ } },
        { iconClass: "bi bi-list-columns-reverse", type: "TextView", onClick: () => { /* Handle TextView */ } },
        { iconClass: "bi bi-arrows-angle-expand rotate-45", type: "Space", onClick: () => { /* Handle Space */ } }
      );
      break;

    case 'action':
        options.push(
            { iconClass: "bi bi-wrench", type: "OnClick", onClick: () => { /* Handle onClick */ } },
            { iconClass: "bi bi-wrench", type: "OnDoubleClick", onClick: () => { /* Handle onDoubleClick */ } },
            { iconClass: "bi bi-wrench", type: "OnLongPress", onClick: () => { /* Handle onLongPress */ } },
            { iconClass: "bi bi-wrench", type: "OnRightClick", onClick: () => { /* Handle onRightClick */ } },
            { iconClass: "bi bi-wrench", type: "OnHover", onClick: () => { /* Handle onHover */ } },
            { iconClass: "bi bi-wrench", type: "OnInputChange", onClick: () => { /* Handle onInputChange */ } },
            { iconClass: "bi bi-wrench", type: "OnInputFocus", onClick: () => { /* Handle onInputFocus */ } },
            { iconClass: "bi bi-wrench", type: "OnInputBlur", onClick: () => { /* Handle onInputBlur */ } },
            { iconClass: "bi bi-wrench", type: "OnSubmit", onClick: () => { /* Handle onSubmit */ } },
            { iconClass: "bi bi-wrench", type: "OnKeyPress", onClick: () => { /* Handle onKeyPress */ } },
            { iconClass: "bi bi-wrench", type: "OnKeyDown", onClick: () => { /* Handle onKeyDown */ } },
            { iconClass: "bi bi-wrench", type: "OnKeyUp", onClick: () => { /* Handle onKeyUp */ } },
            { iconClass: "bi bi-wrench", type: "OnScroll", onClick: () => { /* Handle onScroll */ } },
            { iconClass: "bi bi-wrench", type: "OnLoad", onClick: () => { /* Handle onLoad */ } },
            { iconClass: "bi bi-wrench", type: "OnUnload", onClick: () => { /* Handle onUnload */ } },
            { iconClass: "bi bi-wrench", type: "OnAppear", onClick: () => { /* Handle onAppear */ } },
            { iconClass: "bi bi-wrench", type: "OnDisappear", onClick: () => { /* Handle onDisappear */ } },
            { iconClass: "bi bi-wrench", type: "OnSwipe", onClick: () => { /* Handle onSwipe */ } },
            { iconClass: "bi bi-wrench", type: "OnRefresh", onClick: () => { /* Handle onRefresh */ } },
        );
        break;

    case 'instruction':
        options.push(
            { iconClass: "bi bi-diagram-3", type: "Conditional", onClick: () => { /* Handle onClick */ } },
            { iconClass: "bi bi-diagram-3", type: "Loop", onClick: () => { /* Handle onDoubleClick */ } },
            { iconClass: "bi bi-diagram-3", type: "Sequence", onClick: () => { /* Handle onLongPress */ } },
            { iconClass: "bi bi-diagram-3", type: "Set_Variable", onClick: () => { /* Handle onRightClick */ } },
            { iconClass: "bi bi-diagram-3", type: "Switch", onClick: () => { /* Handle onHover */ } },
            { iconClass: "bi bi-diagram-3", type: "Case", onClick: () => { /* Handle onHover */ } },
            { iconClass: "bi bi-cloud", type: "API_Call", onClick: () => { /* Handle onInputChange */ } },
            { iconClass: "bi bi-alarm", type: "Timer", onClick: () => { /* Handle onInputFocus */ } }
        );
        break;

    case 'space':
      options.push(
        
      );
      break;

    default:
      break;
  }

  return options;
};

  
  const handleDragStart = (e, componentType, componentTypeName) => {
    const uniqueId = Date.now().toString() + Math.random().toString().substr(2, 5);
    const propertiesUniqueId = Date.now().toString() + Math.random().toString().substr(2, 5);

    const newComponent = {
      id: uniqueId,
      name: componentType,
      component_type: selectedOption,
      sub_type: componentType.toLowerCase(),
      selected_option: selectedOption,
      children: [],
      expanded: false,
      isNew: true
    };
    setComponentToAdd(newComponent);
  };

  const handleDragEnd = () => {
      setComponentToAdd(null);
    };

  const handleClose = () => {
    setMenuVisible(false);
  };

  const previewUrl = `/preview/${selectedScreen}`;

  function saveToStorage(data) {
    localStorage.setItem('previewData', JSON.stringify(data));
  }

  return (
    <header className={`builder-header collapsed`}>
      <div className="left-container">
        <button 
          className={`menu-toggle ${isComponentsOpen ? 'pressed' : ''}`} 
          onClick={() => setIsComponentsOpen(!isComponentsOpen)}
        >
          <i className="bi bi-bezier2"></i>
        </button>

        <h1>{projectName}</h1>
      </div>

      <div className="icons-container">
        {selectedScreen === null ? (
          <button className="icon-button" onClick={addNewPreview}><i className="bi bi-window-plus"></i></button>
        ) : (
          <>
            <button className="icon-button" onClick={(e) => handleButtonPress(e, 'widget')}><i className="bi bi-columns-gap"></i></button>
            <button className="icon-button" onClick={(e) => handleButtonPress(e, 'action')}><i className="bi bi-wrench "></i></button>
            <button className="icon-button" onClick={(e) => handleButtonPress(e, 'instruction')}><i className="bi bi-diagram-3"></i></button>
          </>
        )}
      </div>
      <FloatingMenu visible={menuVisible} onClose={handleClose} position={menuPosition} selectedOption={selectedOption} options={menuOptions} handleDragStart={handleDragStart} handleDragEnd={handleDragEnd} />

      <div className="right-container">
      { selectedScreen !== null && (
        <div className="buttons-container">
          <button className={`builder-button ${shouldUpdate ? 'update-needed' : 'disabled-save-button'}`}
           onClick={() => updateChanges()}
           disabled={!shouldUpdate}>
            <i className="bi bi-cloud-upload-fill"></i>
            Guardar
          </button>
          <button className="builder-button" onClick={() => onDelete(selectedScreen)}>
            <i className="bi bi-trash"></i>
            Eliminar
          </button>
        </div>
        )}
        <a href={previewUrl} className="no-underline" target="_blank" rel="noopener noreferrer" onClick={() => saveToStorage({uiScreens, uiComponents, uiComponentsProperties})}>
        <button className="builder-button">
            <i className="bi bi-collection-play-fill"></i>
            Preview
          </button>
          </a>
        <button className="builder-button" onClick={handleExit}>
            <i className="bi bi-x"></i>
            Salir
          </button>
      </div>
    </header>
  );
}

export default BuilderHeader;
