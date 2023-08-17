import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import BuilderHeader from './BuilderHeader';
import PreviewComponents from './Preview/PreviewComponents';
import BuilderWorkspaces from './BuilderWorkspaces';
import PreviewWorkspace from './Preview/PreviewWorkspace';
import ComponentProperties from './Component/ComponentProperties';
import '../../css/Builder/Builder.css';

function Builder({showNotification}) {
  const { projectId } = useParams();
  const [isComponentsOpen, setIsComponentsOpen] = useState(true);
  const [isPropertiesOpen, setIsPropertiesOpen] = useState(false);
  const [selectedScreen, setSelectedScreen] = useState(null);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [addNewPreview, setAddNewPreview] = useState(null);
  const [workspaceHeight, setWorkspaceHeight] = useState('50%');

  const handleWorkspaceClick = (e) => {
    if (e.target === e.currentTarget) {
      setSelectedScreen(null);
    }
  };

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

  return (
    <div className="builder">
      <BuilderHeader
        isComponentsOpen={isComponentsOpen}
        setIsComponentsOpen={setIsComponentsOpen}
        selectedScreen={selectedScreen}
        addNewPreview={addNewPreview}
      />
      <main className="builder-main">
        <aside className={`builder-components ${isComponentsOpen ? 'open' : 'closed'}`}>
          <BuilderWorkspaces
            projectId={projectId}
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
              projectId={projectId}
              selectedScreen={selectedScreen}
              setIsPropertiesOpen={setIsPropertiesOpen} 
              showNotification={showNotification}
            />
          )}
        </aside>
        <section className="builder-workspace" onClick={handleWorkspaceClick}>
          <PreviewWorkspace
            projectId={projectId}
            workspaceId={selectedWorkspace?.id}
            setSelectedScreen={setSelectedScreen}
            selectedScreen={selectedScreen}
            setAddNewPreview={setAddNewPreview}
            forceReflow={forceReflow}
            showNotification={showNotification}
          />
        </section>
        <aside className={`builder-properties ${isPropertiesOpen ? 'open' : ''}`}>
          <ComponentProperties isPropertiesOpen={isPropertiesOpen} setIsPropertiesOpen={setIsPropertiesOpen} />
        </aside>
      </main>
    </div>
  );
}

export default Builder;
