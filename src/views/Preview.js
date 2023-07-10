// Archivo: Preview.js

import React, { useState, useEffect } from 'react';
import { App, View } from 'framework7-react';
import '../css/Simulator.css'
import { createSDComponent } from '../helpers/createSDComponent';
import { renderComponentTree } from '../helpers/renderComponentTree';

const Preview = ({ themesData, viewData }) => {  // Recibimos themesData y viewData como props
  const [sdComponents, setSdComponents] = useState([]);

  useEffect(() => {
    const components = viewData.map((componentData) => {  
      return createSDComponent(componentData, themesData);  // Pasamos themesData a createSDComponent
    });
    setSdComponents(components);
  }, [viewData, themesData]);  // Agregamos themesData a las dependencias del useEffect

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
