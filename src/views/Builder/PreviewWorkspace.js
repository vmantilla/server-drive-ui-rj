// PreviewWorkspace.js
import React, { useState, useEffect, useRef } from 'react';
import ScreenBuilder from './ScreenBuilder';
import '../../css/Builder/PreviewWorkspace.css';
import { showWorkspaceFromAPI, createPreviewInWorkspaceAPI } from '../api';

function PreviewWorkspace({ projectId, workspaceId, setSelectedScreen, selectedScreen }) {
  const [previews, setPreviews] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showDropdown, setShowDropdown] = useState(false);

  const zoomIntervalRef = useRef(null);
  const workspaceSize = Math.max(zoomLevel * 1000, window.innerWidth, window.innerHeight);

  useEffect(() => {
    if (workspaceId) {
      showWorkspaceFromAPI(projectId, workspaceId)
        .then((workspace) => {
          setPreviews(workspace.previews);
        })
        .catch((error) => {
          console.error('Error al mostrar el espacio de trabajo:', error);
        });
    }
  }, [workspaceId]);

  const zoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.05, 2));
  };

  const zoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.05, 0.1));
  };

  const setZoom = (percentage) => {
    setZoomLevel(percentage / 100);
    setShowDropdown(false);
  };

  const handleZoomInPress = () => {
    zoomIn();
    zoomIntervalRef.current = setInterval(zoomIn, 100);
  };

  const handleZoomOutPress = () => {
    zoomOut();
    zoomIntervalRef.current = setInterval(zoomOut, 100);
  };

  const handleZoomButtonRelease = () => clearInterval(zoomIntervalRef.current);

  const handleWorkspaceClick = (e) => {
    if (e.target === e.currentTarget) {
      setSelectedScreen(null);
    }
  };

  return (
    <>
      <div className="workspace-content" style={{ transform: `scale(${zoomLevel})`, width: `${workspaceSize}px`, height: `${workspaceSize}px` }} onClick={handleWorkspaceClick}>
        {previews.map((preview) => (
          <ScreenBuilder
            key={preview.id}
            onClick={() => setSelectedScreen(preview.id)}
            onPositionChange={(newPosition) => {
              const updatedPreviews = previews.map((p) => (p.id === preview.id ? { ...p, position: newPosition } : p));
              setPreviews(updatedPreviews);
            }}
            position={preview.position || { x: 0, y: 0 }}
            zoomLevel={zoomLevel}
            isSelected={selectedScreen === preview.id}
          >
            {preview.content}
          </ScreenBuilder>
        ))}
      </div>
      <div className="zoom-controls">
        <button className="zoom-button" onClick={zoomOut} onMouseDown={handleZoomOutPress} onMouseUp={handleZoomButtonRelease} onMouseLeave={handleZoomButtonRelease}>
          -
        </button>
        <div className="zoom-dropdown">
          <span className="zoom-percentage" onClick={() => setShowDropdown(!showDropdown)}>
            {Math.round(zoomLevel * 100)}%
          </span>
          {showDropdown && (
            <ul className="zoom-options">
              {['200%', '100%', '80%', '50%', '30%', '10%'].map((percentage) => (
                <li key={percentage} onClick={() => setZoom(parseInt(percentage, 10))}>
                  {percentage}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button className="zoom-button" onClick={zoomIn} onMouseDown={handleZoomInPress} onMouseUp={handleZoomButtonRelease} onMouseLeave={handleZoomButtonRelease}>
          +
        </button>
      </div>
    </>
  );
}

export default PreviewWorkspace;
