import React from 'react';
import '../../css/Builder/BuilderHeader.css';


function BuilderHeader({ isComponentsOpen, setIsComponentsOpen, selectedScreen, addNewPreview }) {
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
            <button className="icon-button"><i className="bi bi-columns-gap"></i></button>
            <button className="icon-button"><i className="bi bi-box"></i></button>
            <button className="icon-button"><i className="bi bi-arrows-angle-expand rotate-45 "></i></button>
          </>
        )}
      </div>

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

