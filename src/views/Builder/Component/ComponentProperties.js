import React, { useState, useEffect } from 'react';
import MiniHeader from './MiniHeader';
import FontProperties from './Properties/FontProperties';
import StrokeProperties from './Properties/StrokeProperties';
import FrameProperties from './Properties/FrameProperties';
import AlignmentProperties from './Properties/AlignmentProperties';
import ImageProperties from './Properties/ImageProperties';
import RoundedCornerProperties from './Properties/RoundedCornerProperties'; 
import MarginProperties from './Properties/MarginProperties';
import BackgroundProperties from './Properties/BackgroundProperties';

import '../../../css/Builder/Component/ComponentProperties.css';

const possibleStates = ["enabled", "disabled", "hover"];

function ComponentProperties({ isPropertiesOpen, setIsPropertiesOpen }) {
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

  const getAvailableStates = (type) => {
    return possibleStates.filter(state => !states[type].some(s => s.state === state));
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
  console.log(`handleDeleteState invoked with type: ${type} and index: ${index}`);
  const newStates = states[type].slice();
  newStates.splice(index, 1);
  setStates({
    ...states,
    [type]: newStates
  });
};


  const handleChangeState = (type, index, property, value) => {
  	console.log(`handleChangeState invoked with type: ${type} and index: ${index} and property: ${property} and value: ${value}`);
    const newStates = states[type].slice();
    newStates[index][property] = value;
    setStates({
      ...states,
      [type]: newStates
    });
  };

  return (
    <div className="component-properties">
      <div className="component-properties-header">
        <h2 className="component-properties-title">Propiedades</h2>
        <button className="component-properties-close" onClick={() => setIsPropertiesOpen(false)}>
          <i className="bi bi-x"></i>
        </button>
      </div>
      <div className="component-properties-content">

      <MiniHeader
			  title="Background"
			  states={states.background}
			  onAddState={() => handleAddState('background')}
			  onDeleteState={(index) => handleDeleteState('background', index)}
			  onChangeState={(index, property, value) => handleChangeState('background', index, property, value)}
			  renderChildren={(index, state) => (
			    <BackgroundProperties
			      key={state.state}
			      background={state}
			      handlePropertyChange={(property, value) => handleChangeState('background', index, property, value)}
			    />
			  )}
			/>


      <MiniHeader
			  title="Margin"
			  states={states.margin}
			  onAddState={() => handleAddState('margin')}
			  onDeleteState={(index) => handleDeleteState('margin', index)}
			  onChangeState={(index, property, value) => handleChangeState('margin', index, property, value)}
			  renderChildren={(index, state) => (
			    <MarginProperties
			      key={state.state}
			      margin={state}
			      handlePropertyChange={(property, value) => handleChangeState('margin', index, property, value)}
			    />
			  )}
			/>


      <MiniHeader
			  title="Rounded Corners"
			  states={states.corner}
			  onAddState={() => handleAddState('corner')}
			  onDeleteState={(index) => handleDeleteState('corner', index)}
			  onChangeState={(index, property, value) => handleChangeState('corner', index, property, value)}
			  renderChildren={(index, state) => (
			    <RoundedCornerProperties
			      key={state.state}
			      corner={state}
			      handlePropertyChange={(property, value) => handleChangeState('corner', index, property, value)}
			    />
			  )}
			/>

      <MiniHeader
	      title="Image"
	      states={states.image}
	      onAddState={() => handleAddState('image')}
	      onDeleteState={(index) => handleDeleteState('image', index)}
	      onChangeState={(index, property, value) => handleChangeState('image', index, property, value)}
	      renderChildren={(index, state) => (
	        <ImageProperties
	          key={state.state}
	          image={state}
	          handleImagePropertyChange={(property, value) => handleChangeState('image', index, property, value)}
	        />
	      )}
	    />

			<MiniHeader
			  title="Frame"
			  states={states.frame}
			  onAddState={() => handleAddState('frame')}
			  onDeleteState={(index) => handleDeleteState('frame', index)}
			  onChangeState={(index, property, value) => handleChangeState('frame', index, property, value)}
			  renderChildren={(index, state) => (
			    <FrameProperties
			    	key={state.state}
			      frame={state}
			      handlePropertyChange={(property, value) => handleChangeState('frame', index, property, value)}
			    />
			  )}
			/>

      <MiniHeader
			  title="Alignment"
			  states={states.alignment}
			  onAddState={() => handleAddState('alignment')}
			  onDeleteState={(index) => handleDeleteState('alignment', index)}
			  onChangeState={(index, property, value) => handleChangeState('alignment', index, property, value)}
			  renderChildren={(index, state) => (
			    <AlignmentProperties
			    	key={state.state}
			      alignment={state}
			      handleAlignmentChange={(property, value) => handleChangeState('alignment', index, property, value)}
			    />
			  )}
			/>

        <MiniHeader
          title="Font"
          states={states.font}
          onAddState={() => handleAddState('font')}
          onDeleteState={(index) => handleDeleteState('font', index)}
          onChangeState={(index, property, value) => handleChangeState('font', index, property, value)}
          renderChildren={(index, state) => (
            <FontProperties
            	key={state.state}
              font={state}
              handlePropertyChange={(property, value) => handleChangeState('font', index, property, value)}
            />
          )}
        />

        <MiniHeader
          title="Stroke"
          states={states.stroke}
          onAddState={() => handleAddState('stroke')}
          onDeleteState={(index) => handleDeleteState('stroke', index)}
          onChangeState={(index, property, value) => handleChangeState('stroke', index, property, value)}
          renderChildren={(index, state) => (
				  <StrokeProperties 
				    key={state.state}
				    stroke={state}
				    handlePropertyChange={(property, value) => handleChangeState('stroke', index, property, value)}
				  />
				)}
        />
      </div>
    </div>
  );
}

export default ComponentProperties;
