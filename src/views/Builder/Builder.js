import React, { useState, useRef } from 'react';
import BuilderHeader from './BuilderHeader';
import ScreenBuilder from './ScreenBuilder';
import '../../css/Builder/Builder.css';

function Builder() {
  const [isComponentsOpen, setIsComponentsOpen] = useState(true);
  const [isPropertiesOpen, setIsPropertiesOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedScreen, setSelectedScreen] = useState(null);

  const zoomIntervalRef = useRef(null);
  const workspaceRef = useRef(null);

  const screensInitialState = [
    { id: 1, content: "Hello World 1!" },
    { id: 2, content: "Hello World 2!" },
    { id: 3, content: "Hello World 2!" },
    { id: 4, content: "Hello World 2!" }
  ];

  const [screens, setScreens] = useState(screensInitialState);

  const handleScreenPositionChange = (id, newPosition) => {
    const updatedScreens = screens.map(screen =>
      screen.id === id ? { ...screen, position: newPosition } : screen
    );
    setScreens(updatedScreens);
  };

  const handleZoomInPress = () => {
    zoomIn();
    zoomIntervalRef.current = setInterval(zoomIn, 100);
  };

  const handleZoomOutPress = () => {
    zoomOut();
    zoomIntervalRef.current = setInterval(zoomOut, 100);
  };

  const handleZoomButtonRelease = () => clearInterval(zoomIntervalRef.current);

  const adjustScreenPosition = () => {
    resetZoom();

    if (workspaceRef.current) {
      const selectedScreenObject = screens.find(screen => screen.id === selectedScreen);
      if (selectedScreenObject && selectedScreenObject.position) {
          workspaceRef.current.scrollTop = selectedScreenObject.position.y * zoomLevel;
      }
    }
  };

  const zoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.05, 2));
    forceReflow();
  };

  const zoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.05, 0.1));
    forceReflow();
  };

  const resetZoom = () => {
    setZoomLevel(1);
    forceReflow();
  };

  const forceReflow = () => {
    document.body.style.display = 'none';
    void document.body.offsetHeight;
    document.body.style.display = '';
  };

  return (
    <div className="builder">
      <BuilderHeader 
        isComponentsOpen={isComponentsOpen} 
        setIsComponentsOpen={setIsComponentsOpen} 
      />

      <main className="builder-main">
        <aside className={`builder-components ${isComponentsOpen ? 'open' : 'closed'}`}>
          <h2>Componentes</h2>
          {['Texto', 'Imagen', 'Botón'].map(component => (
            <div draggable="true" onClick={() => setIsPropertiesOpen(true)} key={component}>
              {component}
            </div>
          ))}
        </aside>

        <section className="builder-workspace" ref={workspaceRef}>
          <div className="workspace-content" style={{ transform: `scale(${zoomLevel})` }}>
            {screens.map(screen => (
              <ScreenBuilder 
                key={screen.id}
                onClick={() => setSelectedScreen(screen.id)}
                onPositionChange={newPosition => handleScreenPositionChange(screen.id, newPosition)}
                onAdjustScreen={adjustScreenPosition}
                position={screen.position || { x: 0, y: 0 }}
                zoomLevel={zoomLevel}
                isSelected={selectedScreen === screen.id}
              >
                {screen.content}
              </ScreenBuilder>
            ))}
          </div>
        </section>

        <aside className={`builder-properties ${isPropertiesOpen ? 'open' : ''}`}>
          <div className="builder-properties-header">
            <h2>Propiedades</h2>
            <button onClick={() => setIsPropertiesOpen(false)}>
              <i className="bi bi-x"></i>
            </button>
          </div>
        </aside>

        <div className="zoom-controls">
          <button 
            className="zoom-button" 
            onClick={zoomOut} 
            onMouseDown={handleZoomOutPress}
            onMouseUp={handleZoomButtonRelease}
            onMouseLeave={handleZoomButtonRelease}
          >
            -
          </button>
          <span className="zoom-percentage" onClick={resetZoom}>
            {Math.round(zoomLevel * 100)}%
          </span>
          <button 
            className="zoom-button" 
            onClick={zoomIn} 
            onMouseDown={handleZoomInPress}
            onMouseUp={handleZoomButtonRelease}
            onMouseLeave={handleZoomButtonRelease}
          >
            +
          </button>
        </div>
      </main>
    </div>
  );
}

export default Builder;
