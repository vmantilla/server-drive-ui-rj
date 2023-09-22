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
          key={state.state}
          property={state}
          handlePropertyChange={(property, value) => handleChangeState(title.toLowerCase(), index, property, value)}
        />
      )
    )}
  />
);

function ComponentProperties({ selectedComponent, setSelectedComponent }) {

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

	useLayoutEffect(() => {
  if (selectedComponent) {
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

    selectedComponent.properties.forEach(property => {
      if (newStates.hasOwnProperty(property.name)) {
        newStates[property.name].push(property);
      }
    });

    setViewStates(newStates);
  }
}, [selectedComponent]);


const sendPropertyToAPI = async (componentId, property, type) => {
  try {
    const addedProperty = await addPropertyToAPI(componentId, property);
    
    setViewStates(prevState => {
      const updatedStates = prevState[type].map(state =>
        state.id === property.id
          ? {...addedProperty, error: false, loading: false }
          : state
      );

      const newViewState = {...prevState, [type]: updatedStates};
      
      // Actualiza selectedComponent aquí, usando el nuevo viewState
      const updatedComponent = {...selectedComponent, properties: convertViewStatesToPropertiesArray(newViewState)};
      setSelectedComponent(updatedComponent);

      return newViewState;
    });
    
  } catch (error) {
    console.error('Error al agregar nueva propiedad:', error);
    setViewStates(prevState => {
      const updatedStates = prevState[type].map(state =>
        state.id === property.id
          ? {...state, loading: false, error: true, action: "create" }
          : state
      );
      return {...prevState, [type]: updatedStates};
    });
  }
};

const deletePropertyFromAPIWrapper = async (componentId, property, type) => {
  try {
    await deletePropertyFromAPI(property.id);
    setViewStates(prevState => {
      const updatedStates = prevState[type].filter(state => state.id !== property.id);

      const newViewState = {...prevState, [type]: updatedStates};

      const updatedComponent = {...selectedComponent, properties: convertViewStatesToPropertiesArray(newViewState)};
      setSelectedComponent(updatedComponent);

      return newViewState;
    });
  } catch (error) {
    console.error('Error al eliminar la propiedad:', error);
    setViewStates(prevState => {
      const updatedStates = prevState[type].map(state =>
        state.id === property.id
          ? {...state, error: true, action: "delete" } 
          : state
      );
      return {...prevState, [type]: updatedStates};
    });
  }
};

const convertViewStatesToPropertiesArray = (viewStates2) => {
    const propertiesArray = [];

    Object.keys(viewStates2).forEach(key => {
        viewStates[key].forEach(property => {
            propertiesArray.push(property);
        });
    });

    return propertiesArray;
}


const handleDeleteState = (type, index) => {
  const propertyToDelete = viewStates[type][index];
  deletePropertyFromAPIWrapper(selectedComponent.id, propertyToDelete, type);
};

const handleRetry = (type, index) => {
  const retriedProperty = { ...viewStates[type][index], loading: true, error: false };
  const updatedStates = [...viewStates[type]];
  updatedStates[index] = retriedProperty;
  setViewStates({ ...viewStates, [type]: updatedStates });
  sendPropertyToAPI(selectedComponent.id, retriedProperty, type);
};

	const handleChangeState = (type, index, property, value) => {
		return
	};


	const handleAddState = async (type) => {
	
		const availableStates = possibleStates.filter(
			state => !viewStates[type].some(s => s.platform === state)
			);

		if (availableStates.length > 0) {
			const newProperty = { id: new Date().getTime(), platform: availableStates[0], name: type.toLowerCase(),error: false, loading: true };
			const newStates = {
				...viewStates,
				[type]: [...viewStates[type], newProperty],
			};
			setViewStates(newStates);

			sendPropertyToAPI(selectedComponent.id, newProperty, type);
		}
	};



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
      	 {selectedComponent !== null && showPropertiesBasedOnComponentType(selectedComponent)}
      </div>
    </div>
  );
}

export default ComponentProperties;
