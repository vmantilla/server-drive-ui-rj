import React, { useState } from 'react';
import '../../../../css/Builder/Component/Properties/FrameProperties.css';

function DimensionProperty({ label, dimension, value, handleDimensionChange }) {
  const [inputValue, setInputValue] = useState(value || "");

  const handleButtonChange = (option) => {
    handleDimensionChange(label.toLowerCase(), option, inputValue);
    if (option !== 'fixed') setInputValue("");
  };

  return (
    <div className="frame-property">
      <label>{label}:</label>
      <div className="width-options frame-block">
        <button className={`width-button ${dimension === 'full' ? 'selected' : ''}`} onClick={() => handleButtonChange('full')}>Full</button>
        <button className={`width-button ${dimension === 'auto' ? 'selected' : ''}`} onClick={() => handleButtonChange('auto')}>Auto</button>
        <button className={`width-button ${dimension === 'fixed' ? 'selected' : ''}`} onClick={() => handleButtonChange('fixed')}>
          {dimension === 'fixed' ? (
            <input 
              type="text" 
              value={inputValue} 
              onChange={(e) => setInputValue(e.target.value)} 
              onBlur={(e) => handleDimensionChange(label.toLowerCase(), 'fixed', e.target.value)}
              autoFocus 
            />
          ) : "Fixed"}
        </button>
      </div>
    </div>
  );
}

function FrameProperties({ frame, handlePropertyChange }) {
  const handleDimensionChange = (dimension, option, value) => {
    handlePropertyChange(`${dimension}Option`, option);
    if (option === 'fixed') {
      handlePropertyChange(dimension, value);
    }
  };

  return (
    <div className="frame-properties">
      <div className="frame-properties-body">
        <DimensionProperty
          label="Width"
          dimension={frame.widthOption}
          value={frame.width}
          handleDimensionChange={handleDimensionChange}
        />
        <DimensionProperty
          label="Height"
          dimension={frame.heightOption}
          value={frame.height}
          handleDimensionChange={handleDimensionChange}
        />
      </div>
    </div>
  );
}

export default FrameProperties;
