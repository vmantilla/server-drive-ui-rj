import React, { useState } from 'react';
import '../../../../css/Builder/Component/Properties/FrameProperties.css';

function FrameProperties({ onWidthChange, onHeightChange }) {
  const [widthOption, setWidthOption] = useState('auto');
  const [heightOption, setHeightOption] = useState('auto');
  const [fixedWidth, setFixedWidth] = useState('');
  const [fixedHeight, setFixedHeight] = useState('');
  const [rangeWidth, setRangeWidth] = useState({min: '', max: ''});
  const [rangeHeight, setRangeHeight] = useState({min: '', max: ''});

  const handleWidthChange = (option, value) => {
    setWidthOption(option);
    onWidthChange && onWidthChange(value);
  };

  const handleHeightChange = (option, value) => {
    setHeightOption(option);
    onHeightChange && onHeightChange(value);
  };

  return (
    <div className="frame-properties">
      <div className="frame-property">
        <label>Width:</label>
        <div className="frame-input-wrapper">
          <button 
            onClick={() => handleWidthChange('auto', 'auto')}
            className={widthOption === 'auto' ? 'selected' : ''}
          >
            Auto
          </button>
          <button 
            onClick={() => handleWidthChange('full', 'full')}
            className={widthOption === 'full' ? 'selected' : ''}
          >
            Full
          </button>
          <input 
            type="text" 
            placeholder="Fixed" 
            onFocus={() => handleWidthChange('fixed')}
            onChange={(e) => setFixedWidth(e.target.value)} 
            value={widthOption === 'fixed' ? fixedWidth : ''} 
            className={widthOption === 'fixed' ? 'selected' : ''} 
          />
          <button onClick={() => handleWidthChange('range')} 
            className={widthOption === 'range' ? 'selected' : ''}>
            Range
          </button>
        </div>
        {widthOption === 'range' && (
          <div className="range-controls">
            <label className="range-label">Min:</label>
            <input 
              type="text" 
              placeholder="Min" 
              onChange={(e) => setRangeWidth({ ...rangeWidth, min: e.target.value })} 
              value={rangeWidth.min} 
              className={widthOption === 'range' ? 'selected' : ''} 
            />
            <label className="range-label">Max:</label>
            <input 
              type="text" 
              placeholder="Max" 
              onChange={(e) => setRangeWidth({ ...rangeWidth, max: e.target.value })} 
              value={rangeWidth.max} 
              className={widthOption === 'range' ? 'selected' : ''} 
            />
          </div>
        )}
      </div>
      
      <div className="frame-property">
        <label>Height:</label>
        <div className="frame-input-wrapper">
          <button 
            onClick={() => handleHeightChange('auto', 'auto')}
            className={heightOption === 'auto' ? 'selected' : ''}
          >
            Auto
          </button>
          <button 
            onClick={() => handleHeightChange('full', 'full')}
            className={heightOption === 'full' ? 'selected' : ''}
          >
            Full
          </button>
          <input 
            type="text" 
            placeholder="Fixed" 
            onFocus={() => handleHeightChange('fixed')} 
            onChange={(e) => setFixedHeight(e.target.value)} 
            value={heightOption === 'fixed' ? fixedHeight : ''} 
            className={heightOption === 'fixed' ? 'selected' : ''} 
          />
          <button onClick={() => handleHeightChange('range')}
            className={heightOption === 'range' ? 'selected' : ''}>
            Range
          </button>
        </div>
        {heightOption === 'range' && (
          <div className="range-controls">
            <label className="range-label">Min:</label>
            <input 
              type="text" 
              placeholder="Min" 
              onChange={(e) => setRangeHeight({ ...rangeHeight, min: e.target.value })} 
              value={rangeHeight.min} 
              className={heightOption === 'range' ? 'selected' : ''} 
            />
            <label className="range-label">Max:</label>
            <input 
              type="text" 
              placeholder="Max" 
              onChange={(e) => setRangeHeight({ ...rangeHeight, max: e.target.value })} 
              value={rangeHeight.max} 
              className={heightOption === 'range' ? 'selected' : ''} 
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default FrameProperties;
