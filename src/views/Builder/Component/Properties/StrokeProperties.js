import React from 'react';
import '../../../../css/Builder/Component/Properties/StrokeProperties.css';

function StrokeProperties({ stroke, handlePropertyChange }) {
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
                  value={stroke.color}
                  onChange={(e) => handlePropertyChange('color', e.target.value)}
                />
                <input
                  type="text"
                  className="hex-code"
                  value={stroke.color}
                  onChange={(e) => handlePropertyChange('color', e.target.value)}
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
                  value={stroke.opacity}
                  onChange={(e) => handlePropertyChange('opacity', e.target.value)}
                />
              </div>
            </div>
            <div className="stroke-property">
              <label>Width:</label>
              <div className="input-wrapper">
                <input
                  type="number"
                  value={stroke.width}
                  onChange={(e) => handlePropertyChange('width', e.target.value)}
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
