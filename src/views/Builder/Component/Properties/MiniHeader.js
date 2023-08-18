import React from 'react';

const MiniHeader = ({ states, selectedState, onStateChange, onDelete }) => {
  return (
    <div className="mini-header">
      <select className="mini-header-dropdown" value={selectedState} onChange={onStateChange}>
        {states.map((state, index) => (
          <option value={state} key={index}>{state.charAt(0).toUpperCase() + state.slice(1)}</option>
        ))}
      </select>
      <button className="delete-button" onClick={onDelete}>-</button>
    </div>
  );
};

export default MiniHeader;
