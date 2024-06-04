import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import BuilderHeader from './BuilderHeader';
import PreviewComponents from './Preview/PreviewComponents';
import BuilderWorkspaces from './BuilderWorkspaces';
import PreviewWorkspace from './Preview/PreviewWorkspace';
import PreviewExperience from './Preview/PreviewExperience';
import PreviewChat from './Preview/PreviewChat';
import PreviewStatesTabs from './Component/ComponentProperties/PreviewStatesTabs';
import ChatAI from './AI/ChatAI/ChatAI';
import ChatComponent from '../Chat/ChatComponent';
import { useNavigate } from 'react-router-dom';
import '../../css/Builder/Builder.css';
import { batchUpdatesToAPI, getProjectFromAPI } from '../../services/api';
import { subscribeToPreviewChannel } from '../../services/actionCable';

import { useBuilder } from './BuilderContext';

const updateInterval = 10000;

function Builder({showNotification}) {

  const { 
    uiScreens, setUiScreens,
    uiComponents, setUiComponents,
    uiComponentsProperties, setUiComponentsProperties,
    selectedScreen, setSelectedScreen,
    selectedComponent, setSelectedComponent,
    resetBuilder,
    updateQueue, setUpdateQueue,
    shouldUpdate, setShouldUpdate,
    updateSelectedComponentProperties,
    handleObjectChange, getUpdateObject
  } = useBuilder();
  
  const navigate = useNavigate();

  const { projectId } = useParams();
  const [projectName, setProjectName] = useState(true);
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
  const isChatAdjacentToTabs = selectedComponent !== null || selectedScreen !== null;
  const [forceWorkspaceUpdate, setForceWorkspaceUpdate] = useState(0);
  const [showPreviewExperience, setShowPreviewExperience] = useState(false);
  const [previewData, setPreviewData] = useState(false);


  useEffect(() => {
    if (selectedWorkspace) {
    const unsubscribe = subscribeToPreviewChannel(selectedWorkspace.id, (response) => {
      console.log(response)
       setForceWorkspaceUpdate(prev => prev + 1);
    });

    return () => unsubscribe();
    }
}, [selectedWorkspace]);


 useEffect(() => {
    console.warn('previewData:', previewData);
  }, [previewData]);


  useEffect(() => {
    console.warn('resetBuilder:', retryCount);
    resetBuilder();
    setUpdateQueue({
      screens: [],
      properties: [],
    });
  }, []);

  useEffect(() => {
  if (selectedScreen) {
    setShowPreviewExperience(true);
  } else {
    setShowPreviewExperience(false);
  }
}, [selectedScreen]);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const hasAccess = await getProjectFromAPI(projectId);
        if (!hasAccess) {
          navigate('/dashboard'); 
        }
        setProjectName(hasAccess.title)
      } catch (error) {
        console.error('Error al verificar el acceso al proyecto:', error);
      }
    };

    fetchProject();
  }, [projectId, navigate]);

  const resetEverything = () => {
    console.error('Reached maximum retry attempts. Resetting everything.');
    resetBuilder();
    setUpdateQueue({
      screens: [],
      properties: [],
    });
    setShouldUpdate(false);
    setRetryCount(0);
    navigate('/dashboard'); 
  };

  const updateChanges = async () => {
    const updateObject = getUpdateObject();
    try {
      const updatedObject = await batchUpdatesToAPI(projectId, updateObject);
      setUpdateQueue({
        screens: [],
        components: [],
        properties: [],
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
          showNotification("error", "Properties could not be updated. Maximum retry attempts reached; restoring the interface.")
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
        projectName={projectName}
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
            key={forceWorkspaceUpdate}
            selectedWorkspace={selectedWorkspace}
            setAddNewPreview={setAddNewPreview}
            setOnDelete={setOnDelete}
            forceReflow={forceReflow}
            showNotification={showNotification}
            propertyWasUpdated={propertyWasUpdated}
            orderUpdated={orderUpdated}
          />
        </section>
        {selectedWorkspace && 2==1 && (
          <ChatComponent chatId={selectedWorkspace.id} canWrite={true} setPreviewData={setPreviewData} onSendMessage={(message) => console.log(message)} />
         )}

        {showPreviewExperience && selectedScreen && 2==1  && (
          <aside className={`builder-properties ${showPreviewExperience ? 'open' : ''}`}>
            <PreviewExperience selectedPreview={selectedScreen} />
          </aside>
        )}

        {previewData && 2==1 && (
          <aside className={`${previewData ? 'open' : ''}`}>
            <PreviewChat jsonData={previewData} />
          </aside>
        )}

        <aside className={`builder-properties ${selectedComponent ? 'open' : ''}`}>
          <PreviewStatesTabs 
            key={`${selectedScreen}${selectedComponent}`}
            previewId={selectedScreen}
            setPropertyWasUpdated={setPropertyWasUpdated} />
        </aside>
      </main>
    </div>
  );
}

export default Builder;
