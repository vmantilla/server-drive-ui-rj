import React, { useState, useEffect, useCallback } from 'react';

import { Tab, Tabs } from 'react-bootstrap';
import { Resizable } from 're-resizable';
import { AiOutlineDrag } from 'react-icons/ai';
import { loadThemes } from '../styles/themes';
import Draggable from 'react-draggable';
import { App, View } from 'framework7-react';
import { fetchJsonFile } from '../helpers/utils';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import Preview from './Preview';
import PreviewGrid from './thumbnailsPreview/PreviewGrid';
import ColorsAndFontsView from './ColorsAndFontsView';
import { Componentes } from './components/Componentes';
import PropertyInspector from './PropertiesInspector/PropertyInspector';
import SDComponentTree from './SDComponentTree';

import SDComponent from '../models/structs/SDComponent';
import SDProperties from '../models/structs/SDProperties';

import DropZone from './DropZone';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/Builder.css';


import { getDefaultProps, getDefaultTextViewProperties } from './components/GetDefaultProps';
import { v4 as uuidv4 } from 'uuid';
import SDComponentType from '../enums/SDComponentType';

import {
  importComponentsFromJSON,
  deploy,
  exportComponentsToJSON,
  clearDroppedComponents,
  initDB,
  updateDB
} from './actions/dbActions.js';

import { getComponentsFromAPI, saveComponentsToAPI } from './api.js'; 


const Builder = () => {
  const [activeTab, setActiveTab] = useState('components');
  const [themesData, setThemesData] = useState(null);
  const [selectedView, setSelectedView] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [components, setComponents] = useState([]);
  const [previewBuilderData, setPreviewBuilderData] = useState([]);

  const [selectedComponent, setSelectedComponent] = useState({});
  const [droppedComponents, setDroppedComponents] = useState([])


  const [errorMessage, setErrorMessage] = useState(null);


  const [selectedPreview, setSelectedPreview] = useState(null);

  const handlePreviewSelect = (preview) => {
    setSelectedPreview(preview);
  };

  // Usar el efecto para inicializar la base de datos cuando el componente se monte
  useEffect(() => {
    initDB(setDroppedComponents);
  }, []);

  // Usar el efecto para actualizar la base de datos cuando 'droppedComponents' cambie
  useEffect(() => {
    updateDB(droppedComponents);
  }, [droppedComponents]);


  const dbActions = {
    handleImport: async () => {
      //const fileContent = /* logic to read the file content */
      importComponentsFromJSON(setDroppedComponents);
    },

    handleExport: async () => {
      exportComponentsToJSON(droppedComponents);
    },

    handleDeploy: async () => {
      deploy();
    },

    handleClearDroppedComponents: async () => {
      clearDroppedComponents(setDroppedComponents);
    }
  };


  useEffect(() => {
  if (selectedPreview && selectedPreview.id) {
    dbActions.handleClearDroppedComponents()
    getComponentsFromAPI(selectedPreview.id)
      .then(componentsFromServer => {
        setDroppedComponents(componentsFromServer.map(component => SDComponent.fromJSON(component)));

      })
      .catch(err => {
        console.error(err);
        setErrorMessage("No se pudieron cargar los componentes");
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
      });
  }
}, [selectedPreview]);


  const saveComponent = useCallback(() => {
    if (selectedPreview && selectedPreview.id) {
    saveComponentsToAPI(selectedPreview.id, droppedComponents)
    .then(() => {
      console.log('Componentes guardados con éxito');
    })
    .catch(err => {
      console.error(err);
      setErrorMessage("No se pudieron guardar los componentes");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    });
    }
  }, [droppedComponents]);

  
  const deleteNestedComponent = (components, targetId) => {
    return components.flatMap(component => {
      if (component.id === targetId) {
      // Si el componente actual es el que se va a eliminar, retorna un array vacío para que no se incluya en los resultados.
        return [];
      } else if (component.children) {
      // Crear un nuevo componente con los children actualizados
        const updatedComponent = new SDComponent(
          component.id,
          component.component_type,
          component.properties,
        deleteNestedComponent(component.children, targetId), // Elimina los hijos
        component.states,
        component.order
        );

        return [updatedComponent];
      } else {
        return [component];
      }
    });
  };


  const handleDeleteComponent = (componentId) => {
  if (window.confirm("¿Estás seguro de que quieres eliminar este componente?")) {
    deleteComponent(componentId);
  }
};

  const deleteComponent = (componentId) => {
    const nestedComponentToDelete = deleteNestedComponent(droppedComponents, componentId)
    setDroppedComponents(nestedComponentToDelete);
  };


const handleAddComponent = (type) => {
    const componentChildren = [];
    if (type === SDComponentType.Button) {
      componentChildren.push(new SDComponent(uuidv4(), SDComponentType.Object, getDefaultTextViewProperties(), [], {}));
    }
    const newComponent = new SDComponent(uuidv4(), type, getDefaultProps(type), componentChildren, {});
    setDroppedComponents(prevComponents => {
      const addComponentToSelected = (comp) => { if (comp.id === selectedComponent.id) comp.children.push(newComponent); comp.children.forEach(addComponentToSelected); };
      let newComponents = [...prevComponents]; newComponents.forEach(addComponentToSelected); return newComponents;
    });
  };
  
  
  const updateComponent = (componentId, newProperties) => {
    const properties = SDProperties.fromJSON(newProperties);

    const newDroppedComponents = updateNestedComponent(droppedComponents, componentId, properties);
    setDroppedComponents(newDroppedComponents);
  };


  const updateNestedComponent = (components, targetId, newProperties) => {
    return components.map(component => {
      if (component.id === targetId) {
      // Crea una nueva instancia del componente, no la actualices.
        const updatedComponent = new SDComponent(
          component.id,
          component.component_type,
          newProperties,
          component.children,
          component.states,
          component.order
          );

      // Actualiza el componente seleccionado en el estado.
        setSelectedComponent(updatedComponent);

      // Retorna el nuevo componente en lugar del original.
        return updatedComponent;
      } else if (component.children) {
      // Crear un nuevo componente con los children actualizados
        const updatedComponent = new SDComponent(
          component.id,
          component.component_type,
          component.properties,
        updateNestedComponent(component.children, targetId, newProperties), // Actualiza los hijos
        component.states,
        component.order
        );

        return updatedComponent;
      } else {
        return component;
      }
    });
  };

  const handleComponentClick = (e, component) => {
  // Comprueba si component es una instancia de SDComponent
    if (!(component instanceof SDComponent)) {
    // Si no lo es, convierte el objeto plano a una instancia de SDComponent
      component = SDComponent.fromJSON(component);
    }
    setSelectedComponent(component);
  };


  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
  };

  useEffect(() => {
    // Llamar a loadThemes para cargar los datos de los themes
    loadThemes().then((data) => {
      setThemesData(data);
    });
  }, []);

  useEffect(() => {
    fetchJsonFile('./file.json').then(data => {
      setPreviewData(data);
    });
  }, []);

  useEffect(() => {
    fetchJsonFile('./components.json').then(data => {
      setComponents(data.components);
    });
  }, []);

 const findComponentAndParent = (components, targetId, parent = null) => {
  for (let component of components) {
    if (component.id === targetId) return { component, parent };
    if (component.children) {
      const found = findComponentAndParent(component.children, targetId, component);
      if (found) return found;
    }
  }
  return null;
};

