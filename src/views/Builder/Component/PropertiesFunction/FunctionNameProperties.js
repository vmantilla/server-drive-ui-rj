import React, { useState, useEffect } from 'react';
import '../../../../css/Builder/Component/PropertiesFunction/FunctionNameProperties.css';

function FunctionNameProperties({ property, handlePropertyChange }) {
  
  const [functionName, setFunctionName] = useState(property.data.function_name || '');

  useEffect(() => {
    handlePropertyChange('function_name', functionName);
  }, [functionName]);

  return (
    <div className="function-name-properties">
      <div className="function-name-properties-body">

        <div className="function-name-property">
          <label>Function Name:</label>
          <div className="function-name-property-input-wrapper">
            <input 
              type="text"
              value={functionName}
              onChange={(e) => setFunctionName(e.target.value)}
              style={{width: '100%'}}
            />
          </div>
        </div>

      </div>
    </div>
  );
}

export default FunctionNameProperties;
