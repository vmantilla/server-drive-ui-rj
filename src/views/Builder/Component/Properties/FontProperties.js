import React, { useState } from 'react';
import '../../../../css/Builder/Component/Properties/FontProperties.css';

function FontProperties() {
  const [fonts, setFonts] = useState([]);
  const states = ["enabled", "disabled", "hover"];

  const handleAddProperty = () => {
    const availableStates = states.filter(state => !fonts.some(font => font.state === state));
    if (availableStates.length > 0) {
      setFonts([...fonts, { state: availableStates[0], color: "#000000", opacity: 1, hexCode: "#000000" }]);
    }
  };

  const handleDeleteProperty = (index) => {
    const newFonts = fonts.slice();
    newFonts.splice(index, 1);
    setFonts(newFonts);
  };

  const handlePropertyChange = (index, property, value) => {
    const newFonts = fonts.slice();
    if (property === "opacity") {
      const newValue = Math.max(0, Math.min(1, parseFloat(value)));
      newFonts[index][property] = isNaN(newValue) ? 0 : newValue;
    } else if (property === "color") {
      newFonts[index][property] = value;
      newFonts[index]['hexCode'] = value;
    } else {
      newFonts[index][property] = value;
    }
    setFonts(newFonts);
  };

  return (
    <div className="font-properties">
      <header className="font-properties-header">
        <span className="font-title">Font</span>
        <button className="add-font-button font-title" onClick={handleAddProperty}>+</button>
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
              <button className="delete-font-button" onClick={() => handleDeleteProperty(index)}>-</button>
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FontProperties;
