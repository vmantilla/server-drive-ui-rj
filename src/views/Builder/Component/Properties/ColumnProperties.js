import React, { useState, useEffect } from 'react';
import '../../../../css/Builder/Component/Properties/ColumnProperties.css';

function ColumnProperties({ property, handlePropertyChange }) {
  
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
    <div className="column-properties">
      <div className="column-properties-body">
        <div className="column-properties-row">
          <div className="column-property">
            <label>Alignment:</label>
            <div className="column-property-input-wrapper">
              <select 
                value={alignment} 
                onChange={(e) => setAlignment(e.target.value)}>
                <option value="none">None</option>
                <option value="start">Left</option>
                <option value="center">Center</option>
                <option value="end">Right</option>
              </select>
            </div>
          </div>
          <div className="column-property">
            <label>Spacing:</label>
            <div className="column-property-input-wrapper">
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

export default ColumnProperties;
