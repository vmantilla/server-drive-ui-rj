import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import debounce from 'lodash/debounce';
import MiniHeader from './MiniHeader';
import HeaderProperties from './Properties/HeaderProperties';
import FooterProperties from './Properties/FooterProperties';
import FontProperties from './Properties/FontProperties';
import StrokeProperties from './Properties/StrokeProperties';
import FrameProperties from './Properties/FrameProperties';
import AlignmentProperties from './Properties/AlignmentProperties';
import ImageProperties from './Properties/ImageProperties';
import RoundedCornerProperties from './Properties/RoundedCornerProperties';
import MarginProperties from './Properties/MarginProperties';
import BackgroundProperties from './Properties/BackgroundProperties';
import RowProperties from './Properties/RowProperties';
import ColumnProperties from './Properties/ColumnProperties';
import TextProperties from './Properties/TextProperties';
import LoadingComponent from './Properties/LoadingComponent';
import ErrorComponent from './Properties/ErrorComponent';

import '../../../css/Builder/Component/ComponentProperties.css';
import { addPropertyToAPI, editPropertyInAPI, deletePropertyFromAPI } from '../../api';
import ComponentManager from '../ComponentManager';

const possibleStates = ["default", "iOS", "android", "web"];

const MiniHeaderWithProperties = ({ title, states, propertyComponent: PropertyComponent, handleChangeState, handleAddState, handleDeleteState, handleRetry }) => (
  <MiniHeader
    possibleStates={possibleStates}
    title={title}
    states={states}
    onAddState={() => handleAddState(title.toLowerCase())}
    onDeleteState={(index) => handleDeleteState(title.toLowerCase(), index)}
    onChangeState={(index, property, value) => handleChangeState(title.toLowerCase(), index, property, value)}
    renderChildren={(index, state) => (
      state.loading ? (
        <LoadingComponent key={index}/>
      ) : state.error ? (
        <ErrorComponent key={index} onRetry={() => handleRetry(title.toLowerCase(), index)} />
      ) : (
        <PropertyComponent
          key={state.platform}
          property={state}
          handlePropertyChange={(property, value) => handleChangeState(title.toLowerCase(), index, property, value)}
        />
      )
    )}
  />
);

