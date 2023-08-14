import React from 'react';
import '../../css/Builder/BuilderHeader.css';



function BuilderHeader({ isComponentsOpen, setIsComponentsOpen, isHeaderExpanded, onMouseEnter, onMouseLeave }) {
  return (
    <header className={`builder-header ${isHeaderExpanded ? 'expanded' : 'collapsed'}`}>
      <div className="row-wrapper">

        <button 
          className={`menu-toggle ${isComponentsOpen ? 'pressed' : ''}`} 
          onClick={() => setIsComponentsOpen(!isComponentsOpen)}
        >
          <i className="bi bi-list"></i>
        </button>

        <div className="separator-line"></div>
        
        <h1>Builder</h1>

        <div className="icons-container">
          <button className="icon-button"><i className="bi bi-list"></i></button>
          <button className="icon-button"><i className="bi bi-list"></i></button>
          <button className="icon-button"><i className="bi bi-list"></i></button>
        </div>

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

