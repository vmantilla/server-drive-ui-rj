// PreviewWorkspace.js
import React, { useState, useEffect, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import PreviewScreen from './PreviewScreen';
import PreviewThumbnail from './PreviewThumbnail';
import '../../../css/Builder/Preview/PreviewWorkspace.css';

import { getAllPreviewsFromAPI, addPreviewToAPI, deletePreviewFromAPI } from '../../api';
import { useBuilder } from '../BuilderContext';

function PreviewWorkspace({ workspaceId, propertyWasUpdated, setAddNewPreview, setOnDelete, forceReflow, showNotification, setUpdateComponentProperties, setShouldUpdate, orderUpdated }) {

  const { 
    uiScreens, setUiScreens,
    uiComponents, setUiComponents,
    uiComponentsProperties, setUiComponentsProperties,
    selectedScreen, setSelectedScreen,
    selectedComponent, setSelectedComponent,
    resetBuilder,
    verifyDataConsistency,
    handleObjectChange,

  } = useBuilder();

  const [zoomLevel, setZoomLevel] = useState(1);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [previewToDelete, setPreviewToDelete] = useState(null);
  const [confirmDeleteName, setConfirmDeleteName] = useState('');

  const zoomIntervalRef = useRef(null);
  const workspaceSize = Math.max(zoomLevel * 1000, window.innerWidth, window.innerHeight);

  useEffect(() => {
    if (workspaceId) {
      resetBuilder();
      getAllPreviewsFromAPI(workspaceId)
      .then((response) => {
        console.log("getAllPreviewsFromAPI", response)

        if (response.screens && response.components && response.props) {
          setUiScreens(response.screens);
          setUiComponents(response.components); 
          setUiComponentsProperties(response.props);
          setSelectedScreen(null);
          setSelectedComponent(null);
          forceReflow();
        } else {
          showNotification('error', 'Faltan datos en la respuesta.');
          resetBuilder()
        }
        
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
        const response =  await addPreviewToAPI(workspaceId, previewData);

        if (response.screens && response.components && response.props) {
          setUiScreens((prev) => ({ ...prev, ...response.screens }));
          setUiComponents((prev) => ({ ...prev, ...response.components }));
          setUiComponentsProperties((prev) => ({ ...prev, ...response.props }));
          setSelectedScreen(null);
          setSelectedComponent(null);
          forceReflow();
        } else {
          showNotification('error', 'Faltan datos en la respuesta.');
          resetBuilder()
        }

      } catch (error) {
        showNotification('error', 'Error al agregar nueva vista previa.');
        console.error('Error al agregar nueva vista previa:', error);
      }
    };

    setAddNewPreview(() => addNewPreview);
    setOnDelete(() => handleDelete);
  }, [workspaceId, setAddNewPreview]);

  const handlePositionChange = (newPosition, previewId) => {
    setUiScreens((prevUiScreens) => {
      const updatedUiScreens = { ...prevUiScreens };

      if (updatedUiScreens[previewId]) {
        updatedUiScreens[previewId].x = newPosition.x;
        updatedUiScreens[previewId].y = newPosition.y;
      }

      return updatedUiScreens;
    });
  };

  const deletecomponentsAndProperties = (screenId, uiComponents, uiComponentsProperties) => {
    let updatedcomponents = { ...uiComponents };
    let updatedProperties = { ...uiComponentsProperties };

    (uiScreens[screenId]?.components || []).forEach(componentId => {
      delete updatedcomponents[componentId];
      (uiComponents[componentId]?.props || []).forEach(propertyId => {
        delete updatedProperties[propertyId];
      });
    });

    return [updatedcomponents, updatedProperties];
  };

  const confirmDelete = async () => {
    if (previewToDelete && confirmDeleteName === uiScreens[previewToDelete]?.title) {
      try {
        const response = await deletePreviewFromAPI(previewToDelete);
        console.log(response)
        const [updatedcomponents, updatedProperties] = deletecomponentsAndProperties(previewToDelete, uiComponents, uiComponentsProperties);

        setUiComponents(updatedcomponents);
        setUiComponentsProperties(updatedProperties);
        setUiScreens(prev => {
          const updated = { ...prev };
          delete updated[previewToDelete];
          return updated;
        });
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
      setSelectedComponent(null);
    }
  };

  const updateUiScreens = (previewId, newScreen) => {
    const selectedScreen = uiScreens[previewId];
    if (!selectedScreen) {
      console.error("No screen with the given ID found");
      return;
    }

    setUiScreens((prev) => ({
      ...prev,
      [previewId]: newScreen
    }));
    handleObjectChange("screens", previewId);
  }

  const handleTitleChange = (newTitle, previewId) => {
    const selectedScreen = uiScreens[previewId];
    if (!selectedScreen) return;

    const updatedScreen = {
      ...selectedScreen,
      title: newTitle,
    };
    console.log("handleTitleChange", updatedScreen)
    updateUiScreens(previewId, updatedScreen);
  };

  const handlePositionSave = (newPosition, previewId) => {
    const selectedScreen = uiScreens[previewId];
    if (!selectedScreen) return;

    const updatedScreen = {
      ...selectedScreen,
      x: newPosition.x,
      y: newPosition.y,
    };

    updateUiScreens(previewId, updatedScreen);
  };

  const handleClick = (preview) => {
    setSelectedComponent(null);
    setSelectedScreen(preview.id);
  };


  return (
  <>
    <div className="workspace-content" style={{ transform: `scale(${zoomLevel})`, width: `${workspaceSize}px`, height: `${workspaceSize}px` }}  onClick={handleWorkspaceClick}>
    {Object.entries(uiScreens).map(([previewId, previewData]) => {
      const { title, components, x: position_x, y: position_y } = previewData;
      if (true) {
        return (
          <PreviewScreen
            key={previewId}
            previewId={previewId}
            selectedScreen={selectedScreen}
            initialTitle={title}
            onClick={() => handleClick({ id: previewId, title, position_x, position_y })}
            onPositionChange={(newPosition) => handlePositionChange(newPosition, previewId)}
            handlePositionSave={(newPosition) => handlePositionSave(newPosition, previewId)}
            position={{ x: position_x || 0, y: position_y || 0 }}
            zoomLevel={zoomLevel}
            isSelected={selectedScreen === previewId}
            onTitleChange={(newTitle) => handleTitleChange(newTitle, previewId)}
            selectedComponent={selectedComponent}
            propertyWasUpdated={propertyWasUpdated}
            orderUpdated={orderUpdated}
          />
          );
        } else {
          return (
          <PreviewThumbnail
            key={previewId}
            previewId={previewId}
            selectedScreen={selectedScreen}
            initialTitle={title}
            onClick={() => handleClick({ id: previewId, title, position_x, position_y })}
            onPositionChange={(newPosition) => handlePositionChange(newPosition, previewId)}
            position={{ x: position_x || 0, y: position_y || 0 }}
            zoomLevel={zoomLevel}
            isSelected={selectedScreen === previewId}
            onTitleChange={(newTitle) => handleTitleChange(newTitle, previewId)}
            propertyWasUpdated={propertyWasUpdated}
          />
          );
        }
      })}

    {showDeleteModal && (
    <Modal show={showDeleteModal} onHide={handleDeleteModalClose}>
      <Modal.Header closeButton>
        <Modal.Title>Confirmar Eliminación</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Para confirmar la eliminación, escribe el nombre de la vista previa que deseas eliminar:
          <strong> "{uiScreens[previewToDelete]?.title}"</strong>
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
