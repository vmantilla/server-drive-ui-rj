import React, { useState } from 'react';
import '../../../../css/Builder/Component/Properties/FontProperties.css';

function FontProperties({ font, handlePropertyChange }) {
  const [selectedStyles, setSelectedStyles] = useState({
    italic: font && font.style ? font.style.italic || false : false,
    strikethrough: font && font.style ? font.style.strikethrough || false : false,
    underline: font && font.style ? font.style.underline || false : false
  });

  const handleStyleToggle = (styleName) => {
    setSelectedStyles(prevStyles => ({
      ...prevStyles,
      [styleName]: !prevStyles[styleName]
    }));
  };

  const handleOpacityChange = (value) => {
    const opacity = parseFloat(value);
    if (opacity >= 0 && opacity <= 1) {
      handlePropertyChange('opacity', value);
    }
  };

  const handleSizeChange = (value) => {
    const size = parseFloat(value);
    if (size > 0) {
      handlePropertyChange('size', value);
    }
  };

  const handleLineHeightChange = (value) => {
    const lineHeight = parseFloat(value);
    if (lineHeight > 0) {
      handlePropertyChange('lineHeight', value);
    }
  };

  const handleLetterSpacingChange = (value) => {
    const letterSpacing = parseFloat(value);
    if (!isNaN(letterSpacing) && letterSpacing >= 0) {
      handlePropertyChange('letterSpacing', value);
    }
  };

  const fontNames = ["Arial", "Verdana", "Georgia", "Tahoma", "Times New Roman", "Courier New"];
  const fontWeights = ["Normal", "Bold", "Bolder", "Lighter"];

  return (
    <div className="font-properties">
      <div className="font-properties-body">
        <div className="font-block">
          <div className="font-properties-row">
            <div className="font-property">
              <label>Name:</label>
              <div className="input-wrapper">
                <select value={font.name || "Arial"} onChange={(e) => handlePropertyChange('name', e.target.value)}>
                  {fontNames.map((name) => <option key={name} value={name}>{name}</option>)}
                </select>
              </div>
            </div>
            <div className="font-property">
              <label>Weight:</label>
              <div className="input-wrapper">
                <select value={font.weight || "normal"} onChange={(e) => handlePropertyChange('weight', e.target.value)}>
                  {fontWeights.map((weight) => <option key={weight} value={weight.toLowerCase()}>{weight}</option>)}
                </select>
              </div>
            </div>
            <div className="font-property">
              <label>Size:</label>
              <div className="input-wrapper">
                <input
                  type="number"
                  value={font.size || "16"}
                  onChange={(e) => handleSizeChange(e.target.value)}
                  pattern="\d+(\.\d+)?"
                />
              </div>
            </div>
            <div className="font-property">
              <label>Line Height:</label>
              <div className="input-wrapper">
                <input
                  type="number"
                  value={font.lineHeight || "1.5"}
                  onChange={(e) => handleLineHeightChange(e.target.value)}
                  pattern="\d+(\.\d+)?"
                />
              </div>
            </div>
            <div className="font-property">
              <label>Spacing:</label>
              <div className="input-wrapper">
                <input
                  type="number"
                  value={font.letterSpacing || "1"}
                  onChange={(e) => handleLetterSpacingChange(e.target.value)}
                  pattern="\d+(\.\d+)?"
                />
              </div>
            </div>
            <div className="font-property">
              <label>Color:</label>
              <div className="color-input">
                <input
                  type="color"
                  value={font.color || "#000000"}
                  onChange={(e) => handlePropertyChange('color', e.target.value)}
                />
                <input
                  type="text"
                  className="hex-code"
                  value={font.color || "#000000"}
                  onChange={(e) => handlePropertyChange('color', e.target.value)}
                />
              </div>
            </div>
            <div className="font-property">
              <label>Opacity:</label>
              <div className="input-wrapper">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="1"
                  value={font.opacity || "1"}
                  onChange={(e) => handleOpacityChange(e.target.value)}
                  pattern="\d+(\.\d{1})?"
                />
              </div>
            </div>
            <div className="font-property">
              <label>Style:</label>
              <div className="input-wrapper font-style-buttons">
                <button className={`font-style-button ${selectedStyles.italic ? 'selected' : ''}`} onClick={() => handleStyleToggle('italic')}><i className="bi bi-type-italic"></i></button>
                <button className={`font-style-button ${selectedStyles.strikethrough ? 'selected' : ''}`} onClick={() => handleStyleToggle('strikethrough')}><i className="bi bi-type-strikethrough"></i></button>
                <button className={`font-style-button ${selectedStyles.underline ? 'selected' : ''}`} onClick={() => handleStyleToggle('underline')}><i className="bi bi-type-underline"></i></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FontProperties;
