import React, { useState, useEffect, useMemo, useLayoutEffect } from 'react';
import debounce from 'lodash/debounce';
import isEqual from 'lodash/isEqual';
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
import DataSourceProperties from './Properties/DataSourceProperties';
import LoadingComponent from './Properties/LoadingComponent';
import ErrorComponent from './Properties/ErrorComponent';

//Propiedades de funciones.
import FunctionNameProperties from './PropertiesFunction/FunctionNameProperties';
import ConditionalProperties from './PropertiesFunction/ConditionalProperties';
import LoopProperties from './PropertiesFunction/LoopProperties';
import SwitchCaseProperties from './PropertiesFunction/SwitchCaseProperties';
import CaseProperties from './PropertiesFunction/CaseProperties';

import '../../../css/Builder/Component/ComponentProperties.css';
import { addPropertyToAPI, deletePropertyFromAPI } from '../../api';

import { useBuilder } from '../BuilderContext';

const possibleStates = ["default", "iOS", "android", "web"];

const MiniHeaderWithProperties = ({ title, selectedComponent, states, propertyComponent: PropertyComponent, handleChangeState, handleAddState, handleDeleteState, handleRetry }) => (
	<MiniHeader
	key={`${title}${selectedComponent.id}`}
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
			key={`${title}${selectedComponent.id}${state.id}`}
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

function ComponentProperties() {

  const { 
    uiComponents, setUiComponents,
    uiComponentsProperties, setUiComponentsProperties,
    selectedScreen, setSelectedScreen,
    selectedComponent, setSelectedComponent,
    handleObjectChange,
    shouldUpdate, setShouldUpdate
  } = useBuilder();

  const [viewStates, setViewStates] = useState(getInitialViewStates);
	 const [isDisabled, setIsDisabled] = useState(true);

	  useEffect(() => {
	  	setIsDisabled(true);
	    const timer = setTimeout(() => {
	  		setIsDisabled(false);
	  	}, 2000);

	    return () => clearTimeout(timer);
	  }, [selectedScreen, selectedComponent]);


  function fillViewStates(selectedComponent) {
  	const component = uiComponents[selectedComponent.id]
  	if (!component) return;

  	const { props: propertyIds } = component;

  	if (!propertyIds) return;
  
	  const properties = propertyIds.reduce((acc, id) => {
	    const property = uiComponentsProperties[id];
	    if (property) acc[id] = property;
	    return acc;
	  }, {});

	  if (!properties) return;
	  let newViewStates = { ...getInitialViewStates() };

	  Object.entries(properties).forEach(([id, propertyObj]) => {
	    const { name, data, platform } = propertyObj;
	    if (newViewStates[name]) {
	      newViewStates[name].push({ data: { ...data }, id, name, platform });
	    } else {
	      console.warn(`La categoría ${name} no existe en viewStates`);
	    }
	  });
	  setViewStates(newViewStates);
	}

useEffect(() => {
    const updateuiComponentsProperties = () => {
        let updateduiComponentsProperties = { ...uiComponentsProperties };
        let updatedPropertyIds = [];
        let currentcomponentProperties = [];

        if (!selectedComponent?.id) return;

        const currentcomponentId = selectedComponent.id;
        const currentcomponent = uiComponents[currentcomponentId];

        if (!currentcomponent) return;
        
        const { props: componentProperties } = currentcomponent;
        currentcomponentProperties = componentProperties;

        Object.values(viewStates).forEach(propertiesArray => {
            propertiesArray.forEach(property => {
                const { id, name, data, platform } = property;
                if (data !== undefined) {
                    updateduiComponentsProperties[id] = { name, data, platform };
                    updatedPropertyIds.push(id);
                }
            });
        });

        currentcomponentProperties.forEach(id => {
            if (!updatedPropertyIds.includes(id)) {
                delete updateduiComponentsProperties[id];
            }
        });

        const { name, component_type, sub_type, children: childIds } = currentcomponent;
        const updatedcomponent = {
        	name: name,
        	component_type: component_type,
            sub_type: sub_type,
            props: updatedPropertyIds,
            children: childIds
        };

        setUiComponents(prevuiComponents => ({
            ...prevuiComponents,
            [currentcomponentId]: updatedcomponent
        }));

        setUiComponentsProperties(updateduiComponentsProperties);
    };

    updateuiComponentsProperties();
}, [viewStates]);


	useEffect(() => {
		if (selectedComponent !== null) {
			fillViewStates(selectedComponent);
		}
	}, [selectedComponent]);


	const handleError = (type, propertyId, action, error ) => {
		console.error(`Error en acción ${action}: error ${error}`);
		updateViewState(type, propertyId, { error: true, loading: false, action });
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

	const handleAddState = async (type) => {
	const availableStates = possibleStates.filter(
        state => !viewStates[type].some(s => s.platform === state)
    );

    if (availableStates.length > 0) {
        const newProperty = { 
            id: new Date().getTime().toString(), 
            platform: availableStates[0], 
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

	const showPropertiesBasedOnComponentType = (component) => {
    const propertyComponents = [
        {title: "Header", component: HeaderProperties},
        {title: "Footer", component: FooterProperties},
        {title: "Row", component: RowProperties},
        {title: "Column", component: ColumnProperties},
        {title: "Text", component: TextProperties},
        {title: "datasource", component: DataSourceProperties},
        {title: "Background", component: BackgroundProperties},
        {title: "Margin", component: MarginProperties},
        {title: "Corner", component: RoundedCornerProperties},
        {title: "Image", component: ImageProperties},
        {title: "Frame", component: FrameProperties},
        {title: "Alignment", component: AlignmentProperties},
        {title: "Font", component: FontProperties},
        {title: "Stroke", component: StrokeProperties},
        {title: "Function_Name", component: FunctionNameProperties},
        {title: "Function_Returns", component: FunctionNameProperties},
        {title: "Conditional", component: ConditionalProperties},
        {title: "Loop", component: LoopProperties},
        {title: "Switch", component: SwitchCaseProperties},
        {title: "Case", component: CaseProperties},
    ];

    const allowedPropertiesConfig = {
        header: ["Background", "Margin", "Corner", "Text"],
        body: ["Background", "Margin", "Corner", "Text"],
        footer: ["Background", "Margin", "Corner", "Text"],
        button: ["Frame", "Background", "Margin", "Corner", "Text", "Font", "Stroke"],
        row: ["Frame","Background", "Margin", "Corner"],
        column: ["Frame","Background", "Margin", "Corner"],
        image: ["Frame","Background", "Margin", "Corner", "Frame"],
        text: ["Frame","Text","Background", "Margin", "Corner", "Font", "Stroke"],
        inputtext: ["Frame","Text","Background", "Margin", "Corner", "Font", "Stroke"],
        onload: ["Function_Name", "Function_Returns"],
        conditional: ["Conditional"],
        loop: ["Loop"],
        switch: ["Switch"],
    	case: ["Case"],
    };

    const mainComponentType = component.sub_type;

    if (!allowedPropertiesConfig.hasOwnProperty(mainComponentType)) {
        return [];
    }

    const allowedTitles = allowedPropertiesConfig[mainComponentType];

    const allowedProperties = propertyComponents.filter(({ title }) => allowedTitles.includes(title));

    return allowedProperties.map(({ title, component }) => (
        <MiniHeaderWithProperties
            key={`${title}${component.id}`}
            title={title}
            selectedComponent={component}
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
          Close
        </button>
      </div>
      <div className="component-properties-content">
      	 {selectedComponent !== null && showPropertiesBasedOnComponentType(selectedComponent)}
      </div>
    </div>
  );
}

export default ComponentProperties;
