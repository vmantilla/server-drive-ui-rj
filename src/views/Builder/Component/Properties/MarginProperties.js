import React, { useState, useEffect } from 'react';
import '../../../../css/Builder/Component/Properties/MarginProperties.css';

function MarginProperties({ margin, handlePropertyChange }) {
  const [marginValues, setMarginValues] = useState({
    'top': margin['top'] || 0,
    'right': margin['right'] || 0,
    'bottom': margin['bottom'] || 0,
    'left': margin['left'] || 0
  });

  const handleInputChange = (e, marginName) => {
    const value = e.target.value;
    setMarginValues({
      ...marginValues,
      [marginName]: value
    });
    handlePropertyChange(marginName, value);
  };

  return (
    <div className="margin-properties">
      <div className="margin-properties-body">
        <div className="margin-grid">
          {Object.keys(marginValues).map(margin => (
            <input 
              key={margin}
              type="text"
              className={`margin-input ${margin}`}
              value={marginValues[margin]}
              onChange={(e) => handleInputChange(e, margin)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default MarginProperties;
