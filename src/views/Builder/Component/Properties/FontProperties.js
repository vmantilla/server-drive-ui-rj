import React, { useState, useEffect } from 'react';
import '../../../../css/Builder/Component/Properties/FontProperties.css';

function FontProperties({ property, handlePropertyChange }) {

  const [isItalic, setIsItalic] = useState(property.data.italic || false);
  const [isStrikethrough, setIsStrikethrough] = useState(property.data.strikethrough || false);
  const [isUnderline, setIsUnderline] = useState(property.data.underline || false);

  const [colorInput, setColorInput] = useState(property.data.color || "#000000");
  const [opacityInput, setOpacityInput] = useState(property.data.opacity || "1");
  const [sizeInput, setSizeInput] = useState(property.data.size || "16");
  const [lineHeightInput, setLineHeightInput] = useState(property.data.lineHeight || "1.5");
  const [letterSpacingInput, setLetterSpacingInput] = useState(property.data.letterSpacing || "2");

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
    const lineHeight = parseFloat(lineHeightInput);
    if (lineHeight >= 0 && lineHeight <= 1.5) {
      handlePropertyChange('lineHeight', lineHeightInput);
    }
  }, [lineHeightInput]);


  useEffect(() => {
    const letterSpacing = parseFloat(letterSpacingInput);
    if (letterSpacing >= 0 && letterSpacing <= 1) {
      handlePropertyChange('letterSpacing', letterSpacingInput);
    }
  }, [letterSpacingInput]);

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
                <select value={property.data.name || "Arial"} onChange={(e) => handlePropertyChange('name', e.target.value)}>
                  {fontNames.map((name) => <option key={name} value={name}>{name}</option>)}
                </select>
              </div>
            </div>
            <div className="font-property">
              <label>Weight:</label>
              <div className="input-wrapper">
                <select value={property.data.weight || "normal"} onChange={(e) => handlePropertyChange('weight', e.target.value)}>
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
                  step="0.1"
                  min="0"
                  max="1,5"
                  value={lineHeightInput || "1.5"}
                  onChange={(e) => setLineHeightInput(e.target.value)}
                  pattern="\d+(\.\d+)?"
                />
              </div>
            </div>
            <div className="font-property">
              <label>Spacing:</label>
              <div className="input-wrapper">
                <input
                  type="number"
                  value={letterSpacingInput || "1"}
                  step="0.1"
                  min="0"
                  max="1"
                  onChange={(e) => setLetterSpacingInput(e.target.value)}
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
