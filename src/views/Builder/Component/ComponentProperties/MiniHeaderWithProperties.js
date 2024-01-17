import React from 'react';
import LoadingComponent from '../Properties/LoadingComponent';
import ErrorComponent from '../Properties/ErrorComponent';
import '../../../../css/Builder/Component/MiniHeader.css';

function MiniHeader({ possibleStates, title, states, onAddState, onDeleteState, onChangeState, renderChildren }) {
  const getAvailableStates = (currentState) => {
    return possibleStates.filter(
      state => !states.some(s => s.platform === state) || state === currentState
    );
  };

  const processTitle = (rawTitle) => {
    return rawTitle.split('_')
      .map((word, index) => index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div>
      <header className="properties-header">
        <span className="properties-title">{processTitle(title)}</span>
        <button className="add-property-button properties-title" onClick={onAddState}>+</button>
      </header>
      <div className="properties-body">
      {Array.isArray(states) ? states.map((state, index) => (
          <div className="property-block" key={index}>
            <div className="property-mini-header">
              <select className="mini-header-dropdown" value={state.platform} onChange={(e) => onChangeState(index, 'platform', e.target.value)}>
                {getAvailableStates(state.platform).map((optionState, optionIndex) => (
                  <option key={optionIndex} value={optionState}>{optionState}</option>
                ))}
              </select>
              <button className="delete-property-button" onClick={() => onDeleteState(index)}><i className="bi bi-x"></i></button>
            </div>
            {renderChildren(index, state)}
          </div>
        )): null}
      </div>
    </div>
  );
}

const MiniHeaderWithProperties = ({ possibleStates, title, selectedComponent, states, propertyComponent: PropertyComponent, handleChangeState, handleAddState, handleDeleteState, handleRetry }) => {
  return (
    <MiniHeader
      key={`${title}${selectedComponent.id}`}
      possibleStates={possibleStates}
      title={title}
      states={states}
      onAddState={() => handleAddState(title.toLowerCase())}
      onDeleteState={(index) => handleDeleteState(title.toLowerCase(), index)}
      onChangeState={(index, property, value) => handleChangeState(title.toLowerCase(), index, property, value)}
      renderChildren={(index, state) => {
        if (state.loading) {
          return <LoadingComponent key={index} />;
        } else if (state.error) {
          return <ErrorComponent key={index} onRetry={() => handleRetry(title.toLowerCase(), index)} />;
        } else {
          return (
            <PropertyComponent
              key={`${title}${selectedComponent.id}${state.id}`}
              property={state}
              handlePropertyChange={(property, value) => handleChangeState(title.toLowerCase(), index, property, value)}
            />
          );
        }
      }}
    />
  );
};


export default MiniHeaderWithProperties;