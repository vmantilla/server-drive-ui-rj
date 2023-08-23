import React, { useState, useEffect } from 'react';
import '../../../../css/Builder/Component/Properties/FrameProperties.css';

const options = [
  { id: 'auto', label: 'Ajustar a Contenido' },
  { id: 'full', label: 'Ajustar al espacio disponible' },
  { id: 'fixed', label: 'Tamaño Fijo' },
  { id: 'range', label: 'Flexible' }
];

const RangeControls = ({ rangeValue, setRangeValue, dimension, onDimensionChange }) => {
  const updateRangeValue = (key, value) => {
    const newRangeValue = { ...rangeValue, [key]: value };
    setRangeValue(newRangeValue);
    onDimensionChange(dimension, { option: 'range', ...newRangeValue });
  };

  return (
    <div className="frame-range-controls">
      <label className="frame-range-label">Min:</label>
      <div className="frame-frame-input-wrapper">
        <input 
          type="number"
          className="frame-input-number"
          min="1"
          maxLength="4"
          placeholder=""
          onChange={(e) => updateRangeValue('min', e.target.value)}
          value={rangeValue.min} 
        />
      </div>
      <label className="frame-range-label">Max:</label>
      <div className="frame-frame-input-wrapper">
        <input 
          type="number"
          className="frame-input-number"
          min="1"
          maxLength="4"
          placeholder=""
          onChange={(e) => updateRangeValue('max', e.target.value)}
          value={rangeValue.max} 
        />
      </div>
    </div>
  );
};

const DimensionControl = ({ dimension, initialDimension, onDimensionChange }) => {
  const [selectedOption, setSelectedOption] = useState(initialDimension.option || 'auto');
  const [fixedValue, setFixedValue] = useState(initialDimension.fixedValue || '');
  const [rangeValue, setRangeValue] = useState(initialDimension.rangeValue || { min: '', max: '' });

  useEffect(() => {
    setFixedValue('');
    setRangeValue({ min: '', max: '' });
  }, [selectedOption]);

  const handleOptionChange = (option) => {
    setSelectedOption(option);
    let updatedValue = { option };

    if (option === 'fixed' && fixedValue) {
      updatedValue.value = fixedValue;
    } 
    else if (option === 'range') {
      if (rangeValue.min) updatedValue.min = rangeValue.min;
      if (rangeValue.max) updatedValue.max = rangeValue.max;
    }

    onDimensionChange(dimension.toLowerCase(), updatedValue);
  };


  const updateFixedValue = (value) => {
    setFixedValue(value);
    onDimensionChange(dimension, { option: 'fixed', value });
  };

  return (
    <div className="frame-property">
      <label className="frame-dimension-label">{dimension}:</label>
      <div className="frame-control-box">
        <div className="frame-custom-dropdown">
          <select 
            className="frame-select" 
            onChange={e => handleOptionChange(e.target.value)} 
            value={selectedOption}
          >
            {options.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
          {selectedOption === 'fixed' && (
            <div className="frame-frame-input-wrapper">
              <input 
                type="number" 
                className="frame-input-number"
                min="1"
                maxLength="4"
                placeholder="Fixed" 
                onChange={(e) => updateFixedValue(e.target.value)} 
                value={fixedValue} 
              />
            </div>
          )}
          {selectedOption === 'range' && (
            <RangeControls 
              rangeValue={rangeValue} 
              setRangeValue={setRangeValue} 
              dimension={dimension}
              onDimensionChange={onDimensionChange} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

function FrameProperties({ frame, handlePropertyChange }) {

  const [width, setWidth] = useState(frame ? frame.width || { option: 'auto' } : { option: 'auto' });
  const [height, setHeight] = useState(frame ? frame.height || { option: 'auto' } : { option: 'auto' });
  
  console.log("FrameProperties", frame)

  const handleDimensionChange = (dimension, updatedValue) => {
    const lowerDimension = dimension.toLowerCase();
    if (lowerDimension === 'width') {
      setWidth(updatedValue);
    } else if (lowerDimension === 'height') {
      setHeight(updatedValue);
    }
    handlePropertyChange(lowerDimension, updatedValue);
  };

  useEffect(() => {
    handlePropertyChange('width', width);
    handlePropertyChange('height', height);
  }, []);

  return (
    <div className="frame-properties">
      <DimensionControl 
        dimension="Width" 
        initialDimension={width}
        onDimensionChange={handleDimensionChange} 
      />
      <DimensionControl 
        dimension="Height" 
        initialDimension={height}
        onDimensionChange={handleDimensionChange} 
      />
    </div>
  );
}

export default FrameProperties;
