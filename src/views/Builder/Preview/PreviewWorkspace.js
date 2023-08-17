// PreviewWorkspace.js
import React, { useState, useEffect, useRef } from 'react';
import PreviewScreen from './PreviewScreen';
import '../../../css/Builder/Preview/PreviewWorkspace.css';
import { showWorkspaceFromAPI, createPreviewInWorkspaceAPI, deletePreviewFromAPI } from '../../api';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';


function PreviewWorkspace({ projectId, workspaceId, setSelectedScreen, selectedScreen, setAddNewPreview, forceReflow, showNotification }) {
  const [previews, setPreviews] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showDropdown, setShowDropdown] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [previewToDelete, setPreviewToDelete] = useState(null);
  const [confirmDeleteName, setConfirmDeleteName] = useState('');

  const zoomIntervalRef = useRef(null);
  const workspaceSize = Math.max(zoomLevel * 1000, window.innerWidth, window.innerHeight);
  
  useEffect(() => {
    if (workspaceId) {
      showWorkspaceFromAPI(projectId, workspaceId)
        .then((workspace) => {
          setPreviews(workspace.previews);
          setSelectedScreen(null);
          forceReflow();
        })
        .catch((error) => {
          showNotification('error', 'Error al mostrar el espacio de trabajo.');
          console.error('Error al mostrar el espacio de trabajo:', error);
        });
    }
  }, [workspaceId]);

  useEffect(() => {
    const addNewPreview = async () => {
      const previewData = {
        title: "New Preview",
      };

      try {
        const newPreview = await createPreviewInWorkspaceAPI(projectId, workspaceId, previewData);
        setPreviews(prev => [...prev, newPreview]);
      } catch (error) {
        showNotification('error', 'Error al agregar nueva vista previa.');
        console.error('Error al agregar nueva vista previa:', error);
      }
    };

    // Configura la función para agregar una nueva vista previa
    setAddNewPreview(() => addNewPreview);
  }, [projectId, workspaceId, setAddNewPreview]);

  const confirmDelete = async () => {
    if (previewToDelete && confirmDeleteName === previews.find(p => p.id === previewToDelete)?.title) {
      try {
        await deletePreviewFromAPI(projectId, previewToDelete);
        setPreviews(prev => prev.filter(p => p.id !== previewToDelete));
        setSelectedScreen(null);
      } catch (error) {
        showNotification('error', 'Error al eliminar vista previa.');
        console.error('Error al eliminar vista previa:', error);
      } finally {
        handleDeleteModalClose();
      }
    } else {
      showNotification('error', 'El nombre del preview no concuerda, asegurate de escribir mayusculas y minusculas correctamente.');
    }
  };

  const handleDeleteModalClose = () => {
    setShowDeleteModal(false);
    setPreviewToDelete(null);
  };

  const handleDelete = (previewId) => {
    setPreviewToDelete(previewId);
    setShowDeleteModal(true);
  };

  const zoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.05, 2));
    forceReflow();
  };

  const zoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.05, 0.1));
    forceReflow();
  };

  const setZoom = (percentage) => {
    forceReflow();
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
    <div className="workspace-content" style={{ transform: `scale(${zoomLevel})`, width: `${workspaceSize}px`, height: `${workspaceSize}px` }}  onClick={handleWorkspaceClick}>
      {previews.map((preview) => (
        <PreviewScreen
          key={preview.id}
          onClick={() => setSelectedScreen(preview.id)}
          onPositionChange={(newPosition) => {
            const updatedPreviews = previews.map((p) => (p.id === preview.id ? { ...p, position: newPosition } : p));
            setPreviews(updatedPreviews);
          }}
          position={preview.position || { x: 0, y: 0 }}
          zoomLevel={zoomLevel}
          isSelected={selectedScreen === preview.id}
          onDelete={() => handleDelete(preview.id)}
        >
          {preview.content}
        </ PreviewScreen>
      ))}
    {showDeleteModal && (
    <Modal show={showDeleteModal} onHide={handleDeleteModalClose}>
      <Modal.Header closeButton>
        <Modal.Title>Confirmar Eliminación</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Para confirmar la eliminación, escribe el nombre de la vista previa que deseas eliminar:
          <strong> "{previews.find(p => p.id === previewToDelete)?.title}"</strong>
        </p>
        <input
          type="text"
          value={confirmDeleteName}
          onChange={e => setConfirmDeleteName(e.target.value)}
          placeholder="Nombre de la vista previa"
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleDeleteModalClose}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={confirmDelete}>
          Confirmar Eliminación
        </Button>
      </Modal.Footer>
    </Modal>
  )}
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
