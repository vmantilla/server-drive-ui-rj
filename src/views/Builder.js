import React, { useState, useEffect } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import { Resizable } from 're-resizable';
import { AiOutlineDrag } from 'react-icons/ai';
import { loadThemes } from '../styles/themes';
import Draggable from 'react-draggable';
import { App, View } from 'framework7-react';
import { fetchJsonFile } from '../helpers/utils';

import Preview from './Preview';
import PreviewGrid from './PreviewGrid';
import ColorsAndFontsView from './ColorsAndFontsView';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/Builder.css';

const Builder = () => {
  const [activeTab, setActiveTab] = useState('components');
  const [themesData, setThemesData] = useState(null);
  const [selectedView, setSelectedView] = useState(null);
  const [previewData, setPreviewData] = useState([]);

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
                <Preview themesData={themesData} viewData={previewData} />
              </div>
            </Tab>
          </Tabs>
        </div>
      </View>
    </App>
  );
};

export default Builder;
