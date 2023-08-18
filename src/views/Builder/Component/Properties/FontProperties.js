import React, { useState } from 'react';
import '../../../../css/Builder/Component/Properties/FontProperties.css';

function FontProperties() {
  const [fonts, setFonts] = useState([]);
  const [selectedStyles, setSelectedStyles] = useState({italic: false, strikethrough: false, underline: false});
  const states = ["enabled", "disabled", "hover"];

  const handleAddFont = () => {
    const availableStates = states.filter(state => !fonts.some(font => font.state === state));
    if (availableStates.length > 0) {
      setFonts([...fonts, { state: availableStates[0], color: "#000000", opacity: 1, size: 9, lineHeight: 16, letterSpacing: 0.5, weight: 500 }]);
    }
  };

  const handleDeleteFont = (index) => {
    const newFonts = fonts.slice();
    newFonts.splice(index, 1);
    setFonts(newFonts);
  };

  const handlePropertyChange = (index, property, value) => {
    const newFonts = fonts.slice();
    if (property === "opacity") {
      const newValue = Math.max(0, Math.min(1, parseFloat(value)));
      newFonts[index][property] = isNaN(newValue) ? 0 : newValue;
    } else {
      newFonts[index][property] = value;
    }
    setFonts(newFonts);
  };

  const handleStyleToggle = (style) => {
    setSelectedStyles({...selectedStyles, [style]: !selectedStyles[style]});
  };

  const fontNames = ["Arial", "Roboto", "Helvetica", "Tahoma", "Verdana", "Times New Roman", "Georgia", "Garamond"];
  const fontWeights = ["Regular", "Bold", "Medium", "Semi-Bold", "Light", "Extra-Light"];

  return (
    <div className="font-properties">
      <header className="font-properties-header">
        <span className="font-title">Font</span>
        <button className="add-font-button font-title" onClick={handleAddFont}>+</button>
      </header>
      <div className="font-properties-body">
        {fonts.map((font, index) => (
          <div className="font-block" key={index}>
            <div className="font-mini-header">
              <select className="mini-header-dropdown" value={font.state} onChange={(e) => handlePropertyChange(index, 'state', e.target.value)}>
                {states.filter(state => !fonts.some(f => f.state === state) || font.state === state).map(state => (
                  <option value={state} key={state}>{state.charAt(0).toUpperCase() + state.slice(1)}</option>
                ))}
              </select>
              <button className="delete-font-button" onClick={() => handleDeleteFont(index)}>-</button>
            </div>
            <div className="font-properties-row">
              <div className="font-property">
                <label>Name:</label>
                <div className="input-wrapper">
                  <select value={font.name} onChange={(e) => handlePropertyChange(index, 'name', e.target.value)}>
                    {fontNames.map(name => (
                      <option value={name} key={name}>{name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="font-property">
                <label>Weight:</label>
                <div className="input-wrapper">
                  <select value={font.weight} onChange={(e) => handlePropertyChange(index, 'weight', e.target.value)}>
                    {fontWeights.map(weight => (
                      <option value={weight} key={weight}>{weight}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="font-property">
                <label>Size:</label>
                <div className="input-wrapper">
                  <input type="number" value={font.size} onChange={(e) => handlePropertyChange(index, 'size', e.target.value)} />
                </div>
              </div>
              <div className="font-property">
                <label>Line Height:</label>
                <div className="input-wrapper">
                  <input type="number" value={font.lineHeight} onChange={(e) => handlePropertyChange(index, 'lineHeight', e.target.value)} />
                </div>
              </div>
              <div className="font-property">
                <label>Spacing:</label>
                <div className="input-wrapper">
                  <input type="number" value={font.letterSpacing} onChange={(e) => handlePropertyChange(index, 'letterSpacing', e.target.value)} />
                </div>
              </div>
            </div>
            <div className="font-properties-row">
              <div className="font-property">
                <label>Color:</label>
                <div className="color-input">
                  <input type="color" value={font.color} onChange={(e) => handlePropertyChange(index, 'color', e.target.value)} />
                  <input type="text" className="hex-code" value={font.color} onChange={(e) => handlePropertyChange(index, 'color', e.target.value)} />
                </div>
              </div>
              <div className="font-property">
                <label>Opacity:</label>
                <div className="input-wrapper">
                  <input type="number" step="0.1" min="0" max="1" value={font.opacity} onChange={(e) => handlePropertyChange(index, 'opacity', e.target.value)} />
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
        ))}
      </div>
    </div>
  );
}

export default FontProperties;
