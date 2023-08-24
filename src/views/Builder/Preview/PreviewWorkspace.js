// PreviewWorkspace.js
import React, { useState, useEffect, useRef } from 'react';
import PreviewScreen from './PreviewScreen';
import '../../../css/Builder/Preview/PreviewWorkspace.css';
import { showWorkspaceFromAPI, createPreviewInWorkspaceAPI, deletePreviewFromAPI, updatePreviewInWorkspaceAPI, batchUpdatePreviewsInWorkspaceAPI } from '../../api';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';


function PreviewWorkspace({ projectId, workspaceId, setSelectedScreen, selectedScreen, setAddNewPreview, setUpdatePreview, setOnDelete, forceReflow, showNotification }) {
  const [previews, setPreviews] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showDropdown, setShowDropdown] = useState(false);
  const [changedPreviews, setChangedPreviews] = useState(new Set());
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

    setAddNewPreview(() => addNewPreview);
    setOnDelete(() => handleDelete);
  }, [projectId, workspaceId, setAddNewPreview]);


  const handlePositionChange = (newPosition, previewId) => {
    const updatedPreviews = previews.map((p) => {
      if (p.id === previewId) {
        return { ...p, position_x: newPosition.x, position_y: newPosition.y };
      }
      return p;
    });
    setPreviews(updatedPreviews);
    setChangedPreviews(prev => new Set([...prev, previewId]));
  };

  useEffect(() => {
    const updatePreview = async (previewId) => {

      const selectedPreview = previews.find(preview => preview.id === previewId);
      
      if (!selectedPreview) {
        console.error("No preview with the given ID found");
        return;
      }

      const updatedData = {
        title: selectedPreview.title,
        position_x: selectedPreview.position_x,
        position_y: selectedPreview.position_y,
      };

      try {
        const updatedPreview = await updatePreviewInWorkspaceAPI(projectId, previewId, updatedData);
        
        setPreviews(prevPreviews => {
          return prevPreviews.map(preview => {
            if (preview.id === previewId) {
              return updatedPreview;
            }
            return preview;
          });
        });
        if (changedPreviews.size > 0) {
          setTimeout(() => {
            batchUpdatePreviews();
        }, 2000);
        }
        showNotification('success', 'Preview updated successfully.');
      } catch (error) {
        showNotification('error', 'Error updating preview.');
        console.error('Error updating preview:', error);
      }
    };

    setUpdatePreview(() => updatePreview);
  }, [projectId, workspaceId, setUpdatePreview, previews]);

  const batchUpdatePreviews = async () => {
        const updates = Array.from(changedPreviews).map(previewId => {
          const preview = previews.find(p => p.id === previewId);
          if (!preview) {
            console.error(`No se pudo encontrar el preview con id: ${previewId}`);
        return null;
      }
      return { id: previewId, position_x: preview.position_x, position_y: preview.position_y, title: preview.title };
    }).filter(Boolean);

    try {
      await batchUpdatePreviewsInWorkspaceAPI(projectId, workspaceId, updates);
      setChangedPreviews(new Set());
    } catch (error) {
      // Manejar el error
    }
  };


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

  const handleTitleChange = (newTitle, previewId) => {
  const updatedPreviews = previews.map((p) => {
    if (p.id === previewId) {
      return { ...p, title: newTitle };
    }
    return p;
  });
  setPreviews(updatedPreviews);
  setChangedPreviews(prev => new Set([...prev, previewId]));
};

  return (
  <>
    <div className="workspace-content" style={{ transform: `scale(${zoomLevel})`, width: `${workspaceSize}px`, height: `${workspaceSize}px` }}  onClick={handleWorkspaceClick}>
      {previews.map((preview) => (
        <PreviewScreen
          key={preview.id}
          initialTitle={preview.title}
          onClick={() => setSelectedScreen(preview.id)}
          onPositionChange={(newPosition) => handlePositionChange(newPosition, preview.id)}
          position={{ x: preview.position_x || 0, y: preview.position_y || 0 }}
          zoomLevel={zoomLevel}
          isSelected={selectedScreen === preview.id}
          onTitleChange={(newTitle) => handleTitleChange(newTitle, preview.id)}
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
