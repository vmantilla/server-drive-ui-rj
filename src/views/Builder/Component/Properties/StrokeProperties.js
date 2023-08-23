import React, { useState, useEffect } from 'react';
import '../../../../css/Builder/Component/Properties/StrokeProperties.css';

function StrokeProperties({ stroke, handlePropertyChange }) {

  const [colorInput, setColorInput] = useState(stroke.color || "#000000");
  const [opacityInput, setOpacityInput] = useState(stroke.opacity || "1");
  const [widthInput, setWidthInput] = useState(stroke.width || "1");

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

  useEffect(() => {
    if (isValidWidth(widthInput)) {
      handlePropertyChange('width', widthInput);
    }
  }, [widthInput]);

  const isValidHexColor = (hexColor) => {
    return /^#([0-9A-Fa-f]{3}){1,2}$/.test(hexColor);
  };

  const isValidOpacity = (opacity) => {
    const parsedOpacity = parseFloat(opacity);
    return parsedOpacity >= 0 && parsedOpacity <= 1;
  };

  const isValidWidth = (width) => {
    const parsedWidth = parseFloat(width);
    return parsedWidth > 0;
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
                  value={opacityInput}
                  onChange={(e) => setOpacityInput(e.target.value)}
                  pattern="\d+(\.\d{1})?"
                />
              </div>
            </div>
            <div className="stroke-property">
              <label>Width:</label>
              <div className="input-wrapper">
                <input
                  type="number"
                  value={widthInput}
                  onChange={(e) => setWidthInput(e.target.value)}
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
