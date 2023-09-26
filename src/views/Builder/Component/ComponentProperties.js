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

function getInitialViewStates() {
  return {
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
}

function fillViewStates(component) {
  const newStates = getInitialViewStates();

  if (component && component.properties) {
    component.properties.forEach(property => {
      if (newStates.hasOwnProperty(property.name)) {
        newStates[property.name].push(property);
      }
    });
  }

  return newStates;
}


function ComponentProperties({ previewId, selectedComponentId, setSelectedComponent, setPropertyWasUpdated }) {

	let componentManager = new ComponentManager(previewId);

  const [component, setComponent] = useState(null);
  const [updateComponentInTree, setUpdateComponentInTree] = useState(null);

  const [viewStates, setViewStates] = useState(getInitialViewStates);

  useEffect(() => {
    const componentFound = componentManager.findComponentByIdRecursive(selectedComponentId, componentManager.components);
    setComponent(componentFound);
  }, [selectedComponentId]);

  useLayoutEffect(() => {
    setViewStates(fillViewStates(component));
  }, [component]);

const handleError = (type, propertyId, action) => {
  console.error(`Error en acción ${action}:`);
  updateViewState(type, propertyId, { error: true, loading: false, action });
};

const updateViewState = (type, propertyId, updatedProperty) => {
  setViewStates(prevState => {
    const updatedStates = prevState[type].map(state =>
      state.id === propertyId ? updatedProperty : state
    );
    return { ...prevState, [type]: updatedStates };
  });
}

const handleStateUpdates = (updateCallback) => {
  setViewStates(prevState => {
    const newViewState = updateCallback(prevState);
    componentDidUpdate(newViewState);
    return newViewState;
  });
};

const deleteProperty = (type, propertyId) => {
  handleStateUpdates(prevState => {
    const updatedStates = prevState[type].filter(state => state.id !== propertyId);
    return { ...prevState, [type]: updatedStates };
  });
};

const convertViewStatesToPropertiesArray = (viewStates) => {
  return Object.values(viewStates).flat();
};

const componentDidUpdate = (newViewState) => {
  if (component) {
    component.properties = convertViewStatesToPropertiesArray(newViewState);
    componentManager.components = componentManager.updateComponentInTree(component);
    console.log("componentDidUpdate", convertViewStatesToPropertiesArray(newViewState));
  }
};

const actionHandlers = {
  delete: (componentId, property, type) => deletePropertyFromAPIWrapper(componentId, property, type),
  create: (componentId, property, type) => createPropertyToAPI(componentId, property, type),
  update: (componentId, property, type) => updateProperty(componentId, property, type),
};

const handleRetry = (type, index) => {
  const retriedProperty = { ...viewStates[type][index], loading: true, error: false };
  updateViewState(type, retriedProperty.id, retriedProperty);
 
  const handler = actionHandlers[retriedProperty.action];
  if (handler) handler();
  else console.error(`Acción no reconocida: ${retriedProperty.action}`);
};

const manageProperty = async (action, apiCall, componentId, property, type, onSuccess) => {
  try {
    const result = await apiCall(componentId, property);
    onSuccess(type, property.id, { ...result, error: false, loading: false });
    componentDidUpdate(viewStates);
  } catch (error) {
    handleError(type, property.id, action);
  }
};

const createPropertyToAPI = (componentId, property, type) => {
  manageProperty('create', addPropertyToAPI, componentId, property, type, updateViewState);
};

const updateProperty = (componentId, property, type) => {
  manageProperty('update', editPropertyInAPI, componentId, property, type);
};

const deletePropertyFromAPIWrapper = (componentId, property, type) => {
  manageProperty('delete', deletePropertyFromAPI, componentId, property, type, deleteProperty);
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

    setViewStates(prev => ({ ...prev, [type]: [...prev[type], newProperty] }));
    createPropertyToAPI(selectedComponentId, newProperty, type);
  }
};

const handleDeleteState = async (type, index) => {
  if (!Array.isArray(viewStates[type])) {
    console.error(`viewStates[${type}] is not an array:`, viewStates[type]);
    return; 
  }
  
  const property = viewStates[type][index];
  if(!property) return; 

  updateViewState(type, property.id, { ...property, error: false, loading: false, action: "delete" });
  
  deletePropertyFromAPIWrapper(selectedComponentId, property, type);
};


/// OLD METHODS

const handleChangeState = debounce((type, index, property, value) => {
  setViewStates((prevState) => {
    if (!Array.isArray(prevState[type])) {
      console.error(`prevState[${type}] is not an array:`, prevState[type]);
      return prevState;
    }

    const currentState = prevState[type][index];

    if (currentState === null) {
      console.log('currentState, no se pudo determinar.');
      return prevState;
    }
    
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
      //componentDidUpdate(newViewState);
      updateProperty(selectedComponentId, updatedState, type, index);
      return newViewState;
    }

    // Si la propiedad no es 'platform', procede como normalmente
    const currentDataValue = currentState?.data?.[property];
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
    //componentDidUpdate(newViewState);
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
		const isNotAllowedForButton = (title) => ['Header', 'Footer','Alignment','Image', 'Font', "Text", "Row", "Column"].includes(title);
		const isNotAllowedForText = (title) => ['Header', 'Footer','Alignment','Row', 'Column', 'Image', "Row", "Column"].includes(title);
		const isNotAllowedForImage = (title) => ['Header', 'Footer','Alignment','Row', 'Column', 'Font', "Text", "Row", "Column"].includes(title);
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
