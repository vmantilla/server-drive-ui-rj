import React, { useState } from 'react';
import '../../../../css/Builder/Component/Properties/AlignmentProperties.css';

function AlignmentProperties() {
  const [alignments, setAlignments] = useState([]);
  const [selectedAlignment, setSelectedAlignment] = useState(null);
  const alignmentStates = ["enabled", "disabled", "hover"];
  const alignmentOptions = [
    'top-start', 'top-center', 'top-end',
    'center-start', 'center', 'center-end',
    'bottom-start', 'bottom-center', 'bottom-end'
  ];

  const handleAddAlignment = () => {
    const availableStates = alignmentStates.filter(state => !alignments.some(alignment => alignment.state === state));
    if (availableStates.length > 0) {
      setAlignments([...alignments, {
        state: availableStates[0],
        alignment: 'top-start',
      }]);
    }
  };

  const handleDeleteAlignment = (index) => {
    const newAlignments = alignments.slice();
    newAlignments.splice(index, 1);
    setAlignments(newAlignments);
  };

  const handleAlignmentChange = (index, property, value) => {
    const newAlignments = alignments.slice();
    newAlignments[index][property] = value;
    setAlignments(newAlignments);
  };

  const handleSelectAlignment = (align) => {
    setSelectedAlignment(align);
  };

  return (
    <div className="alignment-properties">
      <header className="alignment-properties-header">
        <span className="alignment-title">Alignment</span>
        <button className="add-alignment-button alignment-title" onClick={handleAddAlignment}>+</button>
      </header>
      <div className="alignment-properties-body">
        <div className="alignment-grid">
          {alignmentOptions.map((align, index) => (
            <button
              key={index}
              onClick={() => handleSelectAlignment(align)}
              className={`alignment-button ${selectedAlignment === align ? 'selected' : ''}`}
            >
              <i className={`bi bi-dot`}></i>
            </button>
          ))}
        </div>
        {alignments.map((alignment, index) => (
          <div key={index}>
            <div className="alignment-mini-header">
              <select className="mini-header-dropdown" value={alignment.state} onChange={(e) => handleAlignmentChange(index, 'state', e.target.value)}>
                {alignmentStates.filter(state => !alignments.some(a => a.state === state) || alignment.state === state).map(state => (
                  <option value={state} key={state}>{state.charAt(0).toUpperCase() + state.slice(1)}</option>
                ))}
              </select>
              <button className="delete-alignment-button" onClick={() => handleDeleteAlignment(index)}>-</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AlignmentProperties;


