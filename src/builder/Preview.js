import React, { useState, useEffect } from 'react';
import { App, View } from 'framework7-react';
import '../css/Simulator.css'
import SDComponentType from '../enums/SDComponentType';
import SDComponent from '../components/SDComponent/SDComponent';
import SDProperties from '../components/SDProperties/SDProperties';

const BuilderPreview = () => {
  const [sdComponents, setSdComponents] = useState([]);

  useEffect(() => {
    fetchJsonFile().then(data => {
      const components = data.map((componentData) => {
        return createSDComponent(componentData);
      });
      setSdComponents(components);
    });
  }, []);

	// Función para renderizar los componentes de forma recursiva
	const renderComponentTree = (component) => {
	  return (
	    <div key={component.id}>
	      {component.type}
	      {component.childrens && component.childrens.length > 0 && component.childrens.map(renderComponentTree)}
	    </div>
	  );
	};

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

function fetchJsonFile() {
  return fetch('./file.json')
    .then(response => {
      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }
      return response.json();
    });
}

function createSDComponent(componentData) {
  // Creamos las propiedades del componente
  const properties = new SDProperties(
	  componentData.properties.frame,
	  componentData.properties.backgroundColor,
	  componentData.properties.cornerRadius,
	  componentData.properties.border,
	  componentData.properties.padding,
	  componentData.properties.isEnabled,
	  componentData.properties.contentInset,
	  componentData.properties.text,
	  componentData.properties.font,
	  componentData.properties.textAlignment,
	  componentData.properties.action,
	  componentData.properties.source,
	  componentData.properties.contentMode,
	  componentData.properties.resizable,
	  componentData.properties.aspectRatio,
	  componentData.properties.spacing,
	  componentData.properties.verticalAlignment,
	  componentData.properties.horizontalAlignment,
	  componentData.properties.overlayAlignment,
	  componentData.properties.axis,
	  componentData.properties.showsIndicators,
	  componentData.properties.placeholder,
	  componentData.properties.secure,
	  componentData.properties.keyboardType,
	  componentData.properties.autocapitalization,
	  componentData.properties.autocorrection,
	  componentData.properties.returnKeyType,
	  componentData.properties.enablesReturnKeyAutomatically,
	  componentData.properties.onEditingChanged,
	  componentData.properties.onCommit
	);


  // Si el componente tiene hijos, los creamos también
  const children = componentData.childrens?.map(createSDComponent);

  // Finalmente, creamos y devolvemos el componente SD
  return new SDComponent(
    componentData.id,
    componentData.type,
    properties,
    children,
    componentData.states
  );
}

export default BuilderPreview;
