import React, { useState, useEffect, useRef } from 'react';
import MiniHeader from './MiniHeader';
import FontProperties from './Properties/FontProperties';
import StrokeProperties from './Properties/StrokeProperties';
import FrameProperties from './Properties/FrameProperties';
import AlignmentProperties from './Properties/AlignmentProperties';
import ImageProperties from './Properties/ImageProperties';
import RoundedCornerProperties from './Properties/RoundedCornerProperties';
import MarginProperties from './Properties/MarginProperties';
import BackgroundProperties from './Properties/BackgroundProperties';
import { deepEqual } from '../../Utils/deepEqual';
import { debounce } from 'lodash';
import '../../../css/Builder/Component/ComponentProperties.css';

import { editComponentToAPI } from '../../api';

const possibleStates = ["default","iOS", "android"];

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

function ComponentProperties({ selectedComponent, setSelectedComponent, showNotification }) {

	const lastUpdatedAt = useRef(null);

	const [states, setStates] = useState({
		alignment: [],
		frame: [],
		font: [],
		stroke: [],
		image: [],
		corner: [],
		margin: [],
		background: []
	});

	useEffect(() => {
		if (selectedComponent && selectedComponent.property && selectedComponent.property.data) {
			if (lastUpdatedAt.current !== selectedComponent.updatedAt) {
				lastUpdatedAt.current = selectedComponent.updatedAt;

				const newStates = Object.keys(states).reduce((acc, key) => {
					acc[key] = selectedComponent.property.data[key] || [];
					return acc;
				}, {});
				setStates(newStates);
			}
		} else {
			setSelectedComponent(null);
		}
	}, [selectedComponent]);

	const handleChangeState = debounce((type, index, property, value) => {
		const newStates = [...states[type]];
		newStates[index][property] = value;
		setStates(prev => ({ ...prev, [type]: newStates }));

		setTimeout(() => {
			if (selectedComponent && selectedComponent.property && selectedComponent.property.data) {
				const updatedData = { ...selectedComponent.property.data };
				Object.keys(states).forEach(key => {
					if (states[key].length > 0) {
						updatedData[key] = states[key];
					}
				});
				const updatedComponent = { ...selectedComponent, 
				updatedAt: new Date(),  
				property: { ...selectedComponent.property, data: updatedData } };
				if (selectedComponent && selectedComponent.property) {
			    try {
			      editComponentToAPI(selectedComponent.id, { property: selectedComponent.property });
			      setSelectedComponent(updatedComponent);
			      showNotification('success', 'Propiedades del componente guardadas exitosamente.');
			    } catch (error) {
			      console.error('Error al guardar las propiedades del componente:', error);
			      showNotification('error', 'Error al guardar las propiedades del componente.');
			    }
			  }
				
			}
		}, 200); 
	}, 600);


	const getAvailableStates = (type) => {
		if(states[type]) {
			return possibleStates.filter(state => !states[type].some(s => s.state === state));
		}
		return possibleStates;
	};

	const handleAddState = (type) => {
		const availableStates = getAvailableStates(type);
		if (availableStates.length > 0) {
			setStates({
				...states,
				[type]: [...states[type], { state: availableStates[0] }]
			});
		}
	};

	const handleDeleteState = (type, index) => {
		const newStates = states[type].slice();
		newStates.splice(index, 1);
		setStates({
			...states,
			[type]: newStates
		});
		setTimeout(() => {
			if (selectedComponent && selectedComponent.property && selectedComponent.property.data) {
				const updatedData = { ...selectedComponent.property.data };
				Object.keys(states).forEach(key => {
					if (states[key].length > 0) {
						updatedData[key] = states[key];
					}
				});
				const updatedComponent = { ...selectedComponent, 
				updatedAt: new Date(),  
				property: { ...selectedComponent.property, data: updatedData } };
				setSelectedComponent(updatedComponent);
			}
		}, 200); 
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
        <MiniHeaderWithProperties title="Background" states={states.background} propertyComponent={BackgroundProperties} handleChangeState={handleChangeState} handleAddState={handleAddState} handleDeleteState={handleDeleteState}/>
        <MiniHeaderWithProperties title="Margin" states={states.margin} propertyComponent={MarginProperties} handleChangeState={handleChangeState} handleAddState={handleAddState} handleDeleteState={handleDeleteState}/>
        <MiniHeaderWithProperties title="Corner" states={states.corner} propertyComponent={RoundedCornerProperties} handleChangeState={handleChangeState} handleAddState={handleAddState} handleDeleteState={handleDeleteState}/>
        <MiniHeaderWithProperties title="Image" states={states.image} propertyComponent={ImageProperties} handleChangeState={handleChangeState} handleAddState={handleAddState} handleDeleteState={handleDeleteState}/>
        <MiniHeaderWithProperties title="Frame" states={states.frame} propertyComponent={FrameProperties} handleChangeState={handleChangeState} handleAddState={handleAddState} handleDeleteState={handleDeleteState}/>
        <MiniHeaderWithProperties title="Alignment" states={states.alignment} propertyComponent={AlignmentProperties} handleChangeState={handleChangeState} handleAddState={handleAddState} handleDeleteState={handleDeleteState}/>
        <MiniHeaderWithProperties title="Font" states={states.font} propertyComponent={FontProperties} handleChangeState={handleChangeState} handleAddState={handleAddState} handleDeleteState={handleDeleteState}/>
        <MiniHeaderWithProperties title="Stroke" states={states.stroke} propertyComponent={StrokeProperties} handleChangeState={handleChangeState} handleAddState={handleAddState} handleDeleteState={handleDeleteState}/>
      </div>
    </div>
  );
}

export default ComponentProperties;
