import React, { useState, useRef, useEffect } from 'react';
import { RavitBuilder } from 'ravit-builder';
import html2canvas from 'html2canvas';

import '../../../css/Builder/Preview/PreviewScreen.css';

function PreviewScreen({ previewScreenId, selectedScreen, initialTitle, onTitleChange, isSelected, zoomLevel = 1, onClick, position = { x: 0, y: 0 }, onPositionChange, selectedComponents }) {
  const [screenType, setScreenType] = useState('mobile');
  const [title, setTitle] = useState(initialTitle);
  const [isEditing, setIsEditing] = useState(false);
  const draggingRef = useRef(false);
  const lastEventRef = useRef(null);
  
  const captureDivRef = useRef(null); 

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

  const captureImage = async () => {
  try {
    const element = document.querySelector('.screen-content > div:first-child'); 
    console.log("Elemento seleccionado:", element);
    
    if (element) {
      const scale = 3; 
      const canvas = await html2canvas(element, {
        scale: scale,
      });
      const imgData = canvas.toDataURL('image/png');
      if(previewScreenId) {
        localStorage.setItem(`${previewScreenId}-screenshot`, imgData);
        console.log("Imagen guardada en localStorage con la clave:", `${previewScreenId}-screenshot`);
      } else {
        console.log("previewScreenId es undefined o null");
      }
    } else {
      console.log("Elemento no encontrado");
    }
  } catch (e) {
    console.error("Error al capturar imagen:", e);
  }
};

useEffect(() => {
    const timer = setTimeout(() => {
      if(isSelected) {
        captureImage();
      }
    }, 500); 
  }, [previewScreenId, selectedComponents]); 


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
        <div kref={captureDivRef}>
        {(selectedScreen == previewScreenId) ? (
        <RavitBuilder layoutJson={selectedComponents} 
        />
      ) : (
       localStorage.getItem(`${previewScreenId}-screenshot`) && <img src={localStorage.getItem(`${previewScreenId}-screenshot`)} alt="Captured content" />
     )}
     </div>
      </div>
    </div>
  );
}

export default PreviewScreen;
