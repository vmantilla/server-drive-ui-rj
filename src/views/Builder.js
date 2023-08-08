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

import { openDB } from 'idb';

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

import { firebase } from '../firebase';
import { doc, setDoc } from "firebase/firestore";

import { getDefaultProps, getDefaultTextViewProperties } from './components/GetDefaultProps';
import { v4 as uuidv4 } from 'uuid';
import SDComponentType from '../enums/SDComponentType';

import axios from 'axios';

// Configura axios para usar "http://localhost:3000" como URL base
axios.defaults.baseURL = "http://localhost:3000";

axios.interceptors.request.use(function (config) {
  const token = localStorage.getItem('token');
  config.headers.Authorization = token ? `Bearer ${token}` : '';
  return config;
});

const getComponentsFromAPI = async (selectedPreview) => {
  const response = await axios.get(`/previews/${selectedPreview}/components`);
  return response.data;
};

const saveComponentsToAPI = async (selectedPreview, components) => {
  const response = await axios.put(`/previews/${selectedPreview}/components`, { components });
  return response.data;
};


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

  useEffect(() => {
    console.log(selectedPreview);
    
  if (selectedPreview && selectedPreview.id) {
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
      console.log(droppedComponents);
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

  const importComponentsFromJSON = async () => {
  // Solicita al usuario que cargue el archivo JSON
    const file = await new Promise((resolve) => {
      let fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'application/json';

      fileInput.onchange = (e) => {
        let file = e.target.files[0];
        resolve(file);
      };

      fileInput.click();
    });

  // Lee y analiza el archivo JSON
    let fileReader = new FileReader();
    fileReader.onload = async (e) => {
      let components = JSON.parse(e.target.result);

    // Abre la base de datos IndexedDB
      const db = await openDB('builderDB', 1);

    // Limpia los componentes existentes
      await db.clear('droppedComponentsStore');

    // Agrega los nuevos componentes a la base de datos
      for (let i = 0; i < components.length; i++) {
        const component = SDComponent.fromJSON(components[i]);
        await db.put('droppedComponentsStore', component, i);
      }

    // Actualiza el estado con los nuevos componentes
      setDroppedComponents(components.map(component => SDComponent.fromJSON(component)));
    };

    fileReader.readAsText(file);
  };


  const deploy = async () => {
    try {
      const db = await openDB('builderDB', 1);
      const components = await db.getAll('droppedComponentsStore');
      const dataStr = JSON.stringify(components);

      const docRef = doc(firebase, "users", "ravit-21");

      await setDoc(docRef, { dataStr }, { merge: true });
      console.log("Document updated with ID: ", docRef.id);
    } catch (e) {
      console.error("Error updating document: ", e);
    }
  };

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
    console.log("handleDeleteComponent",componentId)
    const nestedComponentToDelete = deleteNestedComponent(droppedComponents, componentId)
    setDroppedComponents(nestedComponentToDelete);
  };


  const exportComponentsToJSON = async () => {
    const db = await openDB('builderDB', 1);
    const components = await db.getAll('droppedComponentsStore');
    const dataStr = JSON.stringify(components);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'data.json';

    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
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
  
  useEffect(() => {
    console.log("droppedComponents", droppedComponents);
    const updateDB = async () => {
      const db = await openDB('builderDB', 1);
      for (let i = 0; i < droppedComponents.length; i++) {
        if (droppedComponents[i]) {
          if (typeof droppedComponents[i].toJSON === 'function') {
            await db.put('droppedComponentsStore', droppedComponents[i].toJSON(), i);
          } else {
            console.log(`droppedComponents[${i}] no tiene un método toJSON`);
          }
        } else {
          console.log(`droppedComponents[${i}] es undefined o null`);
        }
      }
    };

    updateDB();
  }, [droppedComponents]);

  useEffect(() => {
    const initDB = async () => {
      const db = await openDB('builderDB', 1, {
        upgrade(db) {
          db.createObjectStore('droppedComponentsStore');
        },
      });
      const components = await db.getAll('droppedComponentsStore');
      setDroppedComponents(components.map(component => SDComponent.fromJSON(component)));
    };

    initDB();
  }, []);


  const updateComponent = (componentId, newProperties) => {
    // Convertir newProperties a una instancia de SDProperties
    console.log("updateComponent", newProperties);
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

  const handleEmbedComponent = (parentType, childId) => {
  if (parentType !== SDComponentType.ContainerView && parentType !== SDComponentType.Button) {
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





  const clearDroppedComponents = async () => {
    const db = await openDB('builderDB', 1);
    await db.clear('droppedComponentsStore');
    setDroppedComponents([]);
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

  const handleDuplicateComponent = (componentId) => {
  // Recursive function to create a duplicate of a component and its children
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

  // Recursive function to find the component to duplicate
  const findNestedComponent = (components, targetId) => {
    for (let component of components) {
      if (component.id === targetId) return component;
      if (component.children) {
        const found = findNestedComponent(component.children, targetId);
        if (found) return found;
      }
    }
    return null;
  };

  const componentToDuplicate = findNestedComponent(droppedComponents, componentId);

  if (componentToDuplicate) {
    const duplicatedComponent = duplicateComponent(componentToDuplicate);

    // Recursive function to insert the duplicated component
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

    let newComponents = [...droppedComponents];
    insertDuplicatedComponent(newComponents);

    setDroppedComponents(newComponents);
  } else {
    console.warn(`Component with ID ${componentId} not found`);
  }
};

  return (
    <DndProvider backend={HTML5Backend}>
    <App>
    <View main>
    {errorMessage && <div className="error-message">{errorMessage}</div>}

    <div className="container-fluid" style={{ height: '100vh' }}>
    <button onClick={clearDroppedComponents}>Limpiar</button>
    <button onClick={exportComponentsToJSON}>Exportar como JSON</button>
    <button onClick={importComponentsFromJSON}>Importar desde JSON</button>
    <button onClick={deploy}>Deploy</button>
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
    {droppedComponents.map((component, index) => (
      <SDComponentTree key={index}
      component={component} 
      selectedComponent={selectedComponent} 
      setSelectedComponent={setSelectedComponent}
      droppedComponents={droppedComponents}
      setDroppedComponents={setDroppedComponents}
      handleAddComponent={handleAddComponent}
      handleEmbedComponent={handleEmbedComponent}
      handleDuplicateComponent={handleDuplicateComponent}
      handleDeleteComponent={handleDeleteComponent} 
       />
    ))}
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
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'auto',
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
