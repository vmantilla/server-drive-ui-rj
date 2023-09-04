import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import BuilderHeader from './BuilderHeader';
import PreviewComponents from './Preview/PreviewComponents';
import BuilderWorkspaces from './BuilderWorkspaces';
import PreviewWorkspace from './Preview/PreviewWorkspace';
import ComponentProperties from './Component/ComponentProperties';
import '../../css/Builder/Builder.css';
import ComponentManager from './ComponentManager';
import { batchUpdateComponentsToAPI } from '../api';

function Builder({showNotification}) {
  const { projectId } = useParams();
  const [isComponentsOpen, setIsComponentsOpen] = useState(true);
  const [isPropertiesOpen, setIsPropertiesOpen] = useState(false);
  const [selectedScreen, setSelectedScreen] = useState(null);
  const [selectedComponents, setSelectedComponents] = useState([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [addNewPreview, setAddNewPreview] = useState(null);
  const [updatePreview, setUpdatePreview] = useState(null);
  const [onDelete, setOnDelete] = useState(null);
  const [workspaceHeight, setWorkspaceHeight] = useState('50%');
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [componentToAdd, setComponentToAdd] = useState(null);
  const [updateComponentProperties, setUpdateComponentProperties] = useState(null);

  let componentManager = new ComponentManager(null);



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

  const triggerUpdateComponentProperties = (selectedComponent, newProperties) => {
    setUpdateComponentProperties({component: selectedComponent, newProperties: newProperties});
  };

  useEffect(() => {
    if (updateComponentProperties !== null) {
      setUpdateComponentProperties(null);
    }
  }, [updateComponentProperties]);

  useEffect(() => {
    componentManager.clearUpdateQueue();
  }, []);

  useEffect(() => {
    const checkUpdatesAndSave = async () => { 
      let componentsToUpdate = componentManager.getUpdateQueue()
      if (componentsToUpdate.length > 0) {
        try {
          await batchUpdateComponentsToAPI(projectId, componentsToUpdate);
          componentManager.clearUpdateQueue();
          showNotification('success', 'Componentes actualizados exitosamente.');
        } catch (error) {
          console.error('Error al actualizar los componentes:', error);
          showNotification('error', error.message);
        }
      }
      setTimeout(checkUpdatesAndSave, 10000); 
    };

    const timerId = setTimeout(checkUpdatesAndSave, 10000);

    return () => {
      clearTimeout(timerId);
    };
  }, []);




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
              previewId={selectedScreen}
              selectedComponent={selectedComponent} 
              setSelectedComponent={setSelectedComponent}
              showNotification={showNotification}
              componentToAdd={componentToAdd}
              updateProperties={updateComponentProperties}
            />
          )}
        </aside>
        <section className="builder-workspace">
          <PreviewWorkspace
            workspaceId={selectedWorkspace?.id}
            setSelectedScreen={setSelectedScreen}
            selectedScreen={selectedScreen}
            setAddNewPreview={setAddNewPreview}
            setUpdatePreview={setUpdatePreview}
            setOnDelete={setOnDelete}
            forceReflow={forceReflow}
            showNotification={showNotification}
            selectedComponents={selectedComponents}
            selectedComponent={selectedComponent} 
            setSelectedComponent={setSelectedComponent}

          />
        </section>
        <aside className={`builder-properties ${selectedComponent ? 'open' : ''}`}>
          <ComponentProperties 
            selectedComponent={selectedComponent} 
            setSelectedComponent={setSelectedComponent}
            triggerUpdateProperties={triggerUpdateComponentProperties}  />
        </aside>
      </main>
    </div>
  );
}

export default Builder;
