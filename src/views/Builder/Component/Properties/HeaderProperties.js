import React, { useState, useEffect } from 'react';
import '../../../../css/Builder/Component/Properties/HeaderProperties.css';

function HeaderProperties({ property, handlePropertyChange }) {
  
  const [headerMode, setHeaderMode] = useState(property.data.headerMode || 'solid');

  useEffect(() => {
    handlePropertyChange('headerMode', headerMode);
  }, [headerMode]);

  return (
    <div className="header-properties">
      <div className="header-properties-body">
        <div className="header-properties-row">
          <div className="header-property">
            <label>Header Mode:</label>
            <div className="header-property-input-wrapper">
              <select 
                value={headerMode} 
                onChange={(e) => setHeaderMode(e.target.value)}>
                <option value="normal">Normal</option>
                <option value="floating">Floating</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeaderProperties;
