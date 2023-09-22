import React, { useState, useEffect } from 'react';
import '../../../../css/Builder/Component/Properties/TextProperties.css';

function TextProperties({ property, handlePropertyChange }) {
  
  const [textValue, setTextValue] = useState(property.data.text || '');

  useEffect(() => {
    handlePropertyChange('text', textValue);
  }, [textValue]);

  return (
    <div className="text-properties">
      <div className="text-properties-body">
        <div className="text-property">
          <label>Text:</label>
          <div className="text-property-input-wrapper">
            <input 
              type="text"
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
              style={{width: '100%'}}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TextProperties;
