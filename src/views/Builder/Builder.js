import React, { useState, useRef } from 'react';
import BuilderHeader from './BuilderHeader';
import '../../css/Builder/Builder.css';

function Builder() {
  const [isComponentsOpen, setIsComponentsOpen] = useState(true);
  const [isPropertiesOpen, setIsPropertiesOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const zoomIntervalRef = useRef(null);

  function zoomIn() {
    setZoomLevel(prev => Math.min(prev + 0.05, 2));
  }

  function zoomOut() {
    setZoomLevel(prev => Math.max(prev - 0.05, 0.5));
  }

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
  };

  return (
    <div className="builder">
      <BuilderHeader 
        isComponentsOpen={isComponentsOpen} 
        setIsComponentsOpen={setIsComponentsOpen} 
      />
      <main className="builder-main">
        <aside className={`builder-components ${isComponentsOpen ? 'open' : 'closed'}`}>
          <div className="builder-components-content">
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
          </div>
        </aside>

        <section className="builder-workspace">
          <div className="workspace-content" style={{ transform: `scale(${zoomLevel})` }}>
            Hello World !!
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
