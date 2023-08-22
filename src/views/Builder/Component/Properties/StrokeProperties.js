import React, { useState } from 'react';
import '../../../../css/Builder/Component/Properties/StrokeProperties.css';

function StrokeProperties({ stroke, handlePropertyChange }) {
  const [colorInput, setColorInput] = useState(stroke.color || "#000000");

  const handleOpacityChange = (value) => {
    const opacity = parseFloat(value);
    if (opacity >= 0 && opacity <= 1) {
      handlePropertyChange('opacity', value);
    }
  };

  const handleWidthChange = (value) => {
    const width = parseFloat(value);
    if (width > 0) {
      handlePropertyChange('width', value);
    }
  };

  const isValidHexColor = (hexColor) => {
    return /^#([0-9A-Fa-f]{3}){1,2}$/.test(hexColor);
  };

  const handleColorInputBlur = () => {
    if (isValidHexColor(colorInput)) {
      handlePropertyChange('color', colorInput);
    }
  };

  return (
    <div className="stroke-properties">
      <div className="stroke-properties-body">
        <div className="stroke-block">
          <div className="stroke-properties-row">
            <div className="stroke-property">
              <label>Color:</label>
              <div className="color-input">
                <input
                  type="color"
                  value={colorInput}
                  onChange={(e) => setColorInput(e.target.value)}
                />
                <input
                  type="text"
                  className="hex-code"
                  value={colorInput}
                  onChange={(e) => setColorInput(e.target.value)}
                  onBlur={handleColorInputBlur}
                  pattern="#[A-Fa-f0-9]{6}"
                />
              </div>
            </div>
            <div className="stroke-property">
              <label>Opacity:</label>
              <div className="input-wrapper">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="1"
                  value={stroke.opacity || "1"}
                  onChange={(e) => handleOpacityChange(e.target.value)}
                  pattern="\d+(\.\d{1})?"
                />
              </div>
            </div>
            <div className="stroke-property">
              <label>Width:</label>
              <div className="input-wrapper">
                <input
                  type="number"
                  value={stroke.width || "1"}
                  onChange={(e) => handleWidthChange(e.target.value)}
                  pattern="\d+(\.\d+)?"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StrokeProperties;
