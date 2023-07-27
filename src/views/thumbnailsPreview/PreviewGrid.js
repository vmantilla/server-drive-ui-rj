import React, { useState, useEffect, useCallback } from 'react';
import PreviewWithScreenshot from './PreviewWithScreenshot';
import axios from 'axios';
import '../../css/thumbnailsViews.css';

// Configura axios para usar "http://localhost:3000" como URL base
axios.defaults.baseURL = "http://localhost:3000";

axios.interceptors.request.use(function (config) {
  const token = localStorage.getItem('token');
  config.headers.Authorization = token ? `Bearer ${token}` : '';
  return config;
});

const addPreviewToAPI = async (previewData) => {
  const response = await axios.post('/previews', previewData);
  return response.data;
};

const deletePreviewFromAPI = async (id) => {
  await axios.delete(`/previews/${id}`);
};

const getAllPreviewsFromAPI = async () => {
  const response = await axios.get('/previews');
  console.log(response.data);
  return response.data;
};

const PreviewGrid = () => {
  const [gridViewsData, setGridViewsData] = useState([]);
  const [selectedPreviewId, setSelectedPreviewId] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);  // Nuevo estado para manejar mensajes de error

  useEffect(() => {
    getAllPreviewsFromAPI()
      .then(allPreviews => {
        setGridViewsData(allPreviews);
        if (allPreviews.length > 0 && selectedPreviewId === null) {
          setSelectedPreviewId(allPreviews[0].id);
        }
      })
      .catch(err => {
      console.error(err);
      setErrorMessage("No se pudieron cargar las vistas previas");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
});
  }, []);

  const handleAddNewPreview = useCallback(() => {
    const newPreview = { title: "Nueva vista", base64_image: "" }; 
    addPreviewToAPI(newPreview)
      .then((createdPreview) => {
        setGridViewsData(prevViewsData => [...prevViewsData, createdPreview]);
        setSelectedPreviewId(createdPreview.id);
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
      deletePreviewFromAPI(id)
        .then(() => {
          setGridViewsData(prevViewsData => prevViewsData.filter(preview => preview.id !== id));
          if (selectedPreviewId === id) setSelectedPreviewId(null);
        })
        .catch(err => {
          console.error(err);
          setErrorMessage("No se pudo eliminar la vista previa");
          setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
        });
    }
  }, [selectedPreviewId]);

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
          onClick={() => setSelectedPreviewId(viewData.id)}
        >
          <span 
            className="thumbnail-title" 
            style={{
              color: 'gray',
              marginBottom: '10px'
            }}
          >
            {viewData.title || "Nueva vista"}
          </span>
          <PreviewWithScreenshot base64Image={viewData.base64_image} />
          {selectedPreviewId === viewData.id && (
            <button 
              style={{
                position: 'absolute',
                top: '0',
                right: '0',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                backgroundColor: 'lightgrey',
                color: 'white',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                margin: '4px',
                fontSize: '14px'
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleDeletePreview(viewData.id);
              }}
            >
              ✖️
            </button>
          )}
        </div>
      ))}
      <div className="add-preview-button" onClick={handleAddNewPreview}>+</div>
    </div>
  );
};

export default PreviewGrid;
