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

  const handleModalClose = () => setShowModal(false);
  const handleModalShow = () => setShowModal(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const fetchedProjects = await getProjectsFromAPI();
        setProjects(fetchedProjects);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      }
    }
    
    fetchProjects();
  }, []);

  const handleDeleteProject = async (id) => {
    try {
      await deleteProjectFromAPI(id);
      setProjects(prev => prev.filter(project => project.id !== id));
    } catch (error) {
      console.error("Failed to delete project:", error);
    }
  };

  const handleEditProjectName = async (id, newName) => {
    try {
      await editProjectNameInAPI(id, newName);
      setProjects(prev => prev.map(project => project.id === id ? { ...project, name: newName } : project));
    } catch (error) {
      console.error("Failed to edit project:", error);
    }
  };

  const handleAddProject = async () => {
    try {
      const newProjectData = await addProjectToAPI(newProjectName);
      setProjects(prev => [...prev, newProjectData]);
      handleModalClose();
    } catch (error) {
      console.error("Failed to add project:", error);
    }
  };

  const handleProjectSelect = (id) => {
    navigate(`/builder/${id}`);
  };

  return (
    <div className="dashboard">
      <h2>Mis Proyectos</h2>
      <div className="projects-grid">
        {projects.map(project => (
          <div key={project.id} className="project-card clickable" onClick={() => handleProjectSelect(project.id)}>
            <img src={project.image_url} alt={project.title} />
            <h3>{project.title}</h3>
          </div>
        ))}
        <button onClick={handleModalShow}>
          Agregar Proyecto
        </button>
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
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleModalClose}>
              Cerrar
            </Button>
            <Button variant="primary" onClick={handleAddProject}>
              Agregar
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}

export default Dashboard;
