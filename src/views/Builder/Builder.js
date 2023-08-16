import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import BuilderHeader from './BuilderHeader';
import BuilderComponents from './BuilderComponents';
import BuilderWorkspaces from './BuilderWorkspaces';
import PreviewWorkspace from './PreviewWorkspace';
import '../../css/Builder/Builder.css';

function Builder({showNotification}) {
  const { projectId } = useParams();
  const [isComponentsOpen, setIsComponentsOpen] = useState(true);
  const [isPropertiesOpen, setIsPropertiesOpen] = useState(false);
  const [selectedScreen, setSelectedScreen] = useState(null);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [addNewPreview, setAddNewPreview] = useState(null);

  const handleWorkspaceClick = (e) => {
    if (e.target === e.currentTarget) {
      setSelectedScreen(null);
    }
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
          <BuilderWorkspaces projectId={projectId} selectedWorkspace={selectedWorkspace} setSelectedWorkspace={setSelectedWorkspace} />
          <BuilderComponents setIsPropertiesOpen={setIsPropertiesOpen} />
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
          <div className="builder-properties-header">
            <h2>Propiedades</h2>
            <button onClick={() => setIsPropertiesOpen(false)}>
              <i className="bi bi-x"></i>
            </button>
          </div>
        </aside>
      </main>
    </div>
  );
}

export default Builder;
