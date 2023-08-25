import React, { useState, useEffect } from 'react';
import '../../../../css/Builder/Component/Properties/BackgroundProperties.css';

function BackgroundProperties({ background, handlePropertyChange }) {

  const [colorInput, setColorInput] = useState(background.color || "#FFFFFF");
  const [opacityInput, setOpacityInput] = useState(background.opacity || "1");

  useEffect(() => {
    if (isValidHexColor(colorInput)) {
      handlePropertyChange('color', colorInput);
    }
  }, [colorInput]);

  useEffect(() => {
    if (isValidOpacity(opacityInput)) {
      handlePropertyChange('opacity', opacityInput);
    }
  }, [opacityInput]);

  const isValidHexColor = (hexColor) => {
    return /^#([0-9A-Fa-f]{3}){1,2}$/.test(hexColor);
  };

  const isValidOpacity = (opacity) => {
    const parsedOpacity = parseFloat(opacity);
    return parsedOpacity >= 0 && parsedOpacity <= 1;
  };

  return (
    <div className="background-properties">
      <div className="background-properties-body">
        <div className="background-block">
          <div className="background-properties-row">
            <div className="background-property">
              <label>Background Color:</label>
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
                  pattern="#[A-Fa-f0-9]{6}"
                />
              </div>
            </div>
            <div className="background-property">
              <label>Opacity:</label>
              <div className="input-wrapper">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="1"
                  value={opacityInput}
                  onChange={(e) => setOpacityInput(e.target.value)}
                  pattern="\d+(\.\d{1})?"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BackgroundProperties;
