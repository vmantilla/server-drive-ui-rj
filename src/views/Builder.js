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

import Preview from './Preview';
import PreviewGrid from './thumbnailsPreview/PreviewGrid';
import ColorsAndFontsView from './ColorsAndFontsView';
import { Componentes } from './components/Componentes';
import PropertyInspector from './PropertiesInspector/PropertyInspector';

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
  
  useEffect(() => {
  console.log('droppedComponents changed:', droppedComponents);
}, [droppedComponents]);

  const handleComponentClick = (e, component) => {
    setSelectedComponent(component);
  };

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
  };

const moveCard = (dragIndex, hoverIndex) => {
    console.log("Mover tarjeta desde: ", dragIndex, " a ", hoverIndex);
    // Aquí es donde realizarías la lógica para reordenar tus tarjetas en el estado.
  }

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
                    />
                  </div>
                </div>
                <div className="col-3 resizable-panel">
                  <div className="panel-container" style={{overflowY: 'auto', maxHeight: '100vh'}}>
                    <span className="panel-title">Panel de propiedades del componente</span>
                     {selectedComponent && <PropertyInspector themesData={themesData} component={selectedComponent} droppedComponents={droppedComponents}
                      setDroppedComponents={setDroppedComponents} />
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
                {themesData && <ColorsAndFontsView themesData={themesData} viewData={previewData} setThemesData={setThemesData}/>}
              </Tab>
              <Tab eventKey="preview" title="Preview">
                {/* Panel de vista previa */}
                <div className="resizable-panel">
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
