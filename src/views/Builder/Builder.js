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

  // Estado para gestionar múltiples ScreenBuilders
  const [screens, setScreens] = useState([
    { id: 1, content: "Hello World 1!" },
    { id: 2, content: "Hello World 2!" },
    { id: 3, content: "Hello World 2!" },
    { id: 4, content: "Hello World 2!" }
    // ... puedes agregar más screens si es necesario ...
  ]);

  // Función para actualizar la posición de los ScreenBuilders
  const handleScreenPositionChange = (id, newPosition) => {
    setScreens(prevScreens => prevScreens.map(screen => 
      screen.id === id ? { ...screen, position: newPosition } : screen
    ));
  };

  const handleScreenSelect = (id) => {
    setSelectedScreen(id);
  };

  const handleZoomInPress = () => {
    zoomIn();
    zoomIntervalRef.current = setInterval(zoomIn, 100);
  };

  const handleZoomOutPress = () => {
    zoomOut();
    zoomIntervalRef.current = setInterval(zoomOut, 100);
  };

  const handleZoomButtonRelease = () => {
    clearInterval(zoomIntervalRef.current);
  };

  const resetZoom = () => {
    setZoomLevel(1);
    forceReflow()
  };

  function zoomIn() {
    setZoomLevel(prev => Math.min(prev + 0.05, 2));
    forceReflow();
  }

  function zoomOut() {
    setZoomLevel(prev => Math.max(prev - 0.05, 0.1));
    forceReflow();
  }

  function forceReflow() {
    document.body.style.display = 'none';
    void document.body.offsetHeight; // No es realmente necesario, pero puede ayudar en algunos navegadores
    document.body.style.display = '';
  }

   return (
    <div className="builder">
      <BuilderHeader 
        isComponentsOpen={isComponentsOpen} 
        setIsComponentsOpen={setIsComponentsOpen} 
      />
      <main className="builder-main">
        <aside className={`builder-components ${isComponentsOpen ? 'open' : 'closed'}`}>
          <h2>Componentes</h2>
            <div 
              draggable="true" 
              onClick={() => setIsPropertiesOpen(true)}
            >
              Texto
            </div>
            <div 
              draggable="true" 
              onClick={() => setIsPropertiesOpen(true)}
            >
              Imagen
            </div>
            <div 
              draggable="true" 
              onClick={() => setIsPropertiesOpen(true)}
            >
              Botón
            </div>
        </aside>

        <section className="builder-workspace">
          <div className="workspace-content" style={{ transform: `scale(${zoomLevel})` }}>
            {screens.map(screen => (
              <ScreenBuilder 
                  key={screen.id}
                  onClick={() => handleScreenSelect(screen.id)}
                  onPositionChange={newPosition => handleScreenPositionChange(screen.id, newPosition)}
                  initialPosition={screen.position}
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
          {/*... contenido de properties ...*/}
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
          <span 
            className="zoom-percentage" 
            onClick={resetZoom}
          >{Math.round(zoomLevel * 100)}%</span>
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
