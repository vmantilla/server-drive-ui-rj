import React, { useState } from 'react';
import '../../../../css/Builder/Component/Properties/FrameProperties.css';

function DimensionProperty({ label, option, fixedValue, rangeMin, rangeMax, onOptionChange, onInputChange }) {
  const [inputValue, setInputValue] = useState("");
  const [displayValue, setDisplayValue] = useState("Fixed");
  const [showInput, setShowInput] = useState(true);
  const [inputError, setInputError] = useState(false);

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const value = event.target.value;
      const trimmedValue = value.trim();
      const regex = /^[0-9]*\.?[0-9]+$/; // Validación para permitir solo números y decimales
      const containsSpace = /\s/.test(value); // Validación para asegurar que no haya espacios en blanco
      if (trimmedValue === "" || !regex.test(trimmedValue) || parseFloat(trimmedValue) <= 0 || containsSpace) {
        setInputError(true);
      } else {
        setInputError(false);
        setDisplayValue(trimmedValue);
        setShowInput(false);
        event.target.blur();
      }
    }
  };

  const handleButtonChange = () => {
    setDisplayValue("Fixed");
    setInputError(false);
    setShowInput(true);
  };

  return (
    <div className="frame-property">
      <label>{label}:</label>
      <div className="width-options frame-block">
        <button className={`width-button ${option === 'full' ? 'selected' : ''}`} onClick={() => {onOptionChange('full'); handleButtonChange();}}>
          <div className="width-button-rotate">
            <i className={`bi bi-arrows-expand width-button-rotate `}></i>
          </div> Full
        </button>
        <button className={`width-button ${option === 'auto' ? 'selected' : ''}`} onClick={() => {onOptionChange('auto'); handleButtonChange();}}>
          <div className="width-button-rotate">
            <i className={`bi bi-arrows-collapse `}></i>
          </div> Auto
        </button>
        <button className={`width-button ${option === 'fixed' ? 'selected' : ''}`} onClick={() => {onOptionChange('fixed'); handleButtonChange();}}>
          <i className={`bi bi-pin`}></i>
          {option === 'fixed' && showInput ? (
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              onBlur={handleKeyPress}
              maxLength="5"
              style={{width: '5ch', borderColor: inputError ? 'red' : 'transparent'}}
              autoFocus
            />
          ) : displayValue}
        </button>
        <button className={`width-button ${option === 'range' ? 'selected' : ''}`} onClick={() => {onOptionChange('range'); handleButtonChange();}}>
          <i className={`bi bi-arrow-left-right`}></i> Range
        </button>
      </div>
      {option === 'range' && (
        <div className="input-wrapper frame-block">
          <label>Min:</label>
          <input type="number" value={rangeMin} onChange={(e) => onInputChange('min', e.target.value)} min="1" />
          <label>Max:</label>
          <input type="number" value={rangeMax} onChange={(e) => onInputChange('max', e.target.value)} min="1" />
        </div>
      )}
    </div>
  );
}


function FrameProperties() {
  const [frames, setFrames] = useState([]);
  const frameStates = ["enabled", "disabled", "hover"];
  const alignments = ['left', 'center', 'right'];

  const handleAddFrame = () => {
    const availableStates = frameStates.filter(state => !frames.some(frame => frame.state === state));
    if (availableStates.length > 0) {
      setFrames([...frames, {
        state: availableStates[0],
        widthOption: '',
        widthFixed: '',
        widthRangeMin: '',
        widthRangeMax: '',
        heightOption: '',
        heightFixed: '',
        heightRangeMin: '',
        heightRangeMax: '',
        padding: '0px',
        margin: '0px',
        alignment: 'left'
      }]);
    }
  };

  const handleDeleteFrame = (index) => {
    const newFrames = frames.slice();
    newFrames.splice(index, 1);
    setFrames(newFrames);
  };

  const handleFrameChange = (index, property, value) => {
    if (index >= 0 && index < frames.length) {
      const newFrames = frames.slice();
      newFrames[index][property] = value;
      setFrames(newFrames);
    }
  };

  return (
    <div className="frame-properties">
      <header className="frame-properties-header">
        <span className="frame-title">Frame</span>
        <button className="add-frame-button frame-title" onClick={handleAddFrame}>+</button>
      </header>
      <div className="frame-properties-body">
        {frames.map((frame, index) => (
          <div key={index}>
            <div className="frame-mini-header">
              <select className="mini-header-dropdown" value={frame.state} onChange={(e) => handleFrameChange(index, 'state', e.target.value)}>
                {frameStates.filter(state => !frames.some(f => f.state === state) || frame.state === state).map(state => (
                  <option value={state} key={state}>{state.charAt(0).toUpperCase() + state.slice(1)}</option>
                ))}
              </select>
              <button className="delete-frame-button" onClick={() => handleDeleteFrame(index)}>-</button>
            </div>
            <div className="frame-property">
              <DimensionProperty
				  label="Width"
				  option={frame.widthOption}
				  fixedValue={frame.widthFixed}
				  rangeMin={frame.widthRangeMin}
				  rangeMax={frame.widthRangeMax}
				  onOptionChange={(option) => handleFrameChange(index, 'widthOption', option)}
				  onInputChange={(type, value) => handleFrameChange(index, 'width' + type.charAt(0).toUpperCase() + type.slice(1), value)}
				/>
            </div>
            <div className="frame-property">
              <DimensionProperty
				  label="Height"
				  option={frame.heightOption}
				  fixedValue={frame.heightFixed}
				  rangeMin={frame.heightRangeMin}
				  rangeMax={frame.heightRangeMax}
				  onOptionChange={(option) => handleFrameChange(index, 'heightOption', option)}
				  onInputChange={(type, value) => handleFrameChange(index, 'height' + type.charAt(0).toUpperCase() + type.slice(1), value)}
				/>
            </div>
            <div className="frame-property">
              <label>Padding:</label>
              <input type="text" name="padding" value={frame.padding} onChange={(e) => handleFrameChange(index, 'padding', e.target.value)} />
            </div>
            <div className="frame-property">
              <label>Margin:</label>
              <input type="text" name="margin" value={frame.margin} onChange={(e) => handleFrameChange(index, 'margin', e.target.value)} />
            </div>
            <div className="frame-property">
              <label>Alignment:</label>
              <div className="alignment-options">
                {alignments.map(align => (
                  <button key={align} onClick={() => handleFrameChange(index, 'alignment', align)} className={`alignment-button ${frame.alignment === align ? 'selected' : ''}`}>
                    <i className={`bi bi-text-${align}`}></i>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FrameProperties;
