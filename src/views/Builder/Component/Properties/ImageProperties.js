import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import '../../../../css/Builder/Component/Properties/ImageProperties.css';

const contentModes = ['fill', 'contain', 'cover', 'none', 'scale-down'];

function ImageProperties({ property, handlePropertyChange }) {
  const [selectedContentMode, setSelectedContentMode] = useState(property.contentMode || 'fill');
  const [imageUrl, setImageUrl] = useState(property.url || '');
  const [uploadedImages, setUploadedImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    handlePropertyChange('contentMode', selectedContentMode);
    handlePropertyChange('url', imageUrl);
  }, [selectedContentMode, imageUrl]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setUploadedImages([...uploadedImages, reader.result]);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSelectImage = () => {
    setImageUrl(selectedImage);
    setShowModal(false);
  };

  return (
    <div className="image-properties">
      <div className="image-preview" onClick={() => setShowModal(true)}>
        {imageUrl ? (
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

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Select an Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tabs defaultActiveKey="uploaded">
            <Tab eventKey="uploaded" title="Uploaded Images">
              <input type="file" accept="image/*" onChange={handleFileChange} />
              <div className="image-grid">
                {uploadedImages.map((img, index) => (
                  <img key={index} src={img} alt="" onClick={() => setSelectedImage(img)} />
                ))}
              </div>
            </Tab>
            <Tab eventKey="system" title="System Symbols">
              <div>System Symbols here</div>
            </Tab>
          </Tabs>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleSelectImage}>
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
