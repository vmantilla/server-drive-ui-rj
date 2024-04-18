import React, { useState, useEffect, useMemo, useLayoutEffect } from 'react';
import debounce from 'lodash/debounce';
import isEqual from 'lodash/isEqual';

import '../../../../css/Builder/Component/ComponentProperties.css';
import PropertyConfigurator from  './PropertyConfigurator.js';

import { useBuilder } from '../../BuilderContext';
import { addPropertyToAPI, deletePropertyFromAPI } from '../../../../services/api';

const possibleStates = ["default", "iOS", "android", "web"];


function ComponentProperties() {

  const { 
    uiComponents, setUiComponents,
    uiComponentsProperties, setUiComponentsProperties,
    selectedScreen, setSelectedScreen,
    selectedComponent, setSelectedComponent,
    handleObjectChange,
    selectedState, setSelectedState,
    shouldUpdate, setShouldUpdate
  } = useBuilder();

  const [viewStates, setViewStates] = useState(getInitialViewStates);
  const [currentcomponent, setCurrentcomponent] = useState(null);
  
	 const [isDisabled, setIsDisabled] = useState(true);

	  useEffect(() => {
	  	setIsDisabled(true);
	    const timer = setTimeout(() => {
	  		setIsDisabled(false);
	  	}, 2000);

	    return () => clearTimeout(timer);
	  }, [selectedScreen, selectedComponent]);


 function getInitialViewStates() {
	return {
		alignment: [],
		frame: [],
		font: [],
		datasource: [],
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
		function_name: [],
		function_returns: [],
		conditional: [],
		loop: [],
		switch: [],
	    case: []
	};
}

  function fillViewStates(selectedComponent) {

  	const component = uiComponents[selectedComponent.id]
  	if (!component) return;
	console.log("component", component)
  	
  	const { props: propertyIds } = component;

  	if (!propertyIds) return;
  
	  const properties = propertyIds.reduce((acc, id) => {
	    const property = uiComponentsProperties[id];
	    if (property && property.state === selectedState) acc[id] = property;
	    return acc;
	  }, {});

	  if (!properties) return;
	  let newViewStates = { ...getInitialViewStates() };

	  Object.entries(properties).forEach(([id, propertyObj]) => {
	    const { name, data, platform, state } = propertyObj;
	    if (newViewStates[name]) {
	      newViewStates[name].push({ data: { ...data }, id, name, platform, state });
	    } else {
	      console.warn(`La categoría ${name} no existe en viewStates`);
	    }
	  });
	  setViewStates(newViewStates);
	}

useEffect(() => {
    updateuiComponentsProperties();
}, [viewStates]);

	const updateuiComponentsProperties = () => {
  // Inicializa la variable con las propiedades actuales para no mutar el estado directamente
  let updatedPropertyIds = [];
  let updateduiComponentsProperties = { ...uiComponentsProperties };

  console.log("selectedComponent", selectedComponent);

  if (!currentcomponent) return;
  console.log("currentcomponent", currentcomponent);

  // Recorre todos los viewStates y actualiza las propiedades basado en el id
  Object.values(viewStates).forEach((propertiesArray) => {
    propertiesArray.forEach((property) => {
      const { id, name, data, platform, state } = property;
      // Comprueba si existe data y si ya existe una propiedad con el mismo id para actualizar
      if (data !== undefined) {
        if (updateduiComponentsProperties[id]) {
          updateduiComponentsProperties = {
            ...updateduiComponentsProperties,
            [id]: {
              ...updateduiComponentsProperties[id],
              name,
              data,
              platform,
              state,
            },
          };
        } else {
          updateduiComponentsProperties = {
            ...updateduiComponentsProperties,
            [id]: {
              id,
              name,
              data,
              platform,
              state,
            },
          };
        }
        updatedPropertyIds.push(id);
      }
    });
  });

  const { name, component_type, sub_type, children: childIds } = currentcomponent;
  const updatedcomponent = {
    id: selectedComponent?.id,
    name: name,
    component_type: component_type,
    sub_type: sub_type,
    props: updatedPropertyIds,
    children: childIds,
  };

  console.log("propertiesArray", updatedPropertyIds);

  // Actualiza los estados con las nuevas propiedades
  setUiComponentsProperties(updateduiComponentsProperties);

  setUiComponents((prevuiComponents) => ({
    ...prevuiComponents,
    [currentcomponent.id]: updatedcomponent,
  }));

  setCurrentcomponent(updatedcomponent);
};


	useEffect(() => {
		if (selectedComponent !== null && selectedState !== null) {
			setCurrentcomponent(uiComponents[selectedComponent?.id]);
			fillViewStates(selectedComponent);
		}
	}, [selectedComponent, selectedState]);


	const handleError = (type, propertyId, action, error ) => {
		console.error(`Error en acción ${action}: error ${error}`);
		updateViewState(type, propertyId, { error: true, loading: false, action });
	};

	const manageProperty = async (action, apiCall, componentId, property, type, onSuccess) => {
	try {
		const result = await apiCall(componentId, property);
		console.log(action,result)
		onSuccess(type, property.id, { ...result, error: false, loading: false });
	} catch (error) {
		handleError(type, property.id, action, error);
	}
};

const createPropertyToAPI = (componentId, property, type) => {
	manageProperty('create', addPropertyToAPI, componentId, property, type, updateViewState);
};

const deletePropertyFromAPIWrapper = (componentId, property, type) => {
	manageProperty('delete', deletePropertyFromAPI, componentId, property, type, deleteProperty);
};

	const handleStateUpdates = (updateCallback) => {
		setViewStates(prevState => {
			const newViewState = updateCallback(prevState);
			return newViewState;
		});
	};

	const deleteProperty = (type, propertyId) => {
		handleStateUpdates(prevState => {
			const updatedStates = prevState[type].filter(state => state.id !== propertyId);
			return { ...prevState, [type]: updatedStates };
		});

		updateuiComponentsProperties()

	    setUiComponentsProperties(prevUiComponentsProperties => {
			const updatedProperties = { ...prevUiComponentsProperties };
			delete updatedProperties[propertyId];
			return updatedProperties;
		});
	};

	const convertViewStatesToPropertiesArray = (viewStates) => {
		return Object.values(viewStates).flat();
	};

	const actionHandlers = {
		delete: (componentId, property, type) => deletePropertyFromAPIWrapper(componentId, property, type),
		create: (componentId, property, type) => createPropertyToAPI(componentId, property, type)
	};

	const handleRetry = (type, index) => {
		const retriedProperty = { ...viewStates[type][index], loading: true, error: false };
		updateViewState(type, retriedProperty.id, retriedProperty);

		const handler = actionHandlers[retriedProperty.action];
		if (handler) handler();
		else console.error(`Acción no reconocida: ${retriedProperty.action}`);
	};

	

	const handleAddState = async (type) => {
	const availableStates = possibleStates.filter(
        state => !viewStates[type].some(s => s.platform === state)
    );

    if (availableStates.length > 0) {
        const newProperty = { 
            id: new Date().getTime().toString(), 
            platform: availableStates[0], 
            preview_state_id: selectedState, 
            name: type.toLowerCase(), 
            error: false, loading: true, action: "create"
        };

        setViewStates(prev => ({ 
            ...prev, 
            [type]: [...prev[type], newProperty] 
        }));
        createPropertyToAPI(selectedComponent.id, newProperty, type);
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

		deletePropertyFromAPIWrapper(selectedComponent.id, property, type);
	};

	const updateViewState = (type, propertyId, updatedProperty) => {

		setViewStates(prevState => {
			const updatedStates = prevState[type].map(state => {
				return state.id === propertyId ? { ...state, ...updatedProperty } : state;
			});
			const newState = { ...prevState, [type]: updatedStates };
			return newState;
		});
	}

	const handleChangeState = (type, index, property, value) => {
		console.log('updates needed.');
		if (!Array.isArray(viewStates[type])) {
			console.error(`viewStates[${type}] is not an array:`, viewStates[type]);
			return;
		}

		const currentState = viewStates[type][index];
		if (!currentState) {
			console.error(`No currentState found at index ${index} for type ${type}`);
			return;
		}

		let updatedState;
		if (property === 'platform') {
			updatedState = { ...currentState, platform: value, error: false, loading: false, action: "update" };
		} else {
			updatedState = { ...currentState, data: { ...currentState.data, [property]: value }, error: false, loading: false, action: "update" };
		}

		if (
		    currentState.id === updatedState.id &&
		    currentState.name === updatedState.name &&
		    currentState.state === updatedState.state &&
		    currentState.platform === updatedState.platform &&
		    isEqual(currentState.data, updatedState.data)
		) {
		    return;
		}

    if (updatedState) {
			updateViewState(type, currentState.id, updatedState)
			handleObjectChange("properties", currentState.id);
		} else {
			console.log('No updates needed.');
		}
	};


  return (
  <div className="component-properties">
    <div className="component-properties-header">
      <h2 className="component-properties-title">Propiedades</h2>
      <button className="component-properties-close" onClick={() => setSelectedComponent(null)}>
        Close
      </button>
    </div>
    <div className="component-properties-content">
      {selectedComponent !== null && (
        <PropertyConfigurator
          possibleStates = {possibleStates}
          selectedComponent={selectedComponent}
          viewStates={viewStates}
          handleChangeState={handleChangeState}
          handleAddState={handleAddState}
          handleDeleteState={handleDeleteState}
          handleRetry={handleRetry}
        />
      )}
    </div>
  </div>
);
}

export default ComponentProperties;
