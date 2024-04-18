import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import '../../../../css/Builder/Component/Properties/ImageProperties.css';

import { getSignedURLFromAPI } from '../../../../services/api';

const contentModes = ['fill', 'contain', 'cover', 'none', 'scale-down'];

function ImageProperties({ property, handlePropertyChange }) {
  const [selectedContentMode, setSelectedContentMode] = useState(property.data.contentMode || 'fill');
  const [imageUrl, setImageUrl] = useState(property.data.url || '');
  const [uploadedImages, setUploadedImages] = useState([]);
  const [tempSelectedImage, setTempSelectedImage] = useState(null); 
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorAws, setErrorAws] = useState(null);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 

  useEffect(() => {
    handlePropertyChange('contentMode', selectedContentMode);
    setImageUrl(property.data.url);
  }, [selectedContentMode, property.data]);

  const getFileExtension = (mimeType) => {
    switch (mimeType) {
      case 'image/png':
        return '.png';
      case 'image/jpeg':
        return '.jpeg';
      case 'application/pdf':
        return '.pdf';
      case 'image/svg+xml':
        return '.svg';
      default:
        return null;
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      const imgData = reader.result;
      if (!uploadedImages.includes(imgData)) {
        setUploadedImages([...uploadedImages, imgData]);
      }
      setTempSelectedImage(imgData);
    };

    if (file.size > 2 * 1024 * 1024) {
      setError("The selected file exceeds 2MB in size.");
      setSelectedFile(null);
    } else {
      setSelectedFile(file);
      setError(null);
      if (file) {
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSelectImage = async () => {
  
    if (selectedFile) {
        setIsLoading(true);
        setShowModal(false);  // Cerrar el modal cuando comienza la carga
        const fileExtension = getFileExtension(selectedFile.type);
        if (!fileExtension) {
            setErrorAws("Unsupported file type.");
            setIsLoading(false);
            return;
        }

        try {
            const response = await getSignedURLFromAPI(property, selectedFile.type, fileExtension);
            const uploadResponse = await fetch(response.presigned_url, {
                method: 'PUT',
                body: selectedFile,
                headers: {
                    'Content-Type': selectedFile.type
                }
            });
            if (!uploadResponse.ok) {
                throw new Error(`Failed to upload file with status ${uploadResponse.status}: ${await uploadResponse.text()}`);
            }

            setImageUrl(response.public_url); 
            handlePropertyChange('url', response.public_url); 
            handlePropertyChange('content_type', selectedFile.type); 
            setIsLoading(false);
        } catch (error) {
            console.log("Error occurred:", error.message);
            setErrorAws(error.message);
            setIsLoading(false);
        }
    } else {
        console.log("No file selected.");
    }
};


  return (
    <div className="image-properties">
      <div className="image-preview" onClick={() => setShowModal(true)}>
        {isLoading ? (
          <div className="spinner"></div>
        ) : imageUrl ? (
          <img src={imageUrl} alt="Preview" style={{ objectFit: selectedContentMode }} />
        ) : (
          <i className="bi bi-card-image"></i>
        )}
      </div>
      
      <div className="image-select">
        <label>Content Mode:</label>
        <select value={selectedContentMode} onChange={e => setSelectedContentMode(e.target.value)}>
          {contentModes.map((mode, index) => (
            <option key={index} value={mode}>{mode}</option>
          ))}
        </select>
      </div>

      <Modal show={showModal && !isLoading} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Select an Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          <div className="image-grid">
            {uploadedImages.map((img, index) => (
              <img 
                  key={index} 
                  src={img} 
                  alt="" 
                  onClick={() => setTempSelectedImage(img)} 
                  className={img === tempSelectedImage ? 'selected-image' : ''}
              />
            ))}
          </div>
          <div style={{ flexGrow: 1, color: 'orange', textAlign: 'left' }}>
            {error}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant={tempSelectedImage ? "primary" : "secondary"} 
            onClick={handleSelectImage}
            disabled={!tempSelectedImage || error}
          >
            Select
          </Button>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ImageProperties;
