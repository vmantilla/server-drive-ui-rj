import React from 'react';
import '../../../css/Builder/Component/MiniHeader.css';

function MiniHeader({ possibleStates, title, states, onAddState, onDeleteState, onChangeState, renderChildren }) {
  const getAvailableStates = (currentState) => {
    return possibleStates.filter(
      state => !states.some(s => s.state === state) || state === currentState
    );
  };

  return (
    <div>
      <header className="properties-header">
        <span className="properties-title">{title}</span>
        <button className="add-property-button properties-title" onClick={onAddState}>+</button>
      </header>
      <div className="properties-body">
      {Array.isArray(states) ? states.map((state, index) => (
          <div className="property-block" key={index}>
            <div className="property-mini-header">
              <select className="mini-header-dropdown" value={state.state} onChange={(e) => onChangeState(index, 'platform', e.target.value)}>
                {getAvailableStates(state.state).map((optionState, optionIndex) => (
                  <option key={optionIndex} value={optionState}>{optionState}</option>
                ))}
              </select>
              <button className="delete-property-button" onClick={() => onDeleteState(index)}>-</button>
            </div>
            {renderChildren(index, state)}
          </div>
        )): null}
      </div>
    </div>
  );
}



export default MiniHeader;