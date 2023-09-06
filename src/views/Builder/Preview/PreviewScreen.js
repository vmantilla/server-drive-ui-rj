import React, { useState, useRef, useEffect } from 'react';
import { RavitBuilder } from 'ravit-builder';
import html2canvas from 'html2canvas';

import '../../../css/Builder/Preview/PreviewScreen.css';
import ComponentManager from '../ComponentManager';

function PreviewScreen({ previewId, selectedScreen, selectedComponent, initialTitle, onTitleChange, isSelected, zoomLevel = 1, onClick, position = { x: 0, y: 0 }, onPositionChange, setUpdateComponentProperties, orderUpdated }) {
  const [screenType, setScreenType] = useState('mobile');
  const [title, setTitle] = useState(initialTitle);
  const [isEditing, setIsEditing] = useState(false);
  const draggingRef = useRef(false);
  const lastEventRef = useRef(null);

  let componentManager = new ComponentManager(previewId);
  
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
      if (element) {
        const scale = 3;
        const canvas = await html2canvas(element, {
          scale: scale,
          backgroundColor: null
        });
        
        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          
          if (avg < 10) { // Si es cercano a negro
            data[i] = 204;     // Establecer a #CCC (gris claro)
            data[i + 1] = 204;
            data[i + 2] = 204;
          } else {
            data[i] = avg;     // De lo contrario, establecer a escala de grises
            data[i + 1] = avg;
            data[i + 2] = avg;
          }
        }

        ctx.putImageData(imageData, 0, 0);

        const imgData = canvas.toDataURL('image/png');
        if(isSelected) {
          localStorage.setItem(`${previewId}-screenshot`, imgData);
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
  let timer;
  if (isSelected) {
    timer = setInterval(() => {
      captureImage();
    }, 5000);
  } else {
    clearInterval(timer);
  }

  return () => {
    clearInterval(timer);
  };
}, [previewId, isSelected]); 


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
      <div key={orderUpdated} className={`screen-content ${screenType} ${isSelected ? 'selected' : ''}`} onClick={onClick}>
        <RavitBuilder layoutJson={componentManager.components} selectedComponent={selectedComponent} />
      </div>
    </div>
  );
}

export default PreviewScreen;
