import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import BuilderHeader from './BuilderHeader';
import PreviewComponents from './Preview/PreviewComponents';
import BuilderWorkspaces from './BuilderWorkspaces';
import PreviewWorkspace from './Preview/PreviewWorkspace';
import ComponentProperties from './Component/ComponentProperties';
import '../../css/Builder/Builder.css';
import { batchUpdateComponentsToAPI } from '../api';

import { useBuilder } from './BuilderContext';

function Builder({showNotification}) {

  const { 
    selectedScreen, setSelectedScreen,
    selectedComponent, setSelectedComponent,
    resetBuilder
  } = useBuilder();

  const { projectId } = useParams();
  const [isComponentsOpen, setIsComponentsOpen] = useState(true);
  const [isPropertiesOpen, setIsPropertiesOpen] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [addNewPreview, setAddNewPreview] = useState(null);
  const [updatePreview, setUpdatePreview] = useState(null);
  const [onDelete, setOnDelete] = useState(null);
  const [workspaceHeight, setWorkspaceHeight] = useState('50%');
  const [componentToAdd, setComponentToAdd] = useState(null);
  const [propertyWasUpdated, setPropertyWasUpdated] = useState(null);
  const [shouldUpdate, setShouldUpdate] = useState(false);
  const [orderUpdated, setOrderUpdated] = useState(false);

  useEffect(() => {
    resetBuilder();
  }, []);
  

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
        updatePreview={updatePreview}
        onDelete={onDelete}
        setComponentToAdd={setComponentToAdd}
        shouldUpdate={shouldUpdate}
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
            setShouldUpdate={setShouldUpdate}
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
            setUpdatePreview={setUpdatePreview}
            setOnDelete={setOnDelete}
            forceReflow={forceReflow}
            showNotification={showNotification}
            propertyWasUpdated={propertyWasUpdated}
            orderUpdated={orderUpdated}
          />
        </section>
        <aside className={`builder-properties ${selectedComponent ? 'open' : ''}`}>
          <ComponentProperties 
            previewId={selectedScreen}
            setPropertyWasUpdated={setPropertyWasUpdated} />
        </aside>
      </main>
    </div>
  );
}

export default Builder;
