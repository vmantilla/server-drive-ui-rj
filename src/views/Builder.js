import React, { useState } from 'react';
import '../css/Builder.css';

function Builder() {
  const [isComponentsOpen, setIsComponentsOpen] = useState(true); 
  const [isPropertiesOpen, setIsPropertiesOpen] = useState(false);

  return (
    <div className="builder">
      <header className="builder-header">
        <div className="builder-menu">
          <button 
            className="menu-toggle" 
            onClick={() => setIsComponentsOpen(!isComponentsOpen)}
          >
            <i className="bi bi-list"></i>
            Menu
          </button>
          <h1>Builder</h1>
        </div>
        <div>
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
      </header>

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
          <button 
            className="menu-toggle" 
            style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)' }}
            onClick={() => setIsComponentsOpen(!isComponentsOpen)}
          >
            <i className="bi bi-list"></i>
          </button>
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
