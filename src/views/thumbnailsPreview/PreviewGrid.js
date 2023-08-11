import React, { useState, useEffect, useCallback } from 'react';
import PreviewWithScreenshot from './PreviewWithScreenshot';
import '../../css/thumbnailsViews.css';
import { addPreviewToAPI, deletePreviewFromAPI, getAllPreviewsFromAPI } from '../api.js'; // Importa las funciones desde api.js


const PreviewGrid = ({ onPreviewSelect, projectId }) => {
  const [gridViewsData, setGridViewsData] = useState([]);
  const [selectedPreviewId, setSelectedPreviewId] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);



  const handlePreviewClick = (id) => {
    setSelectedPreviewId(id);
    const selectedPreview = gridViewsData.find(viewData => viewData.id === id);
    if (selectedPreview) {
      if (typeof onPreviewSelect === 'function') {
        onPreviewSelect(selectedPreview);
      }
    } else {
      if (typeof onPreviewSelect === 'function') {
        onPreviewSelect(null);
      }
    }
  };

  useEffect(() => {
    getAllPreviewsFromAPI(projectId)
      .then(allPreviews => {
        setGridViewsData(allPreviews);
        if (allPreviews.length > 0 && selectedPreviewId === null) {
          setTimeout(() => {
            setSelectedPreviewId(allPreviews[0].id);
            if (typeof onPreviewSelect === 'function') {
              onPreviewSelect(allPreviews[0]);
            }
          }, 100);
        }
      })
      .catch(err => {
        console.error(err);
        setErrorMessage("No se pudieron cargar las vistas previas");
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
      });
  }, [projectId]);

  const handleAddNewPreview = useCallback(() => {
    const newPreview = { title: "Nueva vista", base64_image: "" }; 
    addPreviewToAPI(projectId, newPreview)
      .then((createdPreview) => {
        setGridViewsData(prevViewsData => [...prevViewsData, createdPreview]);
        setSelectedPreviewId(createdPreview.id);
        if (typeof onPreviewSelect === 'function') {
          onPreviewSelect(createdPreview);
        }
      })
      .catch(err => {
        console.error(err);
        setErrorMessage("No se pudo agregar la nueva vista previa"); 
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
      });
  }, []);

  const handleDeletePreview = useCallback((id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta vista previa?")) {
      deletePreviewFromAPI(projectId, id)
        .then(() => {
          const newGridViewsData = gridViewsData.filter(preview => preview.id !== id);
          setGridViewsData(newGridViewsData);
          
          if (selectedPreviewId === id) {
            const newSelectedPreviewId = newGridViewsData.length > 0 ? newGridViewsData[0].id : null;
            setSelectedPreviewId(newSelectedPreviewId);
            
            const newSelectedPreview = newGridViewsData.find(viewData => viewData.id === newSelectedPreviewId);
            if (typeof onPreviewSelect === 'function') {
              onPreviewSelect(newSelectedPreview || null);
            }
          }
        })
        .catch(err => {
          console.error(err);
          setErrorMessage("No se pudo eliminar la vista previa");
          setTimeout(() => {
            setErrorMessage(null);
          }, 5000);
        });
    }
  }, [selectedPreviewId, gridViewsData, onPreviewSelect]);

  return (
    <div className="thumbnails-grid">
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {gridViewsData.map((viewData, index) => (
        <div 
          key={index} 
          className="thumbnail" 
          style={{ 
            position: 'relative', 
            border: selectedPreviewId === viewData.id ? '2px solid blue' : 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '250px'  // Establece la altura a lo que necesites
          }}
          onClick={() => handlePreviewClick(viewData.id)}
        >
          {/* Resto del contenido... */}
        </div>
      ))}
      <div className="add-preview-button" onClick={handleAddNewPreview}>+</div>
    </div>
  );
};

export default PreviewGrid;
