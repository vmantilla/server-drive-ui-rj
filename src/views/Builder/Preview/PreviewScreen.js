import React, { useState, useRef, useEffect } from 'react';
import '../../../css/Builder/Preview/PreviewScreen.css';

function PreviewScreen({ initialTitle, onTitleChange, isSelected, children, zoomLevel = 1, onClick, position = { x: 0, y: 0 }, onPositionChange }) {
  const [screenType, setScreenType] = useState('mobile');
  const [title, setTitle] = useState(initialTitle);
  const [isEditing, setIsEditing] = useState(false);
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
    };
    const globalMouseUp = () => {
      draggingRef.current = false;
    };
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
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleTitleBlur = () => {
    setIsEditing(false);
    if (onTitleChange) {
      onTitleChange(title);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleTitleBlur();
    }
  };

  return (
    <div 
      style={{ 
        left: position?.x, 
        top: position?.y, 
        position: 'absolute',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
      onMouseDown={handleDragStart}
    >
      {isEditing ? (
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          onBlur={handleTitleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          style={{ fontSize: 'small', textAlign: 'center' }}
        />
      ) : (
        <h4 onDoubleClick={handleDoubleClick} className="title-text">
          {title}
        </h4>
      )}
      <div className={`screen-content ${screenType} ${isSelected ? 'selected' : ''}`} onClick={onClick}>
        {children}
      </div>
    </div>
  );
}

export default PreviewScreen;
