import React, { useState } from 'react';
import '../../../../css/Builder/Component/Properties/StrokeProperties.css';

function StrokeProperties() {
  const [strokes, setStrokes] = useState([]);
  const [color, setColor] = useState("#000000");
  const [width, setWidth] = useState(1);
  const [opacity, setOpacity] = useState(1);
  const states = ["enabled", "disabled", "hover"];

  const handleAddProperty = () => {
    const availableStates = states.filter(state => !strokes.some(stroke => stroke.state === state));
    if (availableStates.length > 0) {
      setStrokes([...strokes, { state: availableStates[0], color: "#000000", width, opacity }]);
    }
  };

  const handleDeleteProperty = (index) => {
    const newStrokes = strokes.slice();
    newStrokes.splice(index, 1);
    setStrokes(newStrokes);
  };

  const handlePropertyChange = (index, property, value) => {
    const newStrokes = strokes.slice();
    if (property === "opacity") {
      const newValue = Math.max(0, Math.min(1, parseFloat(value)));
      newStrokes[index][property] = isNaN(newValue) ? 0 : newValue;
    } else if (property === "width") {
      newStrokes[index][property] = Math.max(0, parseInt(value, 10));
    } else {
      newStrokes[index][property] = value;
    }
    setStrokes(newStrokes);
  };

  return (
    <div className="stroke-properties">
      <header className="stroke-properties-header">
        <span className="stroke-title">Stroke</span>
        <button className="add-stroke-button stroke-title" onClick={handleAddProperty}>+</button>
      </header>
      <div className="stroke-properties-body">
        {strokes.map((stroke, index) => (
          <div className="stroke-block" key={index}>
            <div className="stroke-mini-header">
              <select className="mini-header-dropdown" value={stroke.state} onChange={(e) => handlePropertyChange(index, 'state', e.target.value)}>
                {states.filter(state => !strokes.some(s => s.state === state) || stroke.state === state).map(state => (
                  <option value={state} key={state}>{state.charAt(0).toUpperCase() + state.slice(1)}</option>
                ))}
              </select>
              <button className="delete-stroke-button" onClick={() => handleDeleteProperty(index)}>-</button>
            </div>
            <div className="stroke-properties-row">
              <div className="stroke-property">
                <label>Color:</label>
                <input type="color" value={stroke.color} onChange={(e) => handlePropertyChange(index, 'color', e.target.value)} />
              </div>
              <div className="stroke-property">
                <label>Opacity:</label>
                <input type="number" step="0.1" min="0" max="1" value={stroke.opacity} onChange={(e) => handlePropertyChange(index, 'opacity', e.target.value)} />
              </div>
              <div className="stroke-property">
                <label>Width:</label>
                <input type="number" value={stroke.width} onChange={(e) => handlePropertyChange(index, 'width', e.target.value)} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StrokeProperties;
