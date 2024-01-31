import React, { useState, useEffect, useRef } from 'react';
import '../../../css/Builder/Preview/PreviewExperience.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { 
  getUseCasesFromAPI, 
  addUseCaseToAPI, 
  editUseCaseInAPI, 
  deleteUseCaseFromAPI 
} from '../../api';

const PreviewExperience = ({ selectedPreview }) => {
  const [useCases, setUseCases] = useState([]);
  const [editingUseCaseId, setEditingUseCaseId] = useState(null);
  const [editingUseCaseDesc, setEditingUseCaseDesc] = useState('');
  const [newUseCaseDesc, setNewUseCaseDesc] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingUseCaseId, setDeletingUseCaseId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const textAreaRef = useRef(null);

  useEffect(() => {
    getUseCasesFromAPI(selectedPreview).then((data) => setUseCases(data));
  }, [selectedPreview]);

  const handleTextAreaChange = (e) => {
    e.target.style.height = 'inherit';
    e.target.style.height = `${e.target.scrollHeight}px`;
    setEditingUseCaseDesc(e.target.value);
  };

  const handleAddUseCase = () => {
    addUseCaseToAPI(selectedPreview, { description: newUseCaseDesc })
      .then((newUseCase) => {
        setUseCases([...useCases, newUseCase]);
        setNewUseCaseDesc('');
        setShowAddModal(false);
      });
  };

  const handleEditUseCase = (useCaseId, useCaseDesc) => {
    setEditingUseCaseId(useCaseId);
    setEditingUseCaseDesc(useCaseDesc);
  };

  const saveEditUseCase = () => {
    editUseCaseInAPI(selectedPreview, editingUseCaseId, { description: editingUseCaseDesc })
      .then((updatedUseCase) => {
        setUseCases(useCases.map(useCase => useCase.id === editingUseCaseId ? updatedUseCase : useCase));
        setEditingUseCaseId(null);
      });
  };

  const handleDeleteUseCase = (useCaseId) => {
    setDeletingUseCaseId(useCaseId);
    setShowDeleteModal(true);
  };

  const confirmDeleteUseCase = () => {
    deleteUseCaseFromAPI(selectedPreview, deletingUseCaseId)
      .then(() => {
        setUseCases(useCases.filter(useCase => useCase.id !== deletingUseCaseId));
        setShowDeleteModal(false);
        setDeletingUseCaseId(null);
      });
  };

  return (
    <div className="preview-experience">
      <h2>Características de la Pantalla</h2>
      <button onClick={() => setShowAddModal(true)}>Agregar Característica</button>
      <ul>
        {useCases.map((useCase, index) => (
          <li key={index}>
            <div className="suggestion-content">
              {editingUseCaseId === useCase.id ? (
                <textarea
                  ref={textAreaRef}
                  value={editingUseCaseDesc}
                  onChange={handleTextAreaChange}
                />
              ) : (
                <p>{useCase.description}</p>
              )}
            </div>
            <div className="workspace-actions">
              {editingUseCaseId === useCase.id ? (
                <>
                  <i className="bi bi-check-lg" onClick={saveEditUseCase}></i>
                  <i className="bi bi-x-lg" onClick={() => setEditingUseCaseId(null)}></i>
                </>
              ) : (
                <>
                  <i className="bi bi-pen" onClick={() => handleEditUseCase(useCase.id, useCase.description)}></i>
                  <i className="bi bi-trash" onClick={() => handleDeleteUseCase(useCase.id)}></i>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>

      {/* Modal para agregar nueva característica */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Característica</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <textarea
            value={newUseCaseDesc}
            onChange={(e) => setNewUseCaseDesc(e.target.value)}
            placeholder="Descripción de la Característica"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleAddUseCase}>
            Agregar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para confirmar eliminación */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas eliminar esta característica?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmDeleteUseCase}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PreviewExperience;