const handleMoveComponent = (childId, parentId) => {
  setDroppedComponents(prevComponents => {
    const foundChildAndParent = findComponentAndParent(prevComponents, childId);
    if (!foundChildAndParent) {
      console.warn(`Child component with ID ${childId} not found`);
      return prevComponents;
    }

    const { component: child, parent: oldParent } = foundChildAndParent;

    if (oldParent) {
      const oldIndex = oldParent.children.indexOf(child);
      oldParent.children.splice(oldIndex, 1);
    } else {
      const oldIndex = prevComponents.indexOf(child);
      prevComponents.splice(oldIndex, 1);
    }

    const { component: newParent } = findComponentAndParent(prevComponents, parentId);
    newParent.children.push(child);

    return [...prevComponents];
  });
};

const handleDuplicateComponent = (componentId) => {
  const duplicateComponent = (component) => {
    const newChildren = component.children ? component.children.map(duplicateComponent) : [];
    return new SDComponent(
      uuidv4(),
      component.component_type,
      component.properties,
      newChildren,
      component.states,
      component.order
    );
  };

  setDroppedComponents(prevComponents => {
    const foundComponent = findComponentAndParent(prevComponents, componentId);
    if (!foundComponent) {
      console.warn(`Component with ID ${componentId} not found`);
      return prevComponents;
    }

    const { component: componentToDuplicate } = foundComponent;
    const duplicatedComponent = duplicateComponent(componentToDuplicate);

    const insertDuplicatedComponent = (components) => {
      components.forEach((component, index) => {
        if (component.id === componentId) {
          components.splice(index + 1, 0, duplicatedComponent);
        }
        if (component.children) {
          insertDuplicatedComponent(component.children);
        }
      });
    };

    let newComponents = [...prevComponents];
    insertDuplicatedComponent(newComponents);

    return newComponents;
  });
};

