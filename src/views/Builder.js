import React, { useState, useEffect } from 'react';
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

import SDComponent from '../models/structs/SDComponent';
import SDProperties from '../models/structs/SDProperties';

import DropZone from './DropZone';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/Builder.css';


const Builder = () => {
  const [activeTab, setActiveTab] = useState('components');
  const [themesData, setThemesData] = useState(null);
  const [selectedView, setSelectedView] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [components, setComponents] = useState([]);
  const [previewBuilderData, setPreviewBuilderData] = useState([]);

  const [selectedComponent, setSelectedComponent] = useState({});
  const [droppedComponents, setDroppedComponents] = useState([])

  const deleteNestedComponent = (components, targetId) => {
  return components.reduce((updatedComponents, component) => {
    // Si el componente actual es el que se va a eliminar, no lo agregue a la lista de componentes actualizados.
    if (component.id === targetId) {
      return updatedComponents;
    }

    // Si el componente tiene hijos, revise cada uno de ellos también.
    if (component.childrens) {
      return [
        ...updatedComponents,
        {
          ...component,
          childrens: deleteNestedComponent(component.childrens, targetId),
        },
      ];
    }

    // Si no se cumple ninguna de las condiciones anteriores, simplemente agregue el componente a la lista de componentes actualizados.
    return [...updatedComponents, component];
  }, []);
};

const deleteComponent = (componentId) => {
  setDroppedComponents(deleteNestedComponent(droppedComponents, componentId));
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
        component.componentType,
        newProperties,
        component.childrens,
        component.states,
        component.order
      );

      // Actualiza el componente seleccionado en el estado.
      setSelectedComponent(updatedComponent);

      // Retorna el nuevo componente en lugar del original.
      return updatedComponent;
    } else if (component.childrens) {
      // Crear un nuevo componente con los childrens actualizados
      const updatedComponent = new SDComponent(
        component.id,
        component.componentType,
        component.properties,
        updateNestedComponent(component.childrens, targetId, newProperties), // Actualiza los hijos
        component.states,
        component.order
      );

      return updatedComponent;
    } else {
      return component;
    }
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

  return (
    <DndProvider backend={HTML5Backend}>
      <App>
        <View main>
          <div className="container-fluid" style={{ height: '100vh' }}>
           <button onClick={clearDroppedComponents}>Limpiar</button>
           <button onClick={exportComponentsToJSON}>Exportar como JSON</button>
            <Tabs
              activeKey={activeTab}
              onSelect={handleTabChange}
              id="uncontrolled-tab-example"
              className="mb-3 custom-tabs"
            >
              <Tab eventKey="components" title="Components">
                {/* Panel de componentes */}
                <div className="row" style={{ height: 'calc(100vh - 60px)' }}>
                <div className="col-3 resizable-panel">
                  <div className="panel-container">
                    <span className="panel-title">Listado de componentes</span>
                    <Componentes/>
                  </div>
                </div>
                <div className="col-6 resizable-panel">
                  <div className="panel-container">
                    <span className="panel-title">Área de construcción de la interfaz de usuario</span>
                    <DropZone 
                      style={{
                        width: '375px', 
                        height: '812px', 
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
                </div>
                <div className="col-3 resizable-panel">
                  <div className="panel-container" style={{overflowY: 'auto', maxHeight: '100vh'}}>
                    <span className="panel-title">Panel de propiedades del componente</span>
                     {selectedComponent && <PropertyInspector themesData={themesData} 
                     component={selectedComponent} 
                     updateComponent={updateComponent}
                     deleteComponent={deleteComponent}   />
                      }

                
                  </div>
                </div>
              </div>
              <div className="row resizable-panel">
                <div className="col-12">
                  <span className="panel-title">Panel de vistas</span>
                  <PreviewGrid themesData={themesData} />
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
