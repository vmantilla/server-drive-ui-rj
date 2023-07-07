import React, { useState, useRef } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import { CompactPicker } from 'react-color';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/ColorsAndFontsView.css';
import Preview from './Preview';

const ColorsAndFontsView = ({ themesData }) => {
  const { colors, fonts } = themesData;
  const [editingColor, setEditingColor] = useState(null);
  const [showInfo, setShowInfo] = useState(null);
  const infoButtonRefs = useRef({});

  const getButtonPosition = (colorKey) => {
    const buttonRect = infoButtonRefs.current[colorKey]?.getBoundingClientRect();
    return {
      top: buttonRect ? buttonRect.top : 0,
      left: buttonRect ? buttonRect.left : 0,
    };
  };

  const handleSwatchClick = (colorKey, event) => {
    event.stopPropagation();
    setEditingColor(colorKey);
  };

  const handleInfoButtonClick = (colorKey, event) => {
    event.stopPropagation();
    setShowInfo(showInfo === colorKey ? null : colorKey);
  };

  const handleColorChange = (color) => {
    colors[editingColor].value = color.hex;
    setEditingColor(null);
  };

  const handleCloseColorPicker = (event) => {
    event.stopPropagation();
    setEditingColor(null);
    setShowInfo(null);
  };

  return (
    <div className="container" onClick={handleCloseColorPicker}>
      <div className="row">
        <div className="col-8">
          <Tabs defaultActiveKey="colors" id="uncontrolled-tab-example">
            <Tab eventKey="colors" title="Colores">
              <div className="row">
                {Object.entries(colors).map(([key, value]) => (
                  <div key={key} className="col-3 mb-3">
                    <div className="color-item">
              <div className="color-label">
                <div
                  className="info-button rounded-circle bg-yellow"
                  onClick={(event) => handleInfoButtonClick(key, event)} 
                  ref={(ref) => {
                    infoButtonRefs.current[key] = ref;
                  }}
                >
                  i
                </div>
                <div className="color-content">
                  <div className="color-title">{key}</div>
                  <div
                    className="color-swatch"
                    style={{
                      backgroundColor: value.value,
                      width: '80px',
                      height: '80px',
                      border: '1px solid #000',
                      borderRadius: '50%',
                      position: 'relative',
                    }}
                    onClick={(event) => handleSwatchClick(key, event)} 
                  />
                  <div className="color-value">{value.value}</div>
                </div>
              </div>
              {showInfo === key && (
                <div
                  className="floating-message"
                  style={{
                    top: `${getButtonPosition(key).top}px`,
                    left: `${getButtonPosition(key).left}px`,
                  }}
                >
                  <div className="message-content">
                    <div className="message-close" onClick={(event) => setShowInfo(null)}>
                      X
                    </div>
                    <div className="message-text">
                      Valor del color: {key}
                    </div>
                  </div>
                </div>
              )}
            </div>
                  </div>
                ))}
              </div>
            </Tab>
            <Tab eventKey="fonts" title="Fuentes">
              <div className="row">
                {Object.entries(fonts).map(([key, value]) => (
                  <div key={key} className="col-3 mb-3">
                    <div className="font-item">
                      <div className="font-name">{key}</div>
                      <div className="font-value">{value.name}</div>
                      <div className="font-value">{value.size}</div>
                      <div className="font-value">{value.lineHeight}</div>
                      <div className="font-value">{value.letterSpacing}</div>
                      <div className="font-value">{value.weight}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Tab>
          </Tabs>
          {editingColor && (
            <div
              style={{
                position: 'absolute',
                top: `${getButtonPosition(editingColor).top}px`,
                left: `${getButtonPosition(editingColor).left}px`,
                zIndex: 9999,
                padding: '10px',
                backgroundColor: '#fff',
                borderRadius: '4px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                maxWidth: '300px',
              }}
            >
              <div style={{ position: 'relative' }}>
                <button 
                  onClick={handleCloseColorPicker}
                  className="close-button"
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    borderColor: '#000',
                    backgroundColor: '#fff',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderStyle: 'none',
                    cursor: 'pointer',
                  }}
                >
                  X
                </button>
                <CompactPicker
                  color={colors[editingColor].value}
                  onChange={handleColorChange}
                />
              </div>
            </div>
          )}
        </div>

        <div className="col-4">
          <Preview />
        </div>
      </div>
    </div>
  );
};

export default ColorsAndFontsView;
