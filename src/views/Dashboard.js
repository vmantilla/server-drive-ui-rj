import React, { useState, useEffect } from 'react';
import '../css/Dashboard.css';
import { getProjectsFromAPI, deleteProjectFromAPI, editProjectNameInAPI, addProjectToAPI } from './api.js';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function Dashboard() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [projects, setProjects] = useState([]);
  const [newProjectImage, setNewProjectImage] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null); // Almacenar el ID del proyecto a eliminar
  const [confirmDeleteName, setConfirmDeleteName] = useState(""); // Nombre que el usuario introduce para confirmar la eliminación
  const [editingProjectId, setEditingProjectId] = useState(null);

  const handleRemoveImage = () => {
    setNewProjectImage('');
  };

  const handleModalShow = (id) => {
    if (id) {
      const projectToEdit = projects.find(p => p.id === id);
      setNewProjectName(projectToEdit.title);
      setNewProjectImage(projectToEdit.image_url);
      setNewProjectDescription(projectToEdit.description);
      setEditingProjectId(id);
    }
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setNewProjectName('');
    setNewProjectImage('');
    setNewProjectDescription('');
    setEditingProjectId(null);
  };

  const handleConfirm = async () => {
    if (editingProjectId) {
      handleEditProjectName(editingProjectId);
    } else {
      handleAddProject();
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setNewProjectImage(reader.result);
    }

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleAddProject = async () => {
    try {
      if (!newProjectName.trim()) {
        setErrorMessage("El nombre del proyecto no puede estar vacío");
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
        return;
      }

      const newProjectData = {
        title: newProjectName,
        image_url: newProjectImage,
        description: newProjectDescription
      };
      await addProjectToAPI(newProjectData);
      setProjects(prev => [...prev, newProjectData]);
      handleModalClose();
      setSuccessMessage("Proyecto agregado exitosamente.");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      setErrorMessage("No se pudo agregar el proyecto");
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
    }
  };

  useEffect(() => {
    async function fetchProjects() {
      try {
        const fetchedProjects = await getProjectsFromAPI();
        setProjects(fetchedProjects);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
        setErrorMessage("No se pudieron cargar los proyectos");
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
      }
    }
    
    fetchProjects();
  }, []);

  const handleDeleteProject = async (id) => {
    try {
      await deleteProjectFromAPI(id);
      setProjects(prev => prev.filter(project => project.id !== id));
      setSuccessMessage("Proyecto eliminado exitosamente.");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Failed to delete project:", error);
      setErrorMessage("No se pudo eliminar el proyecto");
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
    }
  };

  const handleEditProjectName = async (id) => {
    try {
      const updatedProjectData = {
        title: newProjectName,
        image_url: newProjectImage,
        description: newProjectDescription
      };
      await editProjectNameInAPI(id, updatedProjectData);
      setProjects(prev => prev.map(project => 
      project.id === id ? { ...project, ...updatedProjectData } : project
    ));
      handleModalClose();
      setSuccessMessage("Proyecto editado exitosamente.");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      setErrorMessage("No se pudo editar el proyecto");
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
    }
  };

  const handleDeleteModalShow = (projectId) => {
    setProjectToDelete(projectId);
    setShowDeleteModal(true);
  };

  const handleDeleteModalClose = () => {
    setProjectToDelete(null);
    setShowDeleteModal(false);
    setConfirmDeleteName("");
  };

  const confirmDelete = () => {
    if (projectToDelete) {
      const project = projects.find(p => p.id === projectToDelete);
      if (project.title === confirmDeleteName) {
        handleDeleteProject(projectToDelete);
        handleDeleteModalClose();
      } else {
        setErrorMessage("El nombre no coincide. Asegúrate de escribir el nombre del proyecto correctamente para confirmar la eliminación.");
        setTimeout(() => setErrorMessage(null), 5000);
      }
    }
  };


  const handleProjectSelect = (id) => {
    navigate(`/builder/${id}`);
  };

  return (
    <div className="dashboard">
      {errorMessage && <div className="float-message error-message">{errorMessage}</div>}
      {successMessage && <div className="float-message success-message">{successMessage}</div>}

      <h2>Mis Proyectos</h2>

      <div className="projects-grid">
        {projects.map(project => (
          <div key={project.id} className="project-card clickable" style={{ padding: '10px', borderRadius: '5px', margin: '5px' }}>
            {project.image_url ? (
                <img 
                  src={project.image_url} 
                  alt={project.title} 
                  onClick={() => handleProjectSelect(project.id)} 
                  style={{ cursor: 'pointer' }}
                />
            ) : (
                <div className="no-image-placeholder" onClick={() => handleProjectSelect(project.id)}>
                  <i className="bi bi-card-image"></i>
                </div>
            )}
            <div className="project-title-actions d-flex align-items-center justify-content-between">
              <h3 onClick={() => handleProjectSelect(project.id)}>{project.title}</h3>
              <div>
                <i className="bi bi-pencil-square" style={{ fontSize: '1.5rem', marginRight: '10px', color: 'gray'}} onClick={() => handleModalShow(project.id)}></i>
                <i className="bi bi-trash" style={{ fontSize: '1.5rem', color: 'gray'}} onClick={() => handleDeleteModalShow(project.id)}></i>
              </div>
            </div>
          </div>
        ))}
        <div className="project-card add-project-card clickable" onClick={() => handleModalShow()}>
          <i className="bi bi-plus-lg add-project-icon"></i>
          <div className="add-project-title">Agregar Proyecto</div>
        </div>
      </div>
      
      {showModal && (
        <Modal show={showModal} onHide={handleModalClose}>
            <Modal.Header closeButton>
                <Modal.Title>Agregar Proyecto</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <input
                    type="text"
                    value={newProjectName}
                    onChange={e => setNewProjectName(e.target.value)}
                    placeholder="Nombre del nuevo proyecto"
                />
                <br />
                <label>Selecciona una imagen:</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                />
                {newProjectImage && (
                    <div style={{ position: 'relative' }}>
                        <img src={newProjectImage} alt="Vista previa" style={{ width: '60%', marginTop: '10px', display: 'block', marginLeft: 'auto', marginRight: 'auto' }} />
                        <i className="bi bi-trash" style={{ fontSize: '1.5rem',position: 'absolute', top: '-10px', right: '5px', cursor: 'pointer', color: 'gray' }} onClick={handleRemoveImage}></i>
                    </div>
                )}
                <br />
                <textarea
                    value={newProjectDescription}
                    onChange={e => setNewProjectDescription(e.target.value)}
                    placeholder="Descripción del proyecto"
                    rows="4"
                    style={{ width: '100%', marginTop: '10px' }}
                ></textarea>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleModalClose}>
                  Cerrar
                </Button>
                <Button variant="primary" onClick={handleConfirm} disabled={!newProjectName.trim()}>
                  {editingProjectId ? 'Editar' : 'Agregar'}
                </Button>
              </Modal.Footer>

        </Modal>
    )}

    {showDeleteModal && (
      <Modal show={showDeleteModal} onHide={handleDeleteModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Para confirmar la eliminación, escribe el nombre del proyecto que deseas eliminar:
            <strong> "{projects.find(p => p.id === projectToDelete)?.title}"</strong>
          </p>
          <input
            type="text"
            value={confirmDeleteName}
            onChange={e => setConfirmDeleteName(e.target.value)}
            placeholder="Nombre del proyecto"
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
  );
}

export default Dashboard;
