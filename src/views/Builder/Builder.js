import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import BuilderHeader from './BuilderHeader';
import ScreenBuilder from './ScreenBuilder';
import BuilderComponents from './BuilderComponents';
import BuilderWorkspaces from './BuilderWorkspaces';
import '../../css/Builder/Builder.css';
import { showWorkspaceFromAPI, createPreviewInWorkspaceAPI } from '../api';

function Builder() {
  const { projectId } = useParams();
  const [isComponentsOpen, setIsComponentsOpen] = useState(true);
  const [isPropertiesOpen, setIsPropertiesOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedScreen, setSelectedScreen] = useState(null);
  const [previews, setPreviews] = useState([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);

  const zoomIntervalRef = useRef(null);
  const workspaceRef = useRef(null);

  const workspaceClickHandler = (e) => {
    const isInsideScreenBuilder = e.target.closest('.screen-builder-class'); // Asegúrate de usar la clase correcta
    if (!isInsideScreenBuilder) {
      setSelectedScreen(null);
    }
  };

  useEffect(() => {
    const workspace = workspaceRef.current;
    workspace.addEventListener('click', workspaceClickHandler);

    return () => {
      workspace.removeEventListener('click', workspaceClickHandler);
    };
  }, []);

  useEffect(() => {
    if (selectedWorkspace) {
      showWorkspaceFromAPI(projectId, selectedWorkspace.id)
        .then((workspace) => {
          setPreviews(workspace.previews);
        })
        .catch((error) => {
          console.error('Error al mostrar el espacio de trabajo:', error);
        });
    }
  }, [selectedWorkspace]);

  const addNewPreview = async () => {
    const previewData = {
      title: 'New preview'
    };

    try {
      const newPreview = await createPreviewInWorkspaceAPI(projectId, selectedWorkspace.id, previewData);
      setPreviews(prevPreviews => [...prevPreviews, newPreview]);
      console.log('Nuevo preview creado:', newPreview);
    } catch (error) {
      console.error('Error al agregar nuevo preview:', error);
    }
  };

  const handlePreviewPositionChange = (id, newPosition) => {
    const updatedPreviews = previews.map(preview =>
      preview.id === id ? { ...preview, position: newPosition } : preview
    );
    setPreviews(updatedPreviews);
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

  const adjustPreviewPosition = () => {
    resetZoom();

    if (workspaceRef.current) {
      const selectedPreviewObject = previews.find(preview => preview.id === selectedScreen);
      if (selectedPreviewObject && selectedPreviewObject.position) {
          workspaceRef.current.scrollTop = selectedPreviewObject.position.y * zoomLevel;
      }
    }
  };

  const zoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.05, 2));
    forceReflow();
  };

  const zoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.05, 0.1));
    forceReflow();
  };

  const resetZoom = () => {
    setZoomLevel(1);
    forceReflow();
  };

  const forceReflow = () => {
    document.body.style.display = 'none';
    void document.body.offsetHeight;
    document.body.style.display = '';
  };

  return (
    <div className="builder">
      <BuilderHeader
        isComponentsOpen={isComponentsOpen}
        setIsComponentsOpen={setIsComponentsOpen}
        selectedScreen={selectedScreen}
        addNewPreview={addNewPreview}
      />
      <main className="builder-main">
        <aside className={`builder-components ${isComponentsOpen ? 'open' : 'closed'}`}>
          <BuilderWorkspaces projectId={projectId} selectedWorkspace= {selectedWorkspace} setSelectedWorkspace={setSelectedWorkspace} />
          <BuilderComponents setIsPropertiesOpen={setIsPropertiesOpen} />
        </aside>
        <section className="builder-workspace" ref={workspaceRef}>
          <div className="workspace-content" style={{ transform: `scale(${zoomLevel})` }}>
            {previews.map((preview) => (
              <ScreenBuilder
                key={preview.id}
                onClick={() => setSelectedScreen(preview.id)}
                onPositionChange={newPosition => handlePreviewPositionChange(preview.id, newPosition)}
                onAdjustScreen={adjustPreviewPosition}
                position={preview.position || { x: 0, y: 0 }}
                zoomLevel={zoomLevel}
                isSelected={selectedScreen === preview.id}
              >
                {preview.content}
              </ScreenBuilder>
            ))}
          </div>
        </section>
        <aside className={`builder-properties ${isPropertiesOpen ? 'open' : ''}`}>
          <div className="builder-properties-header">
            <h2>Propiedades</h2>
            <button onClick={() => setIsPropertiesOpen(false)}>
              <i className="bi bi-x"></i>
            </button>
          </div>
        </aside>
        <div className="zoom-controls">
          <button
            className="zoom-button"
            onClick={zoomOut}
            onMouseDown={handleZoomOutPress}
            onMouseUp={handleZoomButtonRelease}
            onMouseLeave={handleZoomButtonRelease}
          >
            -
          </button>
          <span className="zoom-percentage" onClick={resetZoom}>
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            className="zoom-button"
            onClick={zoomIn}
            onMouseDown={handleZoomInPress}
            onMouseUp={handleZoomButtonRelease}
            onMouseLeave={handleZoomButtonRelease}
          >
            +
          </button>
        </div>
      </main>
    </div>
  );
}

export default Builder;