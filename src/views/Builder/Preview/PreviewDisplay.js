import React, { useEffect, useState } from 'react';
import { RavitBuilder } from 'ravit-builder-library';
import { useBuilder } from '../BuilderContext';
import { useParams } from 'react-router-dom';

function PreviewDisplay() {

  const { previewId } = useParams();
  
  // Define los estados locales
  const [uiScreens, setUiScreens] = useState(null);
  const [uiComponents, setUiComponents] = useState(null);
  const [uiComponentsProperties, setUiComponentsProperties] = useState(null);
  const [uiStates, setUiStates] = useState(null);
  const [selectedScreen, setSelectedScreen] = useState(null);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false); // Nuevo estado para controlar la carga de datos

  useEffect(() => {
    
    const storedData = localStorage.getItem('previewData');
      
    if (storedData) {
      const { uiScreens, uiComponents, uiComponentsProperties, uiStates } = JSON.parse(storedData);
      
      setUiScreens(uiScreens);
      setUiComponents(uiComponents);
      setUiComponentsProperties(uiComponentsProperties);
      setUiStates(uiStates);
      
      console.log("storedData", storedData);
  
      localStorage.removeItem('previewData');
      setDataLoaded(true); 
    }
  }, []);
  
  return (
    <div>
      {dataLoaded ? (
      <RavitBuilder 
        previewId={previewId}
        uiScreens={uiScreens} 
        uiStates={uiStates}
        uiComponents={uiComponents}
        uiComponentsProperties={uiComponentsProperties} 
        selectedScreen={selectedScreen} 
        setSelectedScreen={setSelectedScreen}
        />
      ) : (
        <p>Cargando datos...</p>
      )}
    </div>
  );
}

export default PreviewDisplay;
