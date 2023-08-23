import React, { useState } from 'react';
import '../../../../css/Builder/Component/Properties/FrameProperties.css';

const options = [
  { id: 'auto', label: 'Ajustar a Contenido' },
  { id: 'full', label: 'Ajustar al espacio disponible' },
  { id: 'fixed', label: 'Tamaño Fijo' },
  { id: 'range', label: 'Flexible' }
];

const RangeControls = ({ rangeValue, setRangeValue }) => (
  <div className="frame-range-controls">
    <label className="frame-range-label">Min:</label>
    <div className="frame-frame-input-wrapper">
      <input 
        type="number"
        className="frame-input-number"
        min="1"
        maxLength="4"
        placeholder="Min"
        onChange={(e) => setRangeValue({ ...rangeValue, min: e.target.value })} 
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
        placeholder="Max"
        onChange={(e) => setRangeValue({ ...rangeValue, max: e.target.value })} 
        value={rangeValue.max} 
      />
    </div>
  </div>
);

const DimensionControl = ({ dimension, onDimensionChange }) => {
  const [selectedOption, setSelectedOption] = useState('auto');
  const [fixedValue, setFixedValue] = useState('');
  const [rangeValue, setRangeValue] = useState({min: '', max: ''});

  const handleOptionChange = (option) => {
    setSelectedOption(option);
    onDimensionChange && onDimensionChange(option, fixedValue, rangeValue);
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
                onChange={(e) => setFixedValue(e.target.value)} 
                value={fixedValue} 
              />
            </div>
          )}
          {selectedOption === 'range' && (
            <RangeControls rangeValue={rangeValue} setRangeValue={setRangeValue} />
          )}
        </div>
      </div>
    </div>
  );
};

function FrameProperties({ onWidthChange, onHeightChange }) {
  return (
    <div className="frame-properties">
      <DimensionControl dimension="Width" onDimensionChange={onWidthChange} />
      <DimensionControl dimension="Height" onDimensionChange={onHeightChange} />
    </div>
  );
}

export default FrameProperties;
