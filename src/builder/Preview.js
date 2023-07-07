import React, { useState, useEffect } from 'react';
import { App, View } from 'framework7-react';
import '../css/Simulator.css'
import SDComponentType from '../enums/SDComponentType';
import SDComponent from '../components/SDComponent/SDComponent';
import SDProperties from '../components/SDProperties/SDProperties';
import SDFont from '../components/SDProperties/SDFont';

import SDVStackView from '../components/SDComponents/SDVStackView';
import SDHStackView from '../components/SDComponents/SDHStackView';
import SDZStackView from '../components/SDComponents/SDZStackView';
import SDTextView from '../components/SDComponents/SDTextView';
import SDImageView from '../components/SDComponents/SDImageView';
import SDButtonView from '../components/SDComponents/SDButtonView';
import SDScrollView from '../components/SDComponents/SDScrollView';



import { fetchJsonFile } from '../utils/utils';

const BuilderPreview = () => {
  const [sdComponents, setSdComponents] = useState([]);

  useEffect(() => {
    fetchJsonFile('./file.json').then(data => {
    	const components = data.map((componentData) => {
        return createSDComponent(componentData);
      });
      setSdComponents(components);
    });
  }, []);

	// Función para renderizar los componentes de forma recursiva
	const renderComponentTree = (component) => {
  let Component;

  switch (component.type) {
    case "VStack":
      Component = SDVStackView
      break;
    case "HStack":
      Component = SDHStackView;
      break;
    case "ZStack":
      Component = SDZStackView;
      break;
    case "Text":
      Component = SDTextView; // Use a paragraph for Text components
      break;
    case "Button":
      Component = SDButtonView; // Use a button element for Button components
      break;
    case "Image":
      Component = SDImageView; // Use an img element for Image components
      break;
    case "TextField":
      Component = 'div'; // Use an input element for TextField components
      break;
    case "ScrollView":
      Component = SDScrollView; // Use a div for ScrollView components
      break;
    default:
     console.log(' Default to a div:', component.type); // Agrega un registro para indicar el componente actual

  
      Component = 'div'; // Default to a div
  }

  return (
    <Component key={component.id} component={component}>
      {component.childrens && component.childrens.length > 0 && component.childrens.map(renderComponentTree)}
    </Component>
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

function createSDComponent(componentData) {

const sdFont = componentData.properties.font
  ? new SDFont(componentData.properties.font.font, componentData.properties.font.color)
  : null;

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
	  sdFont,
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
