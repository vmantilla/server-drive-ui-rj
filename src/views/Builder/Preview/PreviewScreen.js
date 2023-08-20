// ScreenBuilder.js
import React, { useState, useRef, useEffect } from 'react';
import '../../../css/Builder/Preview/PreviewScreen.css';

function PreviewScreen({ isSelected, children, zoomLevel = 1, onClick, position = { x: 0, y: 0 }, onPositionChange, onDelete }) {
  const [screenType, setScreenType] = useState('mobile');
  const draggingRef = useRef(false);
  const lastEventRef = useRef(null);
  const screenBuilderRef = useRef(null);

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
    if (screenBuilderRef.current) {
      const element = screenBuilderRef.current;
      const rect = element.getBoundingClientRect();
      const offsetX = window.innerWidth / 2 - (rect.left + rect.width / 2);
      const offsetY = window.innerHeight / 2 - (rect.top + rect.height / 2);

      window.scrollBy(offsetX, offsetY);
    }
  }

   const handleDeleteClick = (e) => {
    e.stopPropagation(); // Evitar que el evento se propague al padre
    onDelete();
  };

  return (
    <div
      className={`screen-content ${screenType} ${isSelected ? 'selected' : ''}`}
      style={{ left: position?.x, top: position?.y }}
      onClick={onClick}
      onMouseDown={handleDragStart}
    >
      {children}
      {isSelected && (
        <button
          className="delete-button"
          style={{ position: 'absolute', bottom: '20px', right: '20px' }}
          onClick={handleDeleteClick}
        >
          <i className="bi bi-trash"></i>
        </button>
      )}
      {isSelected && (
        <button
          className="adjust-button"
          style={{ position: 'absolute', top: '20px', right: '20px' }}
          onClick={adjustToScreen}
        >
          <i className="bi bi-arrows-fullscreen"></i>
        </button>
      )}
    </div>
  );
}

export default PreviewScreen;
