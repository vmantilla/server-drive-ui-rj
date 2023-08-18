import React, { useState } from 'react';
import '../../../../css/Builder/Component/Properties/FrameProperties.css';

function FrameProperties() {
  const [frame, setFrame] = useState({
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
    alignment: 'left',
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFrame({...frame, [name]: value});
  };

  const handleWidthOptionChange = (option) => {
    setFrame({...frame, widthOption: frame.widthOption === option ? '' : option});
  };

  const handleHeightOptionChange = (option) => {
    setFrame({...frame, heightOption: frame.heightOption === option ? '' : option});
  };

  const alignments = ['left', 'center', 'right'];

  return (
    <div className="frame-properties">
      <header className="frame-properties-header">
        <span className="frame-title">Frame</span>
      </header>
      <div className="frame-properties-body">
        <div className="frame-property">
          <label>Width:</label>
          <div className="width-options">
            <button
              className={`width-button ${frame.widthOption === 'full' ? 'selected' : ''}`}
              onClick={() => handleWidthOptionChange('full')}
            >
             <div className="width-button-rotate">
              <i className={`bi bi-arrows-expand width-button-rotate `}></i>
              </div> Full
            </button>
            <button
              className={`width-button ${frame.widthOption === 'auto' ? 'selected' : ''}`}
              onClick={() => handleWidthOptionChange('auto')}
            >
            <div className="width-button-rotate">
              <i className={`bi bi-arrows-collapse `}></i>
              </div> Auto
            </button>
            <button
              className={`width-button ${frame.widthOption === 'fixed' ? 'selected' : ''}`}
              onClick={() => handleWidthOptionChange('fixed')}
            >
              <i className={`bi bi-pin`}></i> Fixed
            </button>
            <button
              className={`width-button ${frame.widthOption === 'range' ? 'selected' : ''}`}
              onClick={() => handleWidthOptionChange('range')}
            >
              <i className={`bi bi-arrow-left-right`}></i> Range
            </button>
          </div>
          {frame.widthOption === 'fixed' && (
            <div className="input-wrapper">
              <label>Fixed:</label>
              <input
                type="number"
                name="widthFixed"
                value={frame.widthFixed}
                onChange={handleInputChange}
                min="1"
              />
            </div>
          )}
          {frame.widthOption === 'range' && (
            <div className="input-wrapper">
              <label>Min:</label>
              <input
                type="number"
                name="widthRangeMin"
                value={frame.widthRangeMin}
                onChange={handleInputChange}
                min="1"
              />
              <label>Max:</label>
              <input
                type="number"
                name="widthRangeMax"
                value={frame.widthRangeMax}
                onChange={handleInputChange}
                min="1"
              />
            </div>
          )}
        </div>
        <div className="frame-property">
          <label>Height:</label>
          <div className="width-options">
            <button
              className={`width-button ${frame.heightOption === 'full' ? 'selected' : ''}`}
              onClick={() => handleHeightOptionChange('full')}
            >
             <div >
              <i className={`bi bi-arrows-expand width-button-rotate `}></i>
              </div> Full
            </button>
            <button
              className={`width-button ${frame.heightOption === 'auto' ? 'selected' : ''}`}
              onClick={() => handleHeightOptionChange('auto')}
            >
            <i className={`bi bi-arrows-collapse `}></i>Auto
            </button>
            <button
              className={`width-button ${frame.heightOption === 'fixed' ? 'selected' : ''}`}
              onClick={() => handleHeightOptionChange('fixed')}
            >
              <i className={`bi bi-pin`}></i> Fixed
            </button>
            <button
              className={`width-button ${frame.heightOption === 'range' ? 'selected' : ''}`}
              onClick={() => handleHeightOptionChange('range')}
            >
              <i className={`bi bi-arrow-left-right`}></i> Range
            </button>
          </div>
          {frame.heightOption === 'fixed' && (
            <div className="input-wrapper">
              <label>Fixed:</label>
              <input
                type="number"
                name="heightFixed"
                value={frame.heightFixed}
                onChange={handleInputChange}
                min="1"
              />
            </div>
          )}
          {frame.heightOption === 'range' && (
            <div className="input-wrapper">
              <label>Min:</label>
              <input
                type="number"
                name="heightRangeMin"
                value={frame.heightRangeMin}
                onChange={handleInputChange}
                min="1"
              />
              <label>Max:</label>
              <input
                type="number"
                name="heightRangeMax"
                value={frame.heightRangeMax}
                onChange={handleInputChange}
                min="1"
              />
            </div>
          )}
        </div>
        {/* Add similar blocks for Height, Padding, Margin, Alignment, etc. */}
      </div>
    </div>
  );
}

export default FrameProperties;

