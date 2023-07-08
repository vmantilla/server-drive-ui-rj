import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { App, View } from 'framework7-react';
import Preview from './Preview';
import ColorsAndFontsView from './ColorsAndFontsView';
import { Tab, Tabs } from 'react-bootstrap';
import { Resizable } from 're-resizable';
import { AiOutlineDrag } from 'react-icons/ai';
import Draggable from 'react-draggable';
import '../css/Builder.css';
import { loadThemes } from '../styles/themes';

const Builder = () => {
  const [activeTab, setActiveTab] = useState('components');
  const [themesData, setThemesData] = useState(null);

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
  };

  useEffect(() => {
    // Llamar a loadThemes para cargar los datos de los themes
    loadThemes().then((data) => {
      setThemesData(data);
    });
  }, []);

  return (
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
                  <span>Listado de componentes</span>
                </div>
                <div className="col-6 resizable-panel">
                  <span>Área de construcción de la interfaz de usuario</span>
                </div>
                <div className="col-3 resizable-panel">
                  <span>Panel de propiedades del componente</span>
                </div>
              </div>
              <div className="row resizable-panel">
                <div className="col-12">
                  <span>Panel de vistas</span>
                </div>
              </div>
            </Tab>
            <Tab eventKey="colors_fonts" title="Colors & Fonts">
              {/* Panel de paleta de colores y fuentes */}
              {themesData && <ColorsAndFontsView />}
            </Tab>
            <Tab eventKey="preview" title="Preview">
              {/* Panel de vista previa */}
              <div className="resizable-panel">
                <Preview />
              </div>
            </Tab>
          </Tabs>
        </div>
      </View>
    </App>
  );
};

export default Builder;
