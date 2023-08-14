import React, { useState, useEffect } from 'react'; 
import BuilderHeader from './BuilderHeader';
import '../../css/Builder/Builder.css';

function Builder() {
  const [isComponentsOpen, setIsComponentsOpen] = useState(true); 
  const [isPropertiesOpen, setIsPropertiesOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  function handleWheel(e) {
  e.stopPropagation(); // Agrega esta línea para detener la propagación del evento

  console.log('Wheel event triggered');
  if (e.deltaY < 0) {
    setZoomLevel(prev => Math.min(prev + 0.1, 2));
  } else {
    setZoomLevel(prev => Math.max(prev - 0.1, 0.5));
  }
}



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

        <section className="builder-workspace" onWheel={handleWheel}>
          <div className="workspace-content" style={{ transform: `scale(${zoomLevel})` }}>
            {/* Aquí iría el contenido real del área de trabajo */}
          </div>
          <div className="zoom-controls">
            <button className="zoom-button" onClick={() => setZoomLevel(prev => Math.min(prev + 0.1, 2))}>
              +
            </button>
            <button className="zoom-button" onClick={() => setZoomLevel(prev => Math.max(prev - 0.1, 0.5))}>
              -
            </button>
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
      </main>
    </div>
  );
}

export default Builder;
