import React, { useState, useEffect } from 'react';
import '../../../../css/Builder/Component/Properties/RowProperties.css';

function RowProperties({ property, handlePropertyChange }) {
  
  const [alignment, setAlignment] = useState(property.alignment || 'center');
  const [spacing, setSpacing] = useState(property.spacing || '0');

  useEffect(() => {
    handlePropertyChange('alignment', alignment);
  }, [alignment]);

  useEffect(() => {
    const spacingValue = parseFloat(spacing);
    if (spacingValue >= 0) {
      handlePropertyChange('spacing', spacing);
    }
  }, [spacing]);

  return (
    <div className="row-properties">
      <div className="row-properties-body">
        <div className="row-properties-row">
          <div className="row-property">
            <label>Alignment:</label>
            <div className="row-property-input-wrapper">
              <select 
                value={alignment} 
                onChange={(e) => setAlignment(e.target.value)}>
                <option value="start">Start</option>
                <option value="center">Center</option>
                <option value="end">End</option>
              </select>
            </div>
          </div>
          <div className="row-property">
            <label>Spacing:</label>
            <div className="row-property-input-wrapper">
              <input 
                type="number"
                value={spacing}
                onChange={(e) => setSpacing(e.target.value)}
                pattern="\d+(\.\d+)?"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RowProperties;
