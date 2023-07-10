// Archivo: PreviewWithScreenshot.js
import React, { useEffect, useRef, useState } from 'react';  // Agregamos useState aquí
import { App, View } from 'framework7-react';
import '../../css/Simulator.css';
import { createSDComponent } from '../../helpers/createSDComponent';
import { renderComponentTree } from '../../helpers/renderComponentTree';
import { toPng } from 'html-to-image';

const PreviewWithScreenshot = ({ themesData, viewData, onScreenshotReady }) => {
  const [sdComponents, setSdComponents] = useState([]);
  const previewRef = useRef();

  useEffect(() => {
    const components = viewData.map((componentData) => {
      return createSDComponent(componentData, themesData);
    });
    setSdComponents(components);
  }, [viewData, themesData]);

  useEffect(() => {
    toPng(previewRef.current)
      .then(dataUrl => onScreenshotReady(dataUrl))
      .catch(err => console.error(err));
  }, [onScreenshotReady]);

  return (
    <App>
      <View main>
        <div className="simulator" ref={previewRef}>
          {sdComponents ? sdComponents.map(renderComponentTree) : 'Cargando...'}
        </div>
      </View>
    </App>
  );
};

export default PreviewWithScreenshot;
