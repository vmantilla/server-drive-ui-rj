import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { RavitBuilder } from 'ravit-builder-library';

import '../../../css/Builder/Preview/PreviewScreen.css';

import { useBuilder } from '../BuilderContext';

function PreviewScreen({ previewId, propertyWasUpdated, initialTitle, onTitleChange, isSelected, zoomLevel = 1, onClick, position = { x: 0, y: 0 }, onPositionChange, handlePositionSave, setUpdateComponentProperties, orderUpdated }) {
  
  const { 
    uiScreens, setUiScreens,
    uiComponents, setUiComponents,
    uiComponentsProperties, setUiComponentsProperties,
    selectedScreen, setSelectedScreen,
    selectedComponent, setSelectedComponent, 
    uiStates,
    selectedState
  } = useBuilder();

  const [screenType, setScreenType] = useState('mobile');
  const [title, setTitle] = useState(initialTitle);
  const [isEditing, setIsEditing] = useState(false);
  const [orientation, setOrientation] = useState('portrait');
  const movedRef = useRef(false);
  const draggingRef = useRef(false);
  const lastEventRef = useRef(null);
  
  useEffect(() => {
    
    const globalMouseMove = (e) => {
      if (draggingRef.current && lastEventRef.current) {
        const deltaX = (e.clientX - lastEventRef.current.clientX) / zoomLevel;
        const deltaY = (e.clientY - lastEventRef.current.clientY) / zoomLevel;
        if (deltaX || deltaY) movedRef.current = true; 
        
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
      if(draggingRef.current){
        draggingRef.current = false;
        if (movedRef.current && handlePositionSave && position) {
          handlePositionSave(position);
        }
        movedRef.current = false; 
      }
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
    setSelectedScreen(previewId)
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
    if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  const toggleOrientation = () => {
    setOrientation(prevOrientation => prevOrientation === 'portrait' ? 'landscape' : 'portrait');
  };

  const toggleScreenType = () => {
    setScreenType(prevScreenType => prevScreenType === 'mobile' ? 'desktop' : 'mobile');
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
    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      {/*
        <button onClick={toggleOrientation}>
          {orientation === 'portrait' ? <i className="bi bi-phone-landscape"></i> : <i className="bi bi-phone"></i>}
        </button>
      */}
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
      {/*
      <button onClick={toggleScreenType}>
        {screenType === 'mobile' ? <i className="bi bi-arrows-fullscreen"></i> : <i className="bi bi-arrows-angle-contract"></i>}
      </button>
      */}
      </div>
      
      <div key={orderUpdated} className={`screen-content ${screenType}-${orientation} ${isSelected ? 'selected' : ''}`} onClick={onClick}>
        <RavitBuilder 
          previewId = {previewId}
          uiScreens={uiScreens} 
          setUiScreens={setUiScreens}
          uiStates={uiStates}
          uiComponents={uiComponents}
          setUiComponents={setUiComponents}
          uiComponentsProperties={uiComponentsProperties} 
          setUiComponentsProperties={setUiComponentsProperties}
          selectedScreen={selectedScreen} 
          setSelectedScreen={setSelectedScreen}
          selectedComponent={selectedComponent} 
          selectedState={selectedState}
          setSelectedComponent={setSelectedComponent} />
      </div>
    </div>
  );
}

export default PreviewScreen;
