import React, { useState, useEffect, useRef } from 'react';
import { getWorkspacesFromAPI, addWorkspaceToAPI, deleteWorkspaceFromAPI, editWorkspaceInAPI } from '../api';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import '../../css/Builder/BuilderWorkspaces.css';

function BuilderWorkspaces({ projectId, selectedWorkspace, setSelectedWorkspace }) {
  const [workspaces, setWorkspaces] = useState([]);
  const [editingWorkspaceId, setEditingWorkspaceId] = useState(null);
  const [editingWorkspaceName, setEditingWorkspaceName] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [workspaceToDelete, setWorkspaceToDelete] = useState(null);
  const [confirmDeleteName, setConfirmDeleteName] = useState("");
  const editInputRef = useRef(null);

  useEffect(() => {
  	fetchWorkspaces();
  }, []);

  useEffect(() => {
  	if (editingWorkspaceId !== null && editInputRef.current) {
  		editInputRef.current.focus();
  	}
  }, [editingWorkspaceId]);


  const fetchWorkspaces = async () => {
  	const workspacesData = await getWorkspacesFromAPI(projectId);
  	setWorkspaces(workspacesData);
  	setSelectedWorkspace(workspacesData[0] || null);
  };

  const handleAddWorkspace = async () => {
  	const newWorkspaceTitle = `Workspace ${workspaces.length + 1}`;
  	const newWorkspace = await addWorkspaceToAPI(projectId, { title: newWorkspaceTitle });
  	setWorkspaces([...workspaces, newWorkspace]);
  	setSelectedWorkspace(newWorkspace);
  };

  const handleSaveEdit = async (workspaceId) => {
  	if (editingWorkspaceName.trim()) {
  		const updatedWorkspace = await editWorkspaceInAPI(workspaceId, { title: editingWorkspaceName });
  		const index = workspaces.findIndex(w => w.id === workspaceId);
  		if (index !== -1) {
  			const updatedWorkspaces = [...workspaces];
  			updatedWorkspaces[index] = updatedWorkspace;
  			setWorkspaces(updatedWorkspaces);
  			setEditingWorkspaceId(null);
  		}
  	}
  };

  const confirmDelete = async () => {
  	if (workspaceToDelete) {
  		const workspace = workspaces.find(w => w.id === workspaceToDelete);
  		if (workspace.title === confirmDeleteName) {
  			await deleteWorkspaceFromAPI(workspaceToDelete);
  			const updatedWorkspaces = workspaces.filter(w => w.id !== workspaceToDelete);
  			setWorkspaces(updatedWorkspaces);
  			setSelectedWorkspace(updatedWorkspaces[0] || null);
  			handleDeleteModalClose();
  		}
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

  return (
    <div className="builder-workspaces">
      <header className="workspaces-header">
        <span className="workspace-title">Workspaces</span>
        <button className="add-workspace-button workspace-title" onClick={handleAddWorkspace}>+</button>
      </header>
      <ul className="workspace-list">
    {workspaces.map(workspace => (
      <li key={workspace.id} className={selectedWorkspace.id === workspace.id ? 'selected' : ''} onClick={() => {setSelectedWorkspace(workspace); if(editingWorkspaceId !== null) setEditingWorkspaceId(null); }}>
        {editingWorkspaceId === workspace.id ? (
          <div className="workspace-form" onClick={(e) => e.stopPropagation()}>
            <input
              ref={editInputRef}
              type="text"
              value={editingWorkspaceName}
              onChange={(e) => setEditingWorkspaceName(e.target.value)}
              onBlur={() => handleSaveEdit(workspace.id)}
            />
            <i className="bi bi-check-lg" onClick={() => handleSaveEdit(workspace.id)}></i>
            <i className="bi bi-x-lg" onClick={() => setEditingWorkspaceId(null)}></i>
          </div>
        ) : (
          <React.Fragment>
            <i className="bi bi-clipboard" style={{ fontSize: '12px', marginRight: '5px' }}></i> {/* Ícono agregado */}
            <span>{workspace.title}</span>
            <div className="workspace-actions">
              <i className="bi bi-pen" onClick={(e) => { 
                e.stopPropagation();
                setEditingWorkspaceId(workspace.id);
                setEditingWorkspaceName(workspace.title);
              }}></i>
              {workspaces.length > 1 && (
                <i className="bi bi-trash" onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteModalShow(workspace.id);
                }}></i>
              )}
            </div>
          </React.Fragment>
        )}
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
