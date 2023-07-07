// Archivo: Preview.js

import React, { useState, useEffect } from 'react';
import { App, View } from 'framework7-react';
import '../css/Simulator.css'
import { fetchJsonFile } from '../helpers/utils';
import { createSDComponent } from '../helpers/createSDComponent';
import { renderComponentTree } from '../helpers/renderComponentTree';

const Preview = () => {
  const [sdComponents, setSdComponents] = useState([]);

  useEffect(() => {
    fetchJsonFile('./file.json').then(data => {
      const components = data.map((componentData) => {
        return createSDComponent(componentData);
      });
      setSdComponents(components);
    });
  }, []);

  return (
    <App>
      <View main>
        <div className="simulator">
           {sdComponents ? sdComponents.map(renderComponentTree) : 'Cargando...'}
        </div>
      </View>
    </App>
  );
};

export default Preview;
