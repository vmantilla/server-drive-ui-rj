import React, { useState, useEffect } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/ColorsAndFontsView.css';
import Preview from './Preview';
import FontsTab from './subviews/FontsTab';
import ColorsTab from './subviews/ColorsTab';
import { getThemesData, setThemesData, loadThemes } from '../styles/themes.js';


const ColorsAndFontsView = () => {
  const [themesData, setLocalThemesData] = useState(null);

  useEffect(() => {
    const fetchThemes = async () => {
      const loadedThemes = await loadThemes();
      setThemesData(loadedThemes);
      setLocalThemesData(loadedThemes);
      console.log('loaded has changed:', loadedThemes);
    };

    fetchThemes();
  }, []);

  useEffect(() => {
    if (themesData) {
      console.log('themesData has changed:', themesData);
    }
  }, [themesData]);

  const handleThemesDataUpdate = (newThemesData) => {
    // Actualiza themesData utilizando setThemesData
    console.log('Actualiza has changed:', newThemesData);
    setThemesData(newThemesData);
  };

  if (!themesData) {
    // Renderizar estado de carga o una interfaz de respaldo mientras se carga themesData
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-8">
          <Tabs defaultActiveKey="colors" id="uncontrolled-tab-example">
            <Tab eventKey="colors" title="Colors" style={{ paddingTop: '20px' }}>
              <ColorsTab themesData={themesData} />
            </Tab>
            <Tab eventKey="fonts" title="Fonts" style={{ paddingTop: '20px' }}>
              <FontsTab
                themesData={themesData}
                setThemesData={handleThemesDataUpdate}
              />
            </Tab>
          </Tabs>
        </div>

        <div className="col-4">
          <Preview />
        </div>
      </div>
    </div>
  );
};

export default ColorsAndFontsView;
