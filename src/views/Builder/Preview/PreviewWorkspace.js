// PreviewWorkspace.js
import React, { useState, useEffect, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import PreviewScreen from './PreviewScreen';
import PreviewThumbnail from './PreviewThumbnail';
import '../../../css/Builder/Preview/PreviewWorkspace.css';

import { getAllPreviewsFromAPI, addPreviewToAPI, deletePreviewFromAPI, editPreviewInAPI, batchUpdatePreviewsToAPI } from '../../api';
import { useBuilder } from '../BuilderContext';

function PreviewWorkspace({ workspaceId, propertyWasUpdated, setAddNewPreview, setUpdatePreview, setOnDelete, forceReflow, showNotification, setUpdateComponentProperties, setShouldUpdate, orderUpdated }) {

  const { 
    uiScreens, setUiScreens,
    uiWidgets, setUiWidgets,
    uiWidgetsProperties, setUiWidgetsProperties,
    selectedScreen, setSelectedScreen,
    selectedComponent, setSelectedComponent,
    resetBuilder,
    verifyDataConsistency
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

        if (verifyDataConsistency(response.uiScreens, response.uiWidgets, response.uiWidgets_properties)) {
          setUiScreens(response.uiScreens);
          setUiWidgets(response.uiWidgets); 
          setUiWidgetsProperties(response.uiWidgets_properties);
        } else {
          resetBuilder()
        }
        
        setSelectedScreen(null);
        setSelectedComponent(null);
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
        const response = await addPreviewToAPI(workspaceId, previewData);

        setUiScreens((prev) => ({ ...prev, ...response.uiScreens }));
        setUiWidgets((prev) => ({ ...prev, ...response.uiWidgets }));
        setUiWidgetsProperties((prev) => ({ ...prev, ...response.uiWidgets_properties }));

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
        updatedUiScreens[previewId][2] = newPosition.x; // Asumiendo que la posición x está en el índice 2
        updatedUiScreens[previewId][3] = newPosition.y; // Asumiendo que la posición y está en el índice 3
      }

      return updatedUiScreens;
    });
  };

  const handlePositionSave = (newPosition, previewId) => {
    const selectedScreen = uiScreens[previewId];
    if (!selectedScreen) {
      console.error("No screen with the given ID found");
      return;
    }
    const updatedData = {
      position_x: newPosition.x,
      position_y: newPosition.y,
    };
    updatePreview(previewId, updatedData);
  };

  const deleteWidgetsAndProperties = (screenId, uiWidgets, uiWidgetsProperties) => {
    let updatedWidgets = { ...uiWidgets };
    let updatedProperties = { ...uiWidgetsProperties };

    (uiScreens[screenId]?.[1] || []).forEach(widgetId => {
      delete updatedWidgets[widgetId];
      (uiWidgets[widgetId]?.[1] || []).forEach(propertyId => {
        delete updatedProperties[propertyId];
      });
    });

    return [updatedWidgets, updatedProperties];
  };

  const updateWidgetsAndProperties = (response, selectedScreenId, uiWidgets, uiWidgetsProperties) => {
    const [updatedWidgets, updatedProperties] = deleteWidgetsAndProperties(selectedScreenId, uiWidgets, uiWidgetsProperties);

    Object.keys(response.uiWidgets).forEach(widgetId => {
      updatedWidgets[widgetId] = response.uiWidgets[widgetId];
    });

    Object.keys(response.uiWidgets_properties).forEach(propertyId => {
      updatedProperties[propertyId] = response.uiWidgets_properties[propertyId];
    });

    return [updatedWidgets, updatedProperties];
  };

  const updatePreview = async (previewId, updatedData) => {
    try {
      const response = await editPreviewInAPI(previewId, updatedData);
      const [updatedWidgets, updatedProperties] = updateWidgetsAndProperties(response, previewId, uiWidgets, uiWidgetsProperties);

      setUiWidgets(updatedWidgets);
      setUiWidgetsProperties(updatedProperties);
      setUiScreens(prev => ({
        ...prev,
        [previewId]: [response.uiScreens[previewId][0], response.uiScreens[previewId][1], updatedData.position_x, updatedData.position_y]
      }));
      showNotification('success', 'Preview updated successfully.');
    } catch (error) {
      showNotification('error', 'Error updating preview.');
      console.error('Error updating preview:', error);
    }
  };

  const confirmDelete = async () => {
    if (previewToDelete && confirmDeleteName === uiScreens[previewToDelete]?.[0]) {
      try {
        await deletePreviewFromAPI(previewToDelete);
        const [updatedWidgets, updatedProperties] = deleteWidgetsAndProperties(previewToDelete, uiWidgets, uiWidgetsProperties);

        setUiWidgets(updatedWidgets);
        setUiWidgetsProperties(updatedProperties);
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

  const handleTitleChange = (newTitle, previewId) => {
    const selectedScreen = uiScreens[previewId];
    if (!selectedScreen) {
      console.error("No screen with the given ID found");
      return;
    }
    const updatedData = {
      title: newTitle,
      position_x: selectedScreen[2],
      position_y: selectedScreen[3],
    };
    setUiScreens((prev) => ({
      ...prev,
      [previewId]: [newTitle, ...prev[previewId].slice(1)],
    }));
    updatePreview(previewId, updatedData);
  };

  const handleClick = (preview) => {
    setSelectedComponent(null);
    console.log("setSelectedScreen", preview.id)
    setSelectedScreen(preview.id);
  };


  return (
  <>
    <div className="workspace-content" style={{ transform: `scale(${zoomLevel})`, width: `${workspaceSize}px`, height: `${workspaceSize}px` }}  onClick={handleWorkspaceClick}>
    {Object.entries(uiScreens).map(([previewId, previewData]) => {
      const [title, , position_x, position_y] = previewData;
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
          <strong> "{uiScreens[previewToDelete]?.[0]}"</strong>
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
