import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import '../../../css/Builder/Component/ComponentPropertiesTab.css';

import ComponentProperties from './ComponentProperties';

function ComponentPropertiesTab() {
    const [tabs, setTabs] = useState([{ id: 'default', label: 'Default' }]);
    const [activeTab, setActiveTab] = useState('default');
    const [editingTab, setEditingTab] = useState(null);
    const [tabLabel, setTabLabel] = useState('');

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [tabToDelete, setTabToDelete] = useState(null);

    const handleDeleteModalShow = (tabId) => {
        setTabToDelete(tabId);
        setShowDeleteModal(true);
    };

    const handleDeleteModalClose = () => {
        setTabToDelete(null);
        setShowDeleteModal(false);
    };

    const confirmDelete = () => {
        handleRemoveTab(tabToDelete);
        handleDeleteModalClose();
    };

    const handleAddTab = () => {
        const id = new Date().getTime().toString();
        setTabs([...tabs, { id, label: `State ${tabs.length + 1}` }]);
        setActiveTab(id);
    };

    const handleRemoveTab = (id) => {
        setTabs(tabs.filter(tab => tab.id !== id));
        if (activeTab === id) setActiveTab('default');
    };

    const handleDoubleClick = (id, label) => {
        if(id !== 'default') {
            setEditingTab(id);
            setTabLabel(label);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            updateTabLabel();
        } else if (e.key === 'Escape') {
            cancelEditing();
        }
    };

    const updateTabLabel = () => {
        const updatedTabs = tabs.map(tab =>
            tab.id === editingTab ? { ...tab, label: tabLabel } : tab
        );
        setTabs(updatedTabs);
        cancelEditing();
    };

    const cancelEditing = () => {
        setEditingTab(null);
        setTabLabel('');
    };

    return (
        <div>
            <div className="tabs">
                {tabs.map(tab => (
                    <div
                        key={tab.id}
                        className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {editingTab === tab.id ? (
                            <input
                                value={tabLabel}
                                onChange={(e) => setTabLabel(e.target.value)}
                                onBlur={updateTabLabel}
                                onKeyDown={handleKeyDown}
                                autoFocus
                            />
                        ) : (
                            <>
                                <span onDoubleClick={() => handleDoubleClick(tab.id, tab.label)}>{tab.label}</span>
                                {tab.id !== 'default' && <button onClick={() => handleDeleteModalShow(tab.id)}><i className="bi bi-x"></i></button>}
                            </>
                        )}
                    </div>
                ))}
                <button className="addTabButton" onClick={handleAddTab}>
				    + Add State
				</button>
            </div>

            <div className="tab-content">
                <ComponentProperties/>
            </div>

            {showDeleteModal && (
                <Modal show={showDeleteModal} onHide={handleDeleteModalClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm Delete</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Are you sure you want to delete this state?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleDeleteModalClose}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={confirmDelete}>
                            Confirm Delete
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    );
}

export default ComponentPropertiesTab;