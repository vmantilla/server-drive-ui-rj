import React, { useState, useEffect } from 'react';
import '../../../css/Builder/Preview/PreviewExperience.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { 
  getUseCasesFromAPI, 
  addUseCaseToAPI, 
  editUseCaseInAPI, 
  deleteUseCaseFromAPI 
} from '../../../services/api';

const PreviewExperience = ({ selectedPreview }) => {
  const [groupedUseCases, setGroupedUseCases] = useState({});
  const [modalContent, setModalContent] = useState({ description: '', actor: '', editing: false, id: null });
  const [showModal, setShowModal] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [useCaseToDelete, setUseCaseToDelete] = useState(null);

  const actorsList = ['design', 'user', 'system'];

  useEffect(() => {
    getUseCasesFromAPI(selectedPreview).then((data) => {
      const grouped = data.reduce((acc, curr) => {
        (acc[curr.actor] = acc[curr.actor] || []).push(curr);
        return acc;
      }, {});
      setGroupedUseCases(grouped);
    });
  }, [selectedPreview]);

  const handleModalShow = (actor, useCase = null) => {
    if (useCase) {
      setModalContent({ ...useCase, actor, editing: true });
    } else {
      setModalContent({ description: '', actor, editing: false, id: null });
    }
    setShowModal(true);
  };

  const handleModalChange = (e) => {
    setModalContent({ ...modalContent, description: e.target.value });
  };

  const handleModalSave = () => {
    const { editing, id, actor, description } = modalContent;
    if (editing) {
      editUseCaseInAPI(selectedPreview, id, { description })
        .then(() => {
          const updatedGroupedUseCases = { ...groupedUseCases };
          updatedGroupedUseCases[actor] = updatedGroupedUseCases[actor].map(useCase =>
            useCase.id === id ? { ...useCase, description } : useCase
          );
          setGroupedUseCases(updatedGroupedUseCases);
        });
    } else {
      addUseCaseToAPI(selectedPreview, { description, actor })
        .then((addedUseCase) => {
          const updatedGroupedUseCases = { ...groupedUseCases };
          const actorUseCases = updatedGroupedUseCases[actor] || [];
          updatedGroupedUseCases[actor] = [...actorUseCases, addedUseCase];
          setGroupedUseCases(updatedGroupedUseCases);
        });
    }
    setShowModal(false);
  };

  const handleDeleteConfirmation = (actor, useCaseId) => {
    setUseCaseToDelete({ actor, useCaseId });
    setShowConfirmDelete(true);
  };

  const confirmDeleteUseCase = () => {
    if (useCaseToDelete) {
      deleteUseCaseFromAPI(selectedPreview, useCaseToDelete.useCaseId)
        .then(() => {
          const updatedGroupedUseCases = { ...groupedUseCases };
          updatedGroupedUseCases[useCaseToDelete.actor] = updatedGroupedUseCases[useCaseToDelete.actor].filter(useCase => useCase.id !== useCaseToDelete.useCaseId);
          setGroupedUseCases(updatedGroupedUseCases);
          setShowConfirmDelete(false);
        });
    }
  };

  return (
     <div className="preview-experience-container">
      <h2 className="preview-experience-container-title">Características de la Pantalla</h2>
      <div className="preview-experience">
      {actorsList.map(actor => (
          <div key={actor}>
            <header className="preview-experience-header">
              <span className="preview-experience-title">{actor.charAt(0).toUpperCase() + actor.slice(1)} Actions</span>
              <button className="add-use-case-button" onClick={() => handleModalShow(actor)}>+</button>
            </header>
            <ul>
              {groupedUseCases[actor]?.map(useCase => (
                <li key={useCase.id} className="use-case-item">
                <div onClick={() => handleModalShow(actor, useCase)}>
                  {useCase.description}
                </div>
                <button className="delete-use-case-button" onClick={() => handleDeleteConfirmation(actor, useCase.id)}>
                  <i className="bi bi-x"></i>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
      {showModal && (
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{modalContent.editing ? 'Editar' : 'Agregar'} Característica</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <textarea
              value={modalContent.description}
              onChange={handleModalChange}
              placeholder="Descripción de la característica"
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button variant="primary" onClick={handleModalSave}>{modalContent.editing ? 'Guardar Cambios' : 'Agregar'}</Button>
          </Modal.Footer>
        </Modal>
      )}
      {showConfirmDelete && (
        <Modal show={showConfirmDelete} onHide={() => setShowConfirmDelete(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirmar Eliminación</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            ¿Estás seguro de que deseas eliminar esta característica?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowConfirmDelete(false)}>Cancelar</Button>
            <Button variant="danger" onClick={confirmDeleteUseCase}>Eliminar</Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
    </div>
  );
};

export default PreviewExperience;
