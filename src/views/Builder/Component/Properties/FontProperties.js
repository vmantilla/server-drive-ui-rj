import React, { useState, useEffect } from 'react';
import '../../../../css/Builder/Component/Properties/FontProperties.css';

function FontProperties({ property, handlePropertyChange }) {

  const [isItalic, setIsItalic] = useState(property ? property.italic || false : false);
  const [isStrikethrough, setIsStrikethrough] = useState(property ? property.strikethrough || false : false);
  const [isUnderline, setIsUnderline] = useState(property ? property.underline || false : false);

  const [colorInput, setColorInput] = useState(property.color || "#000000");
  const [opacityInput, setOpacityInput] = useState(property.opacity || "1");
  const [sizeInput, setSizeInput] = useState(property.size || "16");

  useEffect(() => {
    handlePropertyChange('color', colorInput);
  }, [colorInput]);

  useEffect(() => {
    const opacity = parseFloat(opacityInput);
    if (opacity >= 0 && opacity <= 1) {
      handlePropertyChange('opacity', opacityInput);
    }
  }, [opacityInput]);

  useEffect(() => {
    const size = parseFloat(sizeInput);
    if (size > 0) {
      handlePropertyChange('size', sizeInput);
    }
  }, [sizeInput]);

  const handleStyleToggle = (styleName) => {
    let newValue = false;

    switch (styleName) {
      case 'italic':
        newValue = !isItalic;
        setIsItalic(newValue);
        break;
      case 'strikethrough':
        newValue = !isStrikethrough;
        setIsStrikethrough(newValue);
        break;
      case 'underline':
        newValue = !isUnderline;
        setIsUnderline(newValue);
        break;
      default:
        return;
    }

    handlePropertyChange(styleName, newValue);
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
                <select value={property.name || "Arial"} onChange={(e) => handlePropertyChange('name', e.target.value)}>
                  {fontNames.map((name) => <option key={name} value={name}>{name}</option>)}
                </select>
              </div>
            </div>
            <div className="font-property">
              <label>Weight:</label>
              <div className="input-wrapper">
                <select value={property.weight || "normal"} onChange={(e) => handlePropertyChange('weight', e.target.value)}>
                  {fontWeights.map((weight) => <option key={weight} value={weight.toLowerCase()}>{weight}</option>)}
                </select>
              </div>
            </div>
            <div className="font-property">
              <label>Size:</label>
              <div className="input-wrapper">
                <input
                  type="number"
                  value={sizeInput}
                  onChange={(e) => setSizeInput(e.target.value)}
                  pattern="\d+(\.\d+)?"
                />
              </div>
            </div>
            <div className="font-property">
              <label>Line Height:</label>
              <div className="input-wrapper">
                <input
                  type="number"
                  value={property.lineHeight || "1.5"}
                  onChange={(e) => handlePropertyChange('lineHeight', e.target.value)}
                  pattern="\d+(\.\d+)?"
                />
              </div>
            </div>
            <div className="font-property">
              <label>Spacing:</label>
              <div className="input-wrapper">
                <input
                  type="number"
                  value={property.letterSpacing || "1"}
                  onChange={(e) => handlePropertyChange('letterSpacing', e.target.value)}
                  pattern="\d+(\.\d+)?"
                />
              </div>
            </div>
            <div className="font-property">
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
                  value={opacityInput}
                  onChange={(e) => setOpacityInput(e.target.value)}
                  pattern="\d+(\.\d{1})?"
                />
              </div>
            </div>
            <div className="font-property">
              <label>Style:</label>
              <div className="input-wrapper font-style-buttons">
                 <button className={`font-style-button ${isItalic ? 'selected' : ''}`} onClick={() => handleStyleToggle('italic')}><i className="bi bi-type-italic"></i></button>
                <button className={`font-style-button ${isStrikethrough ? 'selected' : ''}`} onClick={() => handleStyleToggle('strikethrough')}><i className="bi bi-type-strikethrough"></i></button>
                <button className={`font-style-button ${isUnderline ? 'selected' : ''}`} onClick={() => handleStyleToggle('underline')}><i className="bi bi-type-underline"></i></button>
             </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FontProperties;
