import React, { useState } from 'react';
import '../../../../css/Builder/Component/Properties/FrameProperties.css';

function FrameProperties() {
  const [frames, setFrames] = useState([]);
  const frameStates = ["enabled", "disabled", "hover"];
  const alignments = ['left', 'center', 'right'];

  const handleAddFrame = () => {
    const availableStates = frameStates.filter(state => !frames.some(frame => frame.state === state));
    if (availableStates.length > 0) {
      setFrames([...frames, { state: availableStates[0], widthOption: '', widthFixed: '', widthRangeMin: '', widthRangeMax: '', heightOption: '', heightFixed: '', heightRangeMin: '', heightRangeMax: '', padding: '0px', margin: '0px', alignment: 'left' }]);
    }
  };

  const handleDeleteFrame = (index) => {
    const newFrames = frames.slice();
    newFrames.splice(index, 1);
    setFrames(newFrames);
  };

  const handleFrameChange = (index, property, value) => {
    const newFrames = frames.slice();
    newFrames[index][property] = value;
    setFrames(newFrames);
  };

  const handleInputChange = (event, index) => {
    const { name, value } = event.target;
    handleFrameChange(index, name, value);
  };

  const handleWidthOptionChange = (option, index) => {
    handleFrameChange(index, 'widthOption', frames[index].widthOption === option ? '' : option);
  };

  const handleHeightOptionChange = (option, index) => {
    handleFrameChange(index, 'heightOption', frames[index].heightOption === option ? '' : option);
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
              <label>Width:</label>
              <div className="width-options frame-block">
                <button className={`width-button ${frame.widthOption === 'full' ? 'selected' : ''}`} onClick={() => handleWidthOptionChange('full', index)}>
                  <div className="width-button-rotate">
                    <i className={`bi bi-arrows-expand width-button-rotate `}></i>
                  </div> Full
                </button>
                <button className={`width-button ${frame.widthOption === 'auto' ? 'selected' : ''}`} onClick={() => handleWidthOptionChange('auto', index)}>
                  <div className="width-button-rotate">
                    <i className={`bi bi-arrows-collapse `}></i>
                  </div> Auto
                </button>
                <button className={`width-button ${frame.widthOption === 'fixed' ? 'selected' : ''}`} onClick={() => handleWidthOptionChange('fixed', index)}>
                  <i className={`bi bi-pin`}></i> Fixed
                </button>
                <button className={`width-button ${frame.widthOption === 'range' ? 'selected' : ''}`} onClick={() => handleWidthOptionChange('range', index)}>
                  <i className={`bi bi-arrow-left-right`}></i> Range
                </button>
              </div>
              {frame.widthOption === 'fixed' && (
                <div className="input-wrapper frame-block">
                  <label>Fixed:</label>
                  <input type="number" name="widthFixed" value={frame.widthFixed} onChange={(e) => handleInputChange(e, index)} min="1" />
                </div>
              )}
              {frame.widthOption === 'range' && (
                <div className="input-wrapper frame-block">
                  <label>Min:</label>
                  <input type="number" name="widthRangeMin" value={frame.widthRangeMin} onChange={(e) => handleInputChange(e, index)} min="1" />
                  <label>Max:</label>
                  <input type="number" name="widthRangeMax" value={frame.widthRangeMax} onChange={(e) => handleInputChange(e, index)} min="1" />
                </div>
              )}
            </div>
            <div className="frame-property">
              <label>Height:</label>
              <div className="width-options frame-block">
                <button className={`width-button ${frame.heightOption === 'full' ? 'selected' : ''}`} onClick={() => handleHeightOptionChange('full', index)}>
                  <div>
                    <i className={`bi bi-arrows-expand width-button-rotate `}></i>
                  </div> Full
                </button>
                <button className={`width-button ${frame.heightOption === 'auto' ? 'selected' : ''}`} onClick={() => handleHeightOptionChange('auto', index)}>
                  <i className={`bi bi-arrows-collapse `}></i>Auto
                </button>
                <button className={`width-button ${frame.heightOption === 'fixed' ? 'selected' : ''}`} onClick={() => handleHeightOptionChange('fixed', index)}>
                  <i className={`bi bi-pin`}></i> Fixed
                </button>
                <button className={`width-button ${frame.heightOption === 'range' ? 'selected' : ''}`} onClick={() => handleHeightOptionChange('range', index)}>
                  <i className={`bi bi-arrow-left-right`}></i> Range
                </button>
              </div>
              {frame.heightOption === 'fixed' && (
                <div className="input-wrapper frame-block">
                  <label>Fixed:</label>
                  <input type="number" name="heightFixed" value={frame.heightFixed} onChange={(e) => handleInputChange(e, index)} min="1" />
                </div>
              )}
              {frame.heightOption === 'range' && (
                <div className="input-wrapper frame-block">
                  <label>Min:</label>
                  <input type="number" name="heightRangeMin" value={frame.heightRangeMin} onChange={(e) => handleInputChange(e, index)} min="1" />
                  <label>Max:</label>
                  <input type="number" name="heightRangeMax" value={frame.heightRangeMax} onChange={(e) => handleInputChange(e, index)} min="1" />
                </div>
              )}
            </div>
            {/* Add similar blocks for Height, Padding, Margin, Alignment, etc. */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FrameProperties;
