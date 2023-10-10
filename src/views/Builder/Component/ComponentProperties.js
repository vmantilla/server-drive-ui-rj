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
		footer: []
	};
}

function ComponentProperties() {

  const { 
    uiWidgets, setUiWidgets,
    uiWidgetsProperties, setUiWidgetsProperties,
    selectedScreen, setSelectedScreen,
    selectedComponent, setSelectedComponent,
    findWidgetPropertiesById,
    handleObjectChange,
    shouldUpdate, setShouldUpdate,
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


  function fillViewStates(widgetId) {
	  const properties = findWidgetPropertiesById(widgetId);

	  if (!properties) return;

	  let newViewStates = { ...getInitialViewStates() };

	  Object.entries(properties).forEach(([id, propertyObj]) => {
	    const { name, data, plat: platform } = propertyObj;
	    if (newViewStates[name]) {
	      newViewStates[name].push({ data: { ...data }, id, name, platform });
	    } else {
	      console.warn(`La categoría ${name} no existe en viewStates`);
	    }
	  });

	  setViewStates(newViewStates);
	}

useEffect(() => {
    const updateUiWidgetsProperties = () => {
        let updatedUiWidgetsProperties = { ...uiWidgetsProperties };
        let updatedPropertyIds = [];
        let currentWidgetProperties = [];

        if (!selectedComponent?.id) return;

        const currentWidgetId = selectedComponent.id;
        const currentWidget = uiWidgets[currentWidgetId];
        const { props: widgetProperties } = currentWidget;
        currentWidgetProperties = widgetProperties;

        Object.values(viewStates).forEach(propertiesArray => {
            propertiesArray.forEach(property => {
                const { id, name, data, plat: platform } = property;
                if (data !== undefined) {
                    updatedUiWidgetsProperties[id] = { name, data, plat: platform };
                    updatedPropertyIds.push(id);
                }
            });
        });

        currentWidgetProperties.forEach(id => {
            if (!updatedPropertyIds.includes(id)) {
                delete updatedUiWidgetsProperties[id];
            }
        });

        const { type: component_type, children: childIds, actions } = currentWidget;
        const updatedWidget = {
            type: component_type,
            props: updatedPropertyIds,
            children: childIds,
            actions: actions
        };

        setUiWidgets(prevUiWidgets => ({
            ...prevUiWidgets,
            [currentWidgetId]: updatedWidget
        }));

        setUiWidgetsProperties(updatedUiWidgetsProperties);
    };

    updateUiWidgetsProperties();
}, [viewStates]);


	useEffect(() => {
		if (selectedComponent !== null) {
			fillViewStates(selectedComponent.id);
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
        state => !viewStates[type].some(s => s.plat === state)
    );

    if (availableStates.length > 0) {
        const newProperty = { 
            id: new Date().getTime().toString(), 
            plat: availableStates[0], 
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
		    console.log('Los campos especificados son idénticos en ambos estados. Retornando sin hacer nada.');
		    return;
		}

    if (updatedState) {
			updateViewState(type, currentState.id, updatedState)
			handleObjectChange("uiWidgetsProperties", currentState.id);
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

		return allowedProperties.map(({ title, component }) => {
    return (
        <MiniHeaderWithProperties
            key={`${title}${selectedComponent.id}`}
            title={title}
            selectedComponent={selectedComponent}
            states={viewStates[title.toLowerCase()]}
            propertyComponent={component}
            handleChangeState={handleChangeState}
            handleAddState={handleAddState}
            handleDeleteState={handleDeleteState}
            handleRetry={handleRetry}
        />
    );
});

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
      	 {selectedComponent !== null && showPropertiesBasedOnComponentType(selectedComponent)}
      </div>
    </div>
  );
}

export default ComponentProperties;
