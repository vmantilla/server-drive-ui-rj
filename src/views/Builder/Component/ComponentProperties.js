import React, { useState, useEffect, useRef } from 'react';
import debounce from 'lodash/debounce';
import MiniHeader from './MiniHeader';
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
import '../../../css/Builder/Component/ComponentProperties.css';

const possibleStates = ["multiplataforma", "iOS", "android", "web"];

const MiniHeaderWithProperties = ({ title, states, propertyComponent: PropertyComponent, handleChangeState, handleAddState, handleDeleteState }) => (
  <MiniHeader
    possibleStates={possibleStates}
    title={title}
    states={states}
    onAddState={() => handleAddState(title.toLowerCase())}
    onDeleteState={(index) => handleDeleteState(title.toLowerCase(), index)}
    onChangeState={(index, property, value) => handleChangeState(title.toLowerCase(), index, property, value)}
    renderChildren={(index, state) => (
      <PropertyComponent
        key={state.state}
        property={state}
        handlePropertyChange={(property, value) => handleChangeState(title.toLowerCase(), index, property, value)}
      />
    )}
  />
);

function ComponentProperties({ selectedComponent, setSelectedComponent, triggerUpdateProperties }) {

	const [viewStates, setViewStates] = useState({
		component_type: "",
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
	});

	useEffect(() => {
		setViewStates({
			component_type: "",
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
		});

		const timerId = setTimeout(() => {
			if (selectedComponent?.property?.data) {
				const newStates = Object.keys(viewStates).reduce((acc, key) => {
					if (Array.isArray(viewStates[key])) {
						acc[key] = selectedComponent.property.data[key] || [];
					} else {
						acc[key] = selectedComponent.property.data[key] || "";
					}
					return acc;
				}, {});
				setViewStates(newStates);
			}
		}, 100);

		return () => {
			clearTimeout(timerId);
		};
	}, [selectedComponent]);

	const handleChangeState = (type, index, property, value) => {
	  // Copia profunda del objeto específico dentro del array
		const updatedState = JSON.parse(JSON.stringify(viewStates[type][index]));
		updatedState[property] = value;

	  // Copia superficial del array y reemplazo del objeto actualizado
		const updatedStates = [...viewStates[type]];
		updatedStates[index] = updatedState;

		const newStates = { ...viewStates, [type]: updatedStates };
		triggerIfNotEqual(selectedComponent, viewStates, newStates);
	};


	const handleAddState = (type) => {
		const availableStates = possibleStates.filter(state => !viewStates[type].some(s => s.state === state));
		if (availableStates.length > 0) {
			const newStates = { ...viewStates, [type]: [...viewStates[type], { state: availableStates[0] }] };
			triggerIfNotEqual(selectedComponent, viewStates, newStates);
			setViewStates(newStates);
		}
	};

	const handleDeleteState = (type, index) => {
		const updatedStates = [...viewStates[type]];
		updatedStates.splice(index, 1);
		const newStates = { ...viewStates, [type]: updatedStates };
		triggerIfNotEqual(selectedComponent, viewStates, newStates);
		setViewStates(newStates);
	};

	const triggerIfNotEqual = (selectedComponent, oldState, newState) => {
		if (!deepEqual(oldState, newState)) {
			const filteredProperties = Object.entries(newState)
			.filter(([key, value]) => !(Array.isArray(value) && value.length === 0))
			.reduce((acc, [key, value]) => {
				acc[key] = value;
				return acc;
			}, {});

			if (Object.keys(filteredProperties).length > 0) {
				triggerUpdateProperties(selectedComponent, filteredProperties);
			}

			setViewStates(newState);
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
    	{title: "Row", component: RowProperties},
      {title: "Column", component: ColumnProperties},
      {title: "Background", component: BackgroundProperties},
      {title: "Margin", component: MarginProperties},
      {title: "Corner", component: RoundedCornerProperties},
      {title: "Image", component: ImageProperties},
      {title: "Frame", component: FrameProperties},
      {title: "Alignment", component: AlignmentProperties},
      {title: "Font", component: FontProperties},
      {title: "Stroke", component: StrokeProperties},
      
    ];

    const isNotAllowedForHeaderBodyFooter = (title) => ['Alignment', 'Image', 'Font'].includes(title);
		const isNotAllowedForButton = (title) => ['Image', 'Font'].includes(title);
		const isNotAllowedForImage = (title) => ['Row', 'Column', 'Font'].includes(title);
		const isNotAllowedForRow = (title) => ['Image', 'Font', "Column"].includes(title);
		const isNotAllowedForColumn = (title) => ['Image', 'Font', "Row"].includes(title);

		const allowedProperties = propertyComponents.filter(({ title }) => {
		  const mainComponentType = component.component_type;
		  const propertyComponentType = component.property.data.component_type;

		  let isAllowedForMainComponent = true;
		  let isAllowedForPropertyComponent = true;

		  switch (mainComponentType) {
		    case 'Header':
		    case 'Body':
		    case 'Footer':
		      isAllowedForMainComponent = !isNotAllowedForHeaderBodyFooter(title);
		      break;
		    case 'Button':
		      isAllowedForMainComponent = !isNotAllowedForButton(title);
		      break;
		  }

		  switch (propertyComponentType) {
		    case 'Row':
		      isAllowedForPropertyComponent = !isNotAllowedForRow(title);
		      break;
		    case 'Column':
		      isAllowedForPropertyComponent = !isNotAllowedForColumn(title);
		      break;
		    case 'Image':
		      isAllowedForPropertyComponent = !isNotAllowedForImage(title);
		      break;
		    default:
		      isAllowedForPropertyComponent = true;
		      break;
		  }

		  return isAllowedForMainComponent && isAllowedForPropertyComponent;
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
