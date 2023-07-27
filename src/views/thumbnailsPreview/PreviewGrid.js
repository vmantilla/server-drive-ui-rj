// Archivo: PreviewGrid.js
import React, { useState, useCallback } from 'react';
import { openDB, deleteDB } from 'idb';
import PreviewWithScreenshot from './PreviewWithScreenshot';
import '../../css/thumbnailsViews.css';

const addPreviewToDB = async (previewData) => {
  const db = await openDB('builderDBPreview', 1, {
    upgrade(db) {
      db.createObjectStore('previews', { keyPath: 'id', autoIncrement: true });
    },
  });

  const tx = db.transaction('previews', 'readwrite');
  const previewsStore = tx.objectStore('previews');
  await previewsStore.add(previewData);

  await tx.done;
  await db.close();
};

const deletePreviewFromDB = async (id) => {
  const db = await openDB('builderDBPreview', 1);
  const tx = db.transaction('previews', 'readwrite');
  const previewsStore = tx.objectStore('previews');
  await previewsStore.delete(id);

  await tx.done;
  await db.close();
};

const PreviewGrid = () => {
  const [gridViewsData, setGridViewsData] = useState([]);
  const [selectedPreviewId, setSelectedPreviewId] = useState(null);

  const handleAddNewPreview = useCallback(() => {
    const newPreview = { id: Date.now() };  // Aquí generamos un nuevo id único para cada preview
    addPreviewToDB(newPreview)
      .then(() => setGridViewsData(prevViewsData => [...prevViewsData, newPreview]))
      .catch(err => console.error(err));
  }, []);

  const handleDeletePreview = useCallback((id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta vista previa?")) {
      deletePreviewFromDB(id)
        .then(() => {
          setGridViewsData(prevViewsData => prevViewsData.filter(preview => preview.id !== id));
          if (selectedPreviewId === id) setSelectedPreviewId(null);
        })
        .catch(err => console.error(err));
    }
  }, [selectedPreviewId]);

  return (
    <div className="thumbnails-grid">
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
          <PreviewWithScreenshot base64Image={viewData.base64Image} />
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
                fontSize: '14px'  // Este es el tamaño del ícono de la basura, ajusta según sea necesario
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
