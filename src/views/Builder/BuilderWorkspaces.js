import React, { useState, useEffect } from 'react';
import { getWorkspacesFromAPI, addWorkspaceToAPI, deleteWorkspaceFromAPI, editWorkspaceInAPI } from '../api';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import '../../css/Builder/BuilderWorkspaces.css';

function BuilderWorkspaces({ projectId }) {
  const [workspaces, setWorkspaces] = useState([]);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [editingWorkspaceId, setEditingWorkspaceId] = useState(null);
  const [editingWorkspaceName, setEditingWorkspaceName] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [workspaceToDelete, setWorkspaceToDelete] = useState(null);
  const [confirmDeleteName, setConfirmDeleteName] = useState("");
  const [showAddWorkspace, setShowAddWorkspace] = useState(false);

  useEffect(() => {
      fetchWorkspaces();
  }, []);

  const fetchWorkspaces = async () => {
      const workspacesData = await getWorkspacesFromAPI(projectId);
      console.log(workspacesData);
      setWorkspaces(workspacesData);
  };

  const handleAddWorkspace = async () => {
      if (newWorkspaceName.trim()) {
          await addWorkspaceToAPI(projectId, { title: newWorkspaceName });
          setNewWorkspaceName('');
          fetchWorkspaces();
      }
  };

  const handleSaveEdit = async (workspaceId) => {
      if (editingWorkspaceName.trim()) {
          await editWorkspaceInAPI(projectId, workspaceId, { title: editingWorkspaceName });
          setEditingWorkspaceId(null);
          fetchWorkspaces();
      }
  };

  const handleDeleteModalShow = (workspaceId) => {
    setWorkspaceToDelete(workspaceId);
    setShowDeleteModal(true);
  };

  const handleDeleteModalClose = () => {
    setWorkspaceToDelete(null);
    setShowDeleteModal(false);
    setConfirmDeleteName("");
  };

  const confirmDelete = async () => {
    if (workspaceToDelete) {
      const workspace = workspaces.find(w => w.id === workspaceToDelete);
      if (workspace.title === confirmDeleteName) {
        await deleteWorkspaceFromAPI(projectId, workspaceToDelete);
        fetchWorkspaces();
        handleDeleteModalClose();
      }
    }
  };

  return (
      <div className="builder-workspaces">
          <header className="workspaces-header">
              <span className="workspaces-title">Workspaces</span>
              <button className="add-workspace-button" onClick={() => setShowAddWorkspace(!showAddWorkspace)}>+</button>
          </header>
          {showAddWorkspace && (
            <div className="add-workspace-form">
              <input
                value={newWorkspaceName}
                onChange={(e) => setNewWorkspaceName(e.target.value)}
                placeholder="Nuevo workspace"
              />
              <i className="bi bi-x-lg" onClick={() => setShowAddWorkspace(false)}></i>
              <i className="bi bi-check-lg" onClick={handleAddWorkspace}></i>
            </div>
          )}
          <ul>
              {workspaces.map(workspace => (
                  <li key={workspace.id}>
                      {editingWorkspaceId === workspace.id ? (
                          <input
                              type="text"
                              value={editingWorkspaceName}
                              onChange={(e) => setEditingWorkspaceName(e.target.value)}
                              onBlur={() => handleSaveEdit(workspace.id)}
                          />
                      ) : (
                          <span onClick={() => { 
                              setEditingWorkspaceId(workspace.id);
                              setEditingWorkspaceName(workspace.title);
                          }}>
                              {workspace.title}
                          </span>
                      )}
                      <button onClick={() => handleDeleteModalShow(workspace.id)}>Eliminar</button>
                  </li>
              ))}
          </ul>
          {showDeleteModal && (
            <Modal show={showDeleteModal} onHide={handleDeleteModalClose}>
              <Modal.Header closeButton>
                <Modal.Title>Confirmar Eliminación</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>
                  Para confirmar la eliminación, escribe el nombre del workspace que deseas eliminar:
                  <strong> "{workspaces.find(w => w.id === workspaceToDelete)?.title}"</strong>
                </p>
                <input
                  type="text"
                  value={confirmDeleteName}
                  onChange={e => setConfirmDeleteName(e.target.value)}
                  placeholder="Nombre del workspace"
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

export default BuilderWorkspaces;
