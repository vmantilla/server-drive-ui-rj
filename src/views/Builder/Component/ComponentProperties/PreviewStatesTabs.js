import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import '../../../../css/Builder/Component/PreviewStatesTabs.css';

import ComponentProperties from './ComponentProperties';
import { useBuilder } from '../../BuilderContext';
import {
  getPreviewStatesFromAPI,
  addPreviewStateToAPI,
  editPreviewStateInAPI,
  deletePreviewStateFromAPI,
} from '../../../api';

function PreviewStatesTabs() {

    const { 
        selectedScreen,
        selectedState, setSelectedState,
        uiScreens, setUiScreens,
        uiComponentsProperties, setUiComponentsProperties,
        uiStates, setUiStates,
    } = useBuilder();

    const [tabs, setTabs] = useState([]);
    const [editingTab, setEditingTab] = useState(null);
    const [tabLabel, setTabLabel] = useState('');

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [tabToDelete, setTabToDelete] = useState(null);

    useEffect(() => {
        if(selectedScreen && uiScreens[selectedScreen]) {
          const stateIds = uiScreens[selectedScreen].states;
          const screenStates = stateIds
            .map(id => {
                const state = uiStates[id];
                return state ? { id: id, name: state.name } : null;
            })
            .filter(Boolean);
          setTabs(screenStates);
          const normalTab = screenStates.find(tab => tab.name === "Normal");
          setSelectedState(normalTab ? normalTab.id : null);
      } else {
          setTabs([]);
      }
      
  }, [selectedScreen, uiScreens, uiStates]);

    const handleAddTab = async () => {
        const newStateTitle = `State ${tabs.length + 1}`;
        const newState = await addPreviewStateToAPI(selectedScreen, { name: newStateTitle });

        setUiStates(prevStates => ({ ...prevStates, [newState.id]: { name: newState.name } }));
        setUiScreens(prevScreens => ({
            ...prevScreens,
            [selectedScreen]: {
                ...prevScreens[selectedScreen],
                states: [...prevScreens[selectedScreen].states, newState.id]
            }
        }));
        setSelectedState(newState.id)
    };

    const updateTabLabel = async () => {
    if (editingTab.trim()) {
        try {
            const updatedState = await editPreviewStateInAPI(editingTab, { name: tabLabel });
            
            const index = tabs.findIndex(tab => tab.id === editingTab);
            
            if (index !== -1) {
                const updatedTabs = [...tabs];
                updatedTabs[index] = updatedState;

                setTabs(updatedTabs);

                setUiStates(prevUiStates => {
                  return { ...prevUiStates, [editingTab]: updatedState };
                });
            }
            
            cancelEditing();
        } catch (error) {
            console.error("Error updating the state label:", error);
        }
    }
};


    const confirmDelete = async () => {
    if (tabToDelete) {
        try {
            await deletePreviewStateFromAPI(tabToDelete);

            setUiStates(prevStates => {
                const newStates = { ...prevStates };
                delete newStates[tabToDelete];
                return newStates;
            });

            setUiScreens(prevScreens => {
                const newScreens = { ...prevScreens };
                newScreens[selectedScreen].states = newScreens[selectedScreen].states.filter(id => id !== tabToDelete);
                return newScreens;
            });

            setUiComponentsProperties(prevProps => {
                const newProps = { ...prevProps };
                Object.keys(newProps).forEach(componentId => {
                    if (newProps[componentId].state === tabToDelete) {
                        delete newProps[componentId];
                    }
                });
                return newProps;
            });
            const normalTab = tabs.find(tab => tab.name === "Normal");
            setSelectedState(normalTab ? normalTab.id : null);
            handleDeleteModalClose();
        } catch (error) {
            console.error("Failed to delete the state:", error);
        }
    }
};

    const handleDeleteModalShow = (tabId) => {
        setTabToDelete(tabId);
        setShowDeleteModal(true);
    };

    const handleDeleteModalClose = () => {
        setTabToDelete(null);
        setShowDeleteModal(false);
    };

    const handleDoubleClick = (id, label) => {
        if(label !== 'Normal') {
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
                        className={`tab ${selectedState === tab.id ? 'active' : ''}`}
                        onClick={() => setSelectedState(tab.id)}
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
                                <span onDoubleClick={() => handleDoubleClick(tab.id, tab.name)}>{tab.name}</span>
                                {tab.name !== 'Normal' && <button onClick={() => handleDeleteModalShow(tab.id)}><i className="bi bi-x"></i></button>}
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

export default PreviewStatesTabs;