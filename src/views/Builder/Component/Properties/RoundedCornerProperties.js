import React, { useState, useEffect } from 'react';
import '../../../../css/Builder/Component/Properties/RoundedCornerProperties.css';

function RoundedCornerProperties({ property, handlePropertyChange }) {
  const [cornerValues, setCornerValues] = useState({
    'top_left': property['top_left'] || 0,
    'top_right': property['top_right'] || 0,
    'bottom_left': property['bottom_left'] || 0,
    'bottom_right': property['bottom_right'] || 0
  });

  const handleInputChange = (e, cornerName) => {
    const value = e.target.value;
    setCornerValues({
      ...cornerValues,
      [cornerName]: value
    });
    handlePropertyChange(cornerName, value);
  };

  const cornerToCssClass = {
    top_left: 'top-left',
    top_right: 'top-right',
    bottom_left: 'bottom-left',
    bottom_right: 'bottom-right',
  };

  return (
    <div className="corner-properties">
      <div className="corner-properties-body">
        <div className="corner-grid">
          {Object.keys(cornerValues).map(corner => (
            <input 
              key={corner}
              type="text"
              className={`corner-input ${cornerToCssClass[corner]}`}
              value={cornerValues[corner]}
              onChange={(e) => handleInputChange(e, corner)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default RoundedCornerProperties;
