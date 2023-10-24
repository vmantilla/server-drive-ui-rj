import React, { useEffect, useState } from 'react';
import { RavitBuilder } from 'ravit-builder';
import { useBuilder } from '../BuilderContext';
import { useParams } from 'react-router-dom';

function PreviewDisplay() {

  const { previewId } = useParams();
  
  // Define los estados locales
  const [uiScreens, setUiScreens] = useState(null);
  const [uiComponents, setUiComponents] = useState(null);
  const [uiComponentsProperties, setUiComponentsProperties] = useState(null);
  const [selectedScreen, setSelectedScreen] = useState(null);
  const [selectedComponent, setSelectedComponent] = useState(null);

  useEffect(() => {
    const storedData = localStorage.getItem('previewData');
    if (storedData) {
      const { uiScreens, uiComponents, uiComponentsProperties } = JSON.parse(storedData);
      
      setUiScreens(uiScreens);
      setUiComponents(uiComponents);
      setUiComponentsProperties(uiComponentsProperties);

      localStorage.removeItem('previewData');
    }
  }, []);
  
  return (
    <div>
      <RavitBuilder 
        previewId={previewId}
        uiScreens={uiScreens} 
        uiComponents={uiComponents}
        uiComponentsProperties={uiComponentsProperties} 
        selectedScreen={selectedScreen} 
        setSelectedScreen={setSelectedScreen}/>
    </div>
  );
}

export default PreviewDisplay;
