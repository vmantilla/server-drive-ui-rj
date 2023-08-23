import React, { useState, useEffect } from 'react';
import '../../../../css/Builder/Component/Properties/AlignmentProperties.css';

function AlignmentProperties({ alignment, handleAlignmentChange }) {

  console.log("AlignmentProperties", alignment);

   const [selectedAlignment, setSelectedAlignment] = useState(alignment.alignment || 'center');
  
  const alignmentOptions = [
    'top-start', 'top-center', 'top-end',
    'center-start', 'center', 'center-end',
    'bottom-start', 'bottom-center', 'bottom-end'
  ];

  useEffect(() => {
    handleAlignmentChange('alignment', selectedAlignment);
  }, [selectedAlignment]);


  const handleSelectAlignment = (align) => {
    handleAlignmentChange('alignment', align);
  };

  return (
    <div className="alignment-properties">
      <div className="alignment-properties-body">
        <div className="alignment-grid">
          {alignmentOptions.map((align, index) => (
            <button
              key={index}
              onClick={() => setSelectedAlignment(align)}
              className={`alignment-button ${selectedAlignment === align ? 'selected' : ''}`}
            >
              <i className={`bi bi-dot`}></i>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AlignmentProperties;
