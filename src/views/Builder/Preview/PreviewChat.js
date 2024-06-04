import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { RavitBuilder } from 'ravit-builder-library';

function PreviewChat({ jsonData }) {
  
  const [uiScreens, setUiScreens] = useState(null);
  const [uiComponents, setUiComponents] = useState(null);
  const [uiComponentsProperties, setUiComponentsProperties] = useState(null);
  const [uiStates, setUiStates] = useState(null);
  const [selectedScreen, setSelectedScreen] = useState(null);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [previewId, setPreviewId] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {

    const json = '{"screens":{"1":{"title":"Settings Screen","components":["2","3","4"],"states":["5"],"x":0,"y":0}},"components":{"2":{"name":"Header","component_type":"widget","sub_type":"header","props":["6"],"children":[]},"3":{"name":"Body","component_type":"widget","sub_type":"body","props":["7"],"children":["8","9","10"]},"4":{"name":"Footer","component_type":"widget","sub_type":"footer","props":["11"],"children":[]},"8":{"name":"Toggle Dark Mode","component_type":"widget","sub_type":"button","props":["12"],"children":[]},"9":{"name":"Change Language","component_type":"widget","sub_type":"button","props":["13"],"children":[]},"10":{"name":"Logout Button","component_type":"widget","sub_type":"button","props":["14"],"children":[]}},"states":{"5":{"name":"Normal"}},"props":{"6":{"name":"frame","data":{"width":{"option":"full"},"height":{"value":"60","option":"fixed"}},"platform":"default","state":"5"},"7":{"name":"frame","data":{"width":{"option":"full"},"height":{"option":"auto"}},"platform":"default","state":"5"},"11":{"name":"frame","data":{"width":{"option":"full"},"height":{"value":"40","option":"fixed"}},"platform":"default","state":"5"},"12":{"name":"background","data":{"color":"#DDDDDD","opacity":"1"},"platform":"default","state":"5"},"13":{"name":"background","data":{"color":"#EEEEEE","opacity":"1"},"platform":"default","state":"5"},"14":{"name":"background","data":{"color":"#FFCCCC","opacity":"1"},"platform":"default","state":"5"}}}'
    // Assuming jsonData is a JSON string that needs to be parsed
    try {
      const parsedData = jsonData.content;
      if (parsedData) {
      	console.warn('PreviewChat:', parsedData);
        setUiScreens(parsedData.screens);
        setUiComponents(parsedData.components);
        setUiComponentsProperties(parsedData.props);
        setUiStates(parsedData.states);
        setSelectedScreen(parsedData.selectedScreen);
        setSelectedComponent(parsedData.selectedComponent);
         // Determine the previewId based on the first screen available
        const firstScreenId = Object.keys(parsedData.screens)[0];
        setPreviewId(firstScreenId);
        setDataLoaded(true);
      }
    } catch (error) {
      console.error('Failed to parse JSON data:', error);
      setDataLoaded(false); // Ensure that the loading state is accurately represented
    }
  }, [jsonData]);

   useEffect(() => {
    console.warn('jsonData:', jsonData);
  }, [jsonData]);

  return (
    <div className="screen-content mobile-portrait">
      {dataLoaded ? (
        <RavitBuilder 
          previewId={previewId}
          uiScreens={uiScreens}
          uiComponents={uiComponents}
          uiComponentsProperties={uiComponentsProperties}
          uiStates={uiStates}
          selectedScreen={selectedScreen}
          setSelectedScreen={setSelectedScreen}
          selectedComponent={selectedComponent}
          setSelectedComponent={setSelectedComponent}
        />
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
}

export default PreviewChat;
