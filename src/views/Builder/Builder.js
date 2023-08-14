import React, { useState, useEffect } from 'react'; 
import BuilderHeader from './BuilderHeader';
import '../../css/Builder/Builder.css';

function Builder() {
  const [isComponentsOpen, setIsComponentsOpen] = useState(true); 
  const [isPropertiesOpen, setIsPropertiesOpen] = useState(false);
  const [isHeaderExpanded, setIsHeaderExpanded] = useState(false);
  const [headerTimeout, setHeaderTimeout] = useState(null);

  useEffect(() => {
  return () => clearTimeout(headerTimeout);
}, [headerTimeout]);


  return (
    <div className="builder">
      <BuilderHeader 
  isHeaderExpanded={isHeaderExpanded}
  onMouseEnter={() => {
    clearTimeout(headerTimeout);
    setIsHeaderExpanded(true);
  }}
  onMouseLeave={() => {
    const timeout = setTimeout(() => {
      setIsHeaderExpanded(false);
    }, 30000);  // 30 segundos
    setHeaderTimeout(timeout);
  }}
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
          {/*...*/}
        </section>

        <aside className={`builder-properties ${isPropertiesOpen ? 'open' : ''}`}>
          <div className="builder-properties-header">
            <h2>Propiedades</h2>
            <button onClick={() => setIsPropertiesOpen(false)}>
              <i className="bi bi-x"></i>
            </button>
          </div>
          {/*...*/}
        </aside>
      </main>
    </div>
  );
}

export default Builder;
