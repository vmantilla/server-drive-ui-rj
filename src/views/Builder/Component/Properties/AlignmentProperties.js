import React, { useState } from 'react';
import '../../../../css/Builder/Component/Properties/AlignmentProperties.css';

function AlignmentProperties({ alignment, handleAlignmentChange }) {
  const [alignments, setAlignments] = useState([]);
  const [selectedAlignment, setSelectedAlignment] = useState(null);
  const alignmentStates = ["enabled", "disabled", "hover"];
  const alignmentOptions = [
    'top-start', 'top-center', 'top-end',
    'center-start', 'center', 'center-end',
    'bottom-start', 'bottom-center', 'bottom-end'
  ];
  const handleLocalAlignmentChange = (index, property, value) => {
    if (handleAlignmentChange) {
      handleAlignmentChange(property, value);
    }
    const newAlignments = alignments.slice();
    newAlignments[index][property] = value;
    setAlignments(newAlignments);
  };

  const handleSelectAlignment = (align) => {
    setSelectedAlignment(align);
  };

  return (
    <div className="alignment-properties">
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
            
          </div>
        ))}
      </div>
    </div>
  );
}

export default AlignmentProperties;
