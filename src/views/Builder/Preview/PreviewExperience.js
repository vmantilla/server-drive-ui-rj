import React, { useState, useEffect, useRef } from 'react';
import '../../../css/Builder/Preview/PreviewExperience.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const PreviewExperience = ({ selectedPreview }) => {
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [editingSuggestionId, setEditingSuggestionId] = useState(null);
  const [editingSuggestionDesc, setEditingSuggestionDesc] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingSuggestionId, setDeletingSuggestionId] = useState(null);
  const textAreaRef = useRef(null);

  useEffect(() => {
    const fetchAiSuggestions = async () => {
      const suggestions = await getAiSuggestions(selectedPreview);
      setAiSuggestions(suggestions);
    };

    if (selectedPreview) {
      fetchAiSuggestions();
    }
  }, [selectedPreview]);

  useEffect(() => {
    if (editingSuggestionId && textAreaRef.current) {
      textAreaRef.current.style.height = 'auto';
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  }, [editingSuggestionId]);

  const handleTextAreaChange = (e) => {
    e.target.style.height = 'inherit';
    e.target.style.height = `${e.target.scrollHeight}px`;
    setEditingSuggestionDesc(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      saveEditSuggestion();
    }
  };

  const handleEditSuggestion = (suggestionId, suggestionDesc) => {
    setEditingSuggestionId(suggestionId);
    setEditingSuggestionDesc(suggestionDesc);
  };

  const saveEditSuggestion = () => {
    const updatedSuggestions = aiSuggestions.map(suggestion => 
      suggestion.id === editingSuggestionId 
        ? { ...suggestion, description: editingSuggestionDesc }
        : suggestion
    );
    setAiSuggestions(updatedSuggestions);
    setEditingSuggestionId(null);
  };

  const confirmDeleteSuggestion = () => {
    const updatedSuggestions = aiSuggestions.filter(suggestion => suggestion.id !== deletingSuggestionId);
    setAiSuggestions(updatedSuggestions);
    setShowDeleteModal(false);
    setDeletingSuggestionId(null);
  };

  const openDeleteModal = (suggestionId) => {
    setShowDeleteModal(true);
    setDeletingSuggestionId(suggestionId);
  };

  return (
    <div className="preview-experience">
      <h2>Sugerencias de Diseño de IA</h2>
      <ul>
        {aiSuggestions.map((suggestion, index) => (
          <li key={index}>
            <div className="suggestion-content">
              {editingSuggestionId === suggestion.id ? (
                <textarea
                  ref={textAreaRef}
                  value={editingSuggestionDesc}
                  onChange={handleTextAreaChange}
                  onKeyPress={handleKeyPress}
                />
              ) : (
                <p>{suggestion.description}</p>
              )}
            </div>
            <div className="workspace-actions">
              {editingSuggestionId === suggestion.id ? (
                <>
                  <i className="bi bi-check-lg" onClick={saveEditSuggestion}></i>
                  <i className="bi bi-x-lg" onClick={() => setEditingSuggestionId(null)}></i>
                </>
              ) : (
                <>
                  <i className="bi bi-pen" onClick={() => handleEditSuggestion(suggestion.id, suggestion.description)}></i>
                  <i className="bi bi-trash" onClick={() => openDeleteModal(suggestion.id)}></i>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas eliminar esta sugerencia?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmDeleteSuggestion}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PreviewExperience;

const getAiSuggestions = async (selectedPreview) => {
  // Supón aquí tu lógica para obtener las sugerencias
  return [
    { id: 1, description: 'Sugerencia 1', details: {} },
    { id: 2, description: 'Sugerencia 2', details: {} },
    // ...
  ];
};
