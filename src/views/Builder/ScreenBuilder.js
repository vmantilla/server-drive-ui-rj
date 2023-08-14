import React, { useState, useRef, useEffect } from 'react';
import '../../css/Builder/ScreenBuilder.css';

function ScreenBuilder({ isSelected, children, zoomLevel = 1, onClick, position = { x: 0, y: 0 }, onPositionChange, onAdjustScreen }) {

  const [screenType, setScreenType] = useState('desktop');
  const draggingRef = useRef(false);
  const lastEventRef = useRef(null);

  useEffect(() => {
    const globalMouseMove = (e) => {
      if (draggingRef.current && lastEventRef.current) {
        const deltaX = (e.clientX - lastEventRef.current.clientX) / zoomLevel;
        const deltaY = (e.clientY - lastEventRef.current.clientY) / zoomLevel;
        const newPosition = {
          x: position?.x + deltaX,
          y: position?.y + deltaY
        };
        if (onPositionChange) {
          onPositionChange(newPosition);
        }
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
  }, [zoomLevel, position, onPositionChange]);

  const handleDragStart = (e) => {
    draggingRef.current = true;
    lastEventRef.current = e;
    e.preventDefault();
  }

  const adjustToScreen = () => {
    if (onAdjustScreen) {
      onAdjustScreen();
    }
  }

  return (
    <div 
      className="screen-container"
      style={{ left: position?.x, top: position?.y }}
      onClick={onClick} 
    >
      <div className="screen-selector">
          <button 
              style={{ visibility: isSelected ? 'visible' : 'hidden' }} 
              onClick={() => setScreenType('mobile')}
          >
              <i className="bi bi-phone"></i>
          </button>
          <button 
              style={{ visibility: isSelected ? 'visible' : 'hidden' }} 
              onClick={() => setScreenType('tablet')}
          >
              <i className="bi bi-tablet"></i>
          </button>
          <button 
              style={{ visibility: isSelected ? 'visible' : 'hidden' }} 
              onClick={() => setScreenType('desktop')}
          >
              <i className="bi bi-display"></i>
          </button>
          <button 
              style={{ visibility: isSelected ? 'visible' : 'hidden' }} 
              onClick={adjustToScreen}
          >
              <i className="bi bi-arrows-fullscreen"></i>
          </button>
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
