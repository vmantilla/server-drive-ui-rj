import React, { useState } from 'react';
import MiniHeader from './MiniHeader';
import FontProperties from './Properties/FontProperties';
import StrokeProperties from './Properties/StrokeProperties';
import FrameProperties from './Properties/FrameProperties';
import AlignmentProperties from './Properties/AlignmentProperties';
import '../../../css/Builder/Component/ComponentProperties.css';

const possibleStates = ["enabled", "disabled", "hover"];

function ComponentProperties({ isPropertiesOpen, setIsPropertiesOpen }) {
  const [states, setStates] = useState({
    alignment: [],
    frame: [],
    font: [],
    stroke: [],
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
    const newStates = states[type].slice();
    newStates.splice(index, 1);
    setStates({
      ...states,
      [type]: newStates
    });
  };

  const handleChangeState = (type, index, property, value) => {
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
			  title="Frame"
			  states={states.frame}
			  onAddState={() => handleAddState('frame')}
			  onDeleteState={(index) => handleDeleteState('frame', index)}
			  onChangeState={(index, property, value) => handleChangeState('frame', index, property, value)}
			  renderChildren={(index, state) => (
			    <FrameProperties
			      alignment={state}
			      handleAlignmentChange={(property, value) => handleChangeState('frame', index, property, value)}
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
              font={state}
              availableStates={getAvailableStates('font')}
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
              stroke={state}
              availableStates={getAvailableStates('stroke')}
              handlePropertyChange={(property, value) => handleChangeState('stroke', index, property, value)}
            />
          )}
        />
      </div>
    </div>
  );
}

export default ComponentProperties;