function ComponentProperties({ previewId, selectedComponentId, setSelectedComponent, setPropertyWasUpdated }) {

	let componentManager = new ComponentManager(previewId);

	const [component, setComponent] = useState(null);
	const [updateComponentInTree, setUpdateComponentInTree] = useState(null);

	const [viewStates, setViewStates] = useState({
		alignment: [],
		frame: [],
		font: [],
		stroke: [],
		image: [],
		corner: [],
		margin: [],
		background: [],
		row: [],
		column: [],
		text: [],
		header: [],
		footer: [],
	});

	useEffect(() => {

	const componentFound = componentManager.findComponentByIdRecursive(selectedComponentId, componentManager.components);
	setComponent(componentFound);

	}, [selectedComponentId]);


useLayoutEffect(() => {

	if (component) {
    const newStates = {
      alignment: [],
      frame: [],
      font: [],
      stroke: [],
      image: [],
      corner: [],
      margin: [],
      background: [],
      row: [],
      column: [],
      text: [],
      header: [],
      footer: [],
    };

    component.properties.forEach(property => {
      if (newStates.hasOwnProperty(property.name)) {
        newStates[property.name].push(property);
      }
    });

    setViewStates(newStates);
  }
}, [component]);


const sendPropertyToAPI = async (componentId, property, type) => {
  try {
    const addedProperty = await addPropertyToAPI(componentId, property);
    
    setViewStates(prevState => {
      const updatedStates = prevState[type].map(state =>
        state.id === property.id
          ? { ...addedProperty, error: false, loading: false }
          : state
      );
      const newViewState = { ...prevState, [type]: updatedStates };
      componentDidUpdate(newViewState);
      return newViewState;
    });
  } catch (error) {
    console.error('Error al agregar nueva propiedad:', error);
    setViewStates(prevState => {
      const updatedStates = prevState[type].map(state =>
        state.id === property.id
          ? { ...state, loading: false, error: true, action: "create" }
          : state
      );
      return { ...prevState, [type]: updatedStates };
    });
  }
};

const handleAddState = async (type) => {
  const availableStates = possibleStates.filter(
    state => !viewStates[type].some(s => s.platform === state)
  );

  if (availableStates.length > 0) {
    const newProperty = { 
      id: new Date().getTime(), 
      platform: availableStates[0], 
      name: type.toLowerCase(), 
      error: false, 
      loading: true, 
      action: "create" 
    };

    const newStates = {
      ...viewStates,
      [type]: [...viewStates[type], newProperty],
    };
    
    setViewStates(newStates);
    sendPropertyToAPI(selectedComponentId, newProperty, type);
  }
};

const deletePropertyFromAPIWrapper = async (componentId, property, type) => {
  try {
    console.log('Deleting property with id:', property.id); // Paso 1: Verifica el ID
    await deletePropertyFromAPI(property.id);

    setViewStates((prevState) => {
      console.log('Previous States:', prevState[type]); // Paso 2: Revisa el Estado Previo
      const updatedStates = prevState[type].filter((state) => state.id !== property.id);
      console.log('Updated States:', updatedStates); // Paso 3: Verifica el Estado Actualizado
      const newViewState = { ...prevState, [type]: updatedStates };
      componentDidUpdate(newViewState);
      return newViewState;
    });
  } catch (error) {
    setViewStates((prevState) => {
      const updatedStates = prevState[type].map((state) =>
        state.id === property.id
          ? { ...state, error: true, loading: false, action: "delete" }
          : state
      );
      return { ...prevState, [type]: updatedStates };
    });
  }
};


const updateProperty = async (componentId, property, type)  => {
  try {
  	console.log(type)
  	console.log(componentId)
  	console.log(property)
  	const updatedProperty = await editPropertyInAPI(property.id, property);
  } catch (error) {
    console.error('Error al editar propiedad:', error);
    setViewStates(prevState => {
      const updatedStates = prevState[type].map(state => {
        if(state.id === property.id) {
          return { ...state, error: true, loading: false, action: "update" };
        } else {
          return state;
        }
      });
      return { ...prevState, [type]: updatedStates };
    });
  }
};



const componentDidUpdate = (newViewState) => {
  if (component !== null) {
    // Usa la función para convertir los viewStates a un array de propiedades
    const propertiesArray = convertViewStatesToPropertiesArray(newViewState);

    // Actualiza la propiedad 'properties' del componente con el nuevo array
    component.properties = propertiesArray;

    // Actualiza el componente en el árbol del ComponentManager
    componentManager.components = componentManager.updateComponentInTree(component);
    console.log("componentDidUpdate", component)

    const newStates = {
      alignment: [],
      frame: [],
      font: [],
      stroke: [],
      image: [],
      corner: [],
      margin: [],
      background: [],
      row: [],
      column: [],
      text: [],
      header: [],
      footer: [],
    };

    component.properties.forEach(property => {
      if (newStates.hasOwnProperty(property.name)) {
        newStates[property.name].push(property);
      }
    });

    setViewStates(newStates);
    
    setPropertyWasUpdated(new Date().getTime());
  }
};


const convertViewStatesToPropertiesArray = (viewStates2) => {
    const propertiesArray = [];

    Object.keys(viewStates2).forEach(key => {
        viewStates2[key].forEach(property => {
            propertiesArray.push(property);
        });
    });

    return propertiesArray;
}


const handleDeleteState = async (type, index) => {
  setViewStates(prevState => {
    if (!Array.isArray(prevState[type])) {
      console.error(`prevState[${type}] is not an array:`, prevState[type]);
      return prevState; 
    }

    const updatedStates = prevState[type].map((state, idx) =>
      idx === index
        ? { ...state, error: false, loading: false, action: "delete" }
        : state
    );

    return { ...prevState, [type]: updatedStates };
  });

  deletePropertyFromAPIWrapper(selectedComponentId, viewStates[type][index], type);
};



const handleRetry = (type, index) => {
  const retriedProperty = { ...viewStates[type][index], loading: true, error: false };
  const updatedStates = [...viewStates[type]];
  updatedStates[index] = retriedProperty;
  setViewStates({ ...viewStates, [type]: updatedStates });
  
  // Verificar el valor de 'action' y llamar a la función correspondiente
  if (retriedProperty.action === "delete") {
    deletePropertyFromAPIWrapper(selectedComponentId, retriedProperty, type);
  } else if (retriedProperty.action === "create") {
    sendPropertyToAPI(selectedComponentId, retriedProperty, type);
  } else if (retriedProperty.action === "update") {
    updateProperty(selectedComponentId, retriedProperty, type);
  } else {
    console.error(`Acción no reconocida: ${retriedProperty.action}`);
  }
};

const handleChangeState = debounce((type, index, property, value) => {
  setViewStates((prevState) => {
    if (!Array.isArray(prevState[type])) {
      console.error(`prevState[${type}] is not an array:`, prevState[type]);
      return prevState;
    }

    const currentState = prevState[type][index];
    
    // Si la propiedad es 'platform', actualiza 'platform' en lugar de 'data'
    if (property === 'platform') {
      const updatedState = {
        ...currentState,
        platform: value, // actualiza 'platform' con el nuevo valor
        error: false,
        loading: false,
        action: "update",
      };

      const updatedStates = prevState[type].map((state, idx) =>
        idx === index ? updatedState : state
      );

      const newViewState = { ...prevState, [type]: updatedStates };
      componentDidUpdate(newViewState);
      updateProperty(selectedComponentId, updatedState, type, index);
      return newViewState;
    }

    // Si la propiedad no es 'platform', procede como normalmente
    const currentDataValue = currentState.data?.[property];
    if (currentDataValue === value) {
      console.log('Los valores son iguales, no se realiza actualización.');
      return prevState;
    }

    const updatedData = { ...currentState.data, [property]: value };
    const updatedState = {
      ...currentState,
      data: updatedData,
      error: false,
      loading: false,
      action: "update",
    };

    const updatedStates = prevState[type].map((state, idx) =>
      idx === index ? updatedState : state
    );

    const newViewState = { ...prevState, [type]: updatedStates };
    componentDidUpdate(newViewState);
    updateProperty(selectedComponentId, updatedState, type, index);

    return newViewState;
  });
}, 300);






	const triggerIfNotEqual = (selectedComponent, oldState, newState) => {
		return
		if (!deepEqual(oldState, newState)) {
			const filteredProperties = Object.entries(newState)
			.filter(([key, value]) => !(Array.isArray(value) && value.length === 0))
			.reduce((acc, [key, value]) => {
				acc[key] = value;
				return acc;
			}, {});

			if (Object.keys(filteredProperties).length > 0) {
				//triggerUpdateProperties(selectedComponent, filteredProperties);
			}

			//setViewStates(newState);
		}
	};

	const deepEqual = (obj1, obj2) => {
		if (obj1 === obj2) return true;
		if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
			return false;
		}
		const keys1 = Object.keys(obj1);
		const keys2 = Object.keys(obj2);
		if (keys1.length !== keys2.length) return false;
		for (const key of keys1) {
			if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
				return false;
			}
		}
		return true;
	};

	const showPropertiesBasedOnComponentType = (component) => {
    const propertyComponents = [
    	{title: "Header", component: HeaderProperties},
    	{title: "Footer", component: FooterProperties},
    	{title: "Row", component: RowProperties},
      {title: "Column", component: ColumnProperties},
      {title: "Text", component: TextProperties},
      {title: "Background", component: BackgroundProperties},
      {title: "Margin", component: MarginProperties},
      {title: "Corner", component: RoundedCornerProperties},
      {title: "Image", component: ImageProperties},
      {title: "Frame", component: FrameProperties},
      {title: "Alignment", component: AlignmentProperties},
      {title: "Font", component: FontProperties},
      {title: "Stroke", component: StrokeProperties},
      
    ];

    const isNotAllowedForHeaderBodyFooter = (title) => ['Frame','Alignment', 'Image', 'Font'].includes(title);
		const isNotAllowedForButton = (title) => ['Header', 'Footer','Alignment','Image', 'Font', "Text"].includes(title);
		const isNotAllowedForText = (title) => ['Header', 'Footer','Alignment','Row', 'Column', 'Image'].includes(title);
		const isNotAllowedForImage = (title) => ['Header', 'Footer','Alignment','Row', 'Column', 'Font', "Text"].includes(title);
		const isNotAllowedForRow = (title) => ['Header', 'Footer','Alignment','Image', 'Font', "Column", "Text"].includes(title);
		const isNotAllowedForColumn = (title) => ['Header', 'Footer','Alignment','Image', 'Font', "Row", "Text"].includes(title);
		const isNotAllowedForOverlay = (title) => ['Header', 'Footer','Alignment','Image', 'Font', "Row", "Column", "Text"].includes(title);

		const allowedProperties = propertyComponents.filter(({ title }) => {
		  const mainComponentType = component.component_type;
		  
		  let isAllowedForMainComponent = true;

		  switch (mainComponentType) {
		    case 'Header':
		    case 'Body':
		    case 'Footer':
		      isAllowedForMainComponent = !isNotAllowedForHeaderBodyFooter(title);
		      break;
		    case 'Button':
		      isAllowedForMainComponent = !isNotAllowedForButton(title);
		      break;
		    case 'Row':
		      isAllowedForMainComponent = !isNotAllowedForRow(title) || (mainComponentType === title);
		      break;
		    case 'Column':
		      isAllowedForMainComponent = !isNotAllowedForColumn(title);
		      break;
		    case 'Overlay':
		      isAllowedForMainComponent = !isNotAllowedForOverlay(title);
		      break;
		    case 'Image':
		      isAllowedForMainComponent = !isNotAllowedForImage(title);
		      break;
		    case 'Text':
		      isAllowedForMainComponent = !isNotAllowedForText(title);
		      break;
		    default:
		      isAllowedForMainComponent = false;
		      break;
		  }

		  return isAllowedForMainComponent;
		});

    return allowedProperties.map(({ title, component }) => (
      <MiniHeaderWithProperties
        key={title}
        title={title}
        states={viewStates[title.toLowerCase()]}
        propertyComponent={component}
        handleChangeState={handleChangeState}
        handleAddState={handleAddState}
        handleDeleteState={handleDeleteState}
        handleRetry={handleRetry}
      />
    ));
  };

  return (
    <div className="component-properties">
      <div className="component-properties-header">
        <h2 className="component-properties-title">Propiedades</h2>
        <button className="component-properties-close" onClick={() => setSelectedComponent(null)}>
          <i className="bi bi-x"></i>
        </button>
      </div>
      <div className="component-properties-content">
      	 {component !== null && showPropertiesBasedOnComponentType(component)}
      </div>
    </div>
  );
}

export default ComponentProperties;
