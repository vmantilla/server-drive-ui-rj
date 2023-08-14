import React, { useState, useRef, useEffect } from 'react';
import '../../css/Builder/ScreenBuilder.css';

function ScreenBuilder({ isSelected, children, zoomLevel = 1, onClick }) {

  const [screenType, setScreenType] = useState('desktop');
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [selected, setSelected] = useState(false);
  const draggingRef = useRef(false);
  const lastEventRef = useRef(null);

  useEffect(() => {
    const globalMouseMove = (e) => {
      if (draggingRef.current) {
        const deltaX = (e.clientX - lastEventRef.current.clientX) / zoomLevel;
        const deltaY = (e.clientY - lastEventRef.current.clientY) / zoomLevel;
        setPosition((prevPosition) => ({
          x: prevPosition.x + deltaX,
          y: prevPosition.y + deltaY
        }));
        lastEventRef.current = e;
      }
    }

    const globalMouseUp = () => {
      draggingRef.current = false;
    }

    document.addEventListener('mousemove', globalMouseMove);
    document.addEventListener('mouseup', globalMouseUp);

    return () => {
      document.removeEventListener('mousemove', globalMouseMove);
      document.removeEventListener('mouseup', globalMouseUp);
    };
  }, [zoomLevel]);

  const handleDragStart = (e) => {
    draggingRef.current = true;
    lastEventRef.current = e;
    // Evita el comportamiento predeterminado del navegador al arrastrar
    e.preventDefault();
  }

  const adjustToScreen = () => {
    // Aquí puedes poner la lógica para ajustar al tamaño de la pantalla
    setSelected(true);
  }

  return (
    <div 
      className={`screen-container` }
      style={{ left: position.x, top: position.y }}
      onClick={onClick} 
    >
      <div className="screen-selector">
          {isSelected && (
              <>
                  <button onClick={() => setScreenType('mobile')}><i className="bi bi-phone"></i></button> 
                  <button onClick={() => setScreenType('tablet')}><i className="bi bi-tablet"></i></button> 
                  <button onClick={() => setScreenType('desktop')}><i className="bi bi-display"></i></button>
                  <button onClick={adjustToScreen}><i className="bi bi-arrows-fullscreen"></i></button>
              </>
          )}
      </div>

      <div className={`screen-content ${screenType} ${isSelected ? 'selected' : ''}`}>
        {children}
      </div>
      <div 
        className="drag-handle"
        onMouseDown={handleDragStart}
      >
        <i className="bi bi-arrows-move"></i>
      </div>
      {isSelected && <button className="delete-button"><i className="bi bi-trash"></i></button>}
    </div>
  );
}

export default ScreenBuilder;
