import React, { useState, useEffect } from 'react';
import '../../../../css/Builder/Component/Properties/RoundedCornerProperties.css';

function RoundedCornerProperties({ property, handlePropertyChange }) {
  const [cornerValues, setCornerValues] = useState({
    'top-left': property['top-left'] || 0,
    'top-right': property['top-right'] || 0,
    'bottom-left': property['bottom-left'] || 0,
    'bottom-right': property['bottom-right'] || 0
  });

  const handleInputChange = (e, cornerName) => {
    const value = e.target.value;
    setCornerValues({
      ...cornerValues,
      [cornerName]: value
    });
    handlePropertyChange(cornerName, value);
  };

  return (
    <div className="corner-properties">
      <div className="corner-properties-body">
        <div className="corner-grid">
          {Object.keys(cornerValues).map(corner => (
            <input 
              key={corner}
              type="text"
              className={`corner-input ${corner}`}
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