const handleEmbedComponent = (parentType, childId) => {
  if (parentType !== SDComponentType.ContainerView && parentType !== SDComponentType.Button && parentType !== SDComponentType.ScrollView) {
    console.error("El tipo de padre debe ser un ContainerView o un Button");
    return;
  }

  // Función recursiva para encontrar el componente hijo y su padre
  const findChildAndParent = (components, targetId, parent = null) => {
    for (let component of components) {
      if (component.id === targetId) return { child: component, parent };
      if (component.children) {
        const found = findChildAndParent(component.children, targetId, component);
        if (found) return found;
      }
    }
    return null;
  };

  setDroppedComponents(prevComponents => {
    const { child, parent } = findChildAndParent(prevComponents, childId);

    // Crear una nueva instancia del componente padre utilizando SDComponent.
    const parentComponent = new SDComponent(
      uuidv4(),
      parentType,
      getDefaultProps(parentType),
      [child], // Insertar el componente hijo en el componente padre.
      {},
    );

    // Si el componente hijo se encuentra en la raíz, reemplazarlo directamente
    if (!parent) {
      return prevComponents.map(component => component.id === childId ? parentComponent : component);
    }

    // Reemplazar el componente hijo en su padre con el nuevo componente padre
    const index = parent.children.indexOf(child);
    parent.children.splice(index, 1, parentComponent);

    return [...prevComponents];
  });
};



  return (
    <DndProvider backend={HTML5Backend}>
    <App>
    <View main>
    {errorMessage && <div className="error-message">{errorMessage}</div>}

    <div className="container-fluid" style={{ height: '100vh' }}>
    <button onClick={dbActions.handleClearDroppedComponents}>Limpiar</button>
    <button onClick={dbActions.handleExport}>Exportar como JSON</button>
    <button onClick={dbActions.handleImport}>Importar desde JSON</button>
    <button onClick={dbActions.handleDeploy}>Deploy</button>
    <button onClick={saveComponent}>Guardar</button>
    <Tabs
    activeKey={activeTab}
    onSelect={handleTabChange}
    id="uncontrolled-tab-example"
    className="mb-3 custom-tabs"
    >
    <Tab eventKey="components" title="Components">
                {/* Panel de componentes */}
    <div className="row" style={{ height: '100%' }}>
    <div className="col-3 resizable-panel">
    <div className="panel-container">
    <span className="panel-title">Listado de componentes</span>
    {droppedComponents.map((component, index) => {
  return (
    <SDComponentTree key={index}
    component={component} 
    selectedComponent={selectedComponent} 
    setSelectedComponent={setSelectedComponent}
    handleAddComponent={handleAddComponent}
    handleEmbedComponent={handleEmbedComponent}
    handleMoveComponent={handleMoveComponent}
    handleDuplicateComponent={handleDuplicateComponent}
    handleDeleteComponent={handleDeleteComponent} 
     />
  );
})}
{/*  <Componentes/>  */}
    </div>
    </div>
    <div className="col-6 resizable-panel">
    <div className="panel-container">
    <span className="panel-title">Área de construcción de la interfaz de usuario</span>

    {selectedPreview && (
    <div>
    <h2>Preview seleccionada:</h2>
    <p>{selectedPreview.title}</p>
    <DropZone 
    style={{
      width: '430px', 
      height: '844px', 
      borderRadius: '40px',
      backgroundColor: '#F0F0F0',
      boxShadow: '0 0 10px rgba(0,0,0,0.15)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      overflow: 'hidden',
      border: '20px solid #333333' //C0C0C0
    }} 
    droppedComponents={droppedComponents}
    setDroppedComponents={setDroppedComponents}
    onComponentClick={handleComponentClick}
    selectedComponent={selectedComponent} 
    />
    </div>
    )}

    </div>
    </div>
    <div className="col-3 resizable-panel">
    <div className="panel-container" style={{overflowY: 'auto', maxHeight: '100vh'}}>
    <span className="panel-title">Panel de propiedades del componente</span>
    {selectedComponent && <PropertyInspector themesData={themesData} 
    component={selectedComponent} 
    updateComponent={updateComponent}
    handleDeleteComponent={handleDeleteComponent} />
  }


  </div>
  </div>
  </div>
  <div className="row resizable-panel">
  <div className="col-12">
  <span className="panel-title">Panel de vistas</span>
  <PreviewGrid onPreviewSelect={handlePreviewSelect} />
  </div>
  </div>
  </Tab>
  <Tab eventKey="colors_fonts" title="Colors & Fonts">
                {/* Panel de paleta de colores y fuentes */}
                { /* themesData && <ColorsAndFontsView themesData={themesData} viewData={previewData} setThemesData={setThemesData}/> */}
  </Tab>
  <Tab eventKey="preview" title="Preview">
                {/* Panel de vista previa */}
  <div className="resizable-panel">
                 {/* <Preview themesData={themesData} viewData={previewData} /> */}
  </div>
  </Tab>
  </Tabs>
  </div>
  </View>
  </App>
  </DndProvider>
  );
};

export default Builder;
