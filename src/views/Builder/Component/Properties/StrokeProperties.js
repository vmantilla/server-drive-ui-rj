import React, { useState, useEffect } from 'react';
import '../../../../css/Builder/Component/Properties/StrokeProperties.css';

function StrokeProperties({ property, handlePropertyChange }) {

  const [colorInput, setColorInput] = useState(property.data.color || "#000000");
  const [widthInput, setWidthInput] = useState(property.data.width || "1");
  const [borderStyle, setBorderStyle] = useState(property.data.border_style || "solid");

  useEffect(() => {
    if (isValidHexColor(colorInput)) {
      handlePropertyChange('color', colorInput);
    }
  }, [colorInput]);

  useEffect(() => {
    if (isValidWidth(widthInput)) {
      handlePropertyChange('width', widthInput);
    }
  }, [widthInput]);

  useEffect(() => {
    handlePropertyChange('border_style', borderStyle);
  }, [borderStyle]);

  const isValidHexColor = (hexColor) => {
    return /^#([0-9A-Fa-f]{3}){1,2}$/.test(hexColor);
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
              <label>Style:</label> {/* New label */}
              <div className="input-wrapper">
                <select
                  value={borderStyle}
                  onChange={(e) => setBorderStyle(e.target.value)}
                >
                  <option value="solid">Solid</option>
                  <option value="dotted">Dotted</option>
                  <option value="dashed">Dashed</option>
                  <option value="groove">Groove</option>
                  <option value="ridge">Ridge</option>
                </select>
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
