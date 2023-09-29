import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import BuilderHeader from './BuilderHeader';
import PreviewComponents from './Preview/PreviewComponents';
import BuilderWorkspaces from './BuilderWorkspaces';
import PreviewWorkspace from './Preview/PreviewWorkspace';
import ComponentProperties from './Component/ComponentProperties';
import '../../css/Builder/Builder.css';
import { batchUpdatesToAPI } from '../api';

import { useBuilder } from './BuilderContext';

const updateInterval = 10000;

function Builder({showNotification}) {

  const { 
    uiScreens, setUiScreens,
    uiWidgets, setUiWidgets,
    uiWidgetsProperties, setUiWidgetsProperties,
    selectedScreen, setSelectedScreen,
    selectedComponent, setSelectedComponent,
    resetBuilder,
    updateQueue, setUpdateQueue,
    shouldUpdate, setShouldUpdate,
    updateSelectedComponentProperties,
    handleObjectChange, getUpdateObject
  } = useBuilder();

  const { projectId } = useParams();
  const [isComponentsOpen, setIsComponentsOpen] = useState(true);
  const [isPropertiesOpen, setIsPropertiesOpen] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [addNewPreview, setAddNewPreview] = useState(null);
  const [onDelete, setOnDelete] = useState(null);
  const [workspaceHeight, setWorkspaceHeight] = useState('50%');
  const [componentToAdd, setComponentToAdd] = useState(null);
  const [propertyWasUpdated, setPropertyWasUpdated] = useState(null);
  const [orderUpdated, setOrderUpdated] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    console.warn('resetBuilder:', retryCount);
    resetBuilder();
    setUpdateQueue({
      uiScreens: [],
      uiWidgets: [],
      uiWidgetsProperties: [],
    });
  }, []);


  const resetEverything = () => {
    console.error('Reached maximum retry attempts. Resetting everything.');
    resetBuilder();
    setUpdateQueue({
      uiScreens: [],
      uiWidgets: [],
      uiWidgetsProperties: [],
    });
    setShouldUpdate(false);
    setRetryCount(0); 
  };

  const updateChanges = async () => {
    const updateObject = getUpdateObject();
    try {
      const updatedObject = await batchUpdatesToAPI(projectId, updateObject);
      setUpdateQueue({
        uiScreens: [],
        uiWidgets: [],
        uiWidgetsProperties: [],
      });
      setShouldUpdate(false);
      setRetryCount(0); 
      } catch (error) {
        console.error('Error updating objects:', error);
        setRetryCount((prevCount) => prevCount + 1); 
      }
    };

    useEffect(() => {
      let intervalId;
      if (projectId && shouldUpdate) {
        if (retryCount >= 10) {
          console.warn('resetEverything:', retryCount);
          resetEverything();
        } else {
          intervalId = setInterval(() => {
            updateChanges();
          }, updateInterval);
        }
      }

      return () => clearInterval(intervalId);
    }, [projectId, shouldUpdate, retryCount]);


    const handleDrag = (e) => {
      e.preventDefault();
      const newHeight = Math.min(Math.max(e.clientY, 0), window.innerHeight);
      setWorkspaceHeight(`${newHeight}px`);
  };

  const forceReflow = () => {
    document.body.style.display = 'none';
    void document.body.offsetHeight;
    document.body.style.display = '';
  };

  const handleComponentsOrderUpdated = (date) => {
    setOrderUpdated(date);
  }

  return (
    <div className="builder">
      <BuilderHeader
        isComponentsOpen={isComponentsOpen}
        setIsComponentsOpen={setIsComponentsOpen}
        selectedScreen={selectedScreen}
        addNewPreview={addNewPreview}
        onDelete={onDelete}
        setComponentToAdd={setComponentToAdd}
        shouldUpdate={shouldUpdate}
        updateChanges={updateChanges}
      />
      <main className="builder-main">
        <aside className={`builder-components ${isComponentsOpen ? 'open' : 'closed'}`}>
          <BuilderWorkspaces
            projectId={projectId}
            selectedComponent={selectedComponent} 
            selectedWorkspace={selectedWorkspace}
            setSelectedWorkspace={setSelectedWorkspace}
            style={{ height: workspaceHeight }}
            className="builder-workspaces"
          />
          <div
            className="resizable-separator"
            onMouseDown={(e) => {
              document.addEventListener('mousemove', handleDrag);
              document.addEventListener('mouseup', () => {
                document.removeEventListener('mousemove', handleDrag);
              });
            }}
          ></div>
          {selectedScreen && (
            <PreviewComponents 
              showNotification={showNotification}
              componentToAdd={componentToAdd}
              onOrderUpdated={handleComponentsOrderUpdated}
            />
          )}
        </aside>
        <section className="builder-workspace">
          <PreviewWorkspace
            workspaceId={selectedWorkspace?.id}
            setAddNewPreview={setAddNewPreview}
            setOnDelete={setOnDelete}
            forceReflow={forceReflow}
            showNotification={showNotification}
            propertyWasUpdated={propertyWasUpdated}
            orderUpdated={orderUpdated}
          />
        </section>
        <aside className={`builder-properties ${selectedComponent ? 'open' : ''}`}>
          <ComponentProperties 
            key={`${selectedScreen}${selectedComponent}`}
            previewId={selectedScreen}
            setPropertyWasUpdated={setPropertyWasUpdated} />
        </aside>
      </main>
    </div>
  );
}

export default Builder;
