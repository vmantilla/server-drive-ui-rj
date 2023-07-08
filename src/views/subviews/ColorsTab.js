import React, { useState, useRef } from 'react';

const ColorsTab = ({ themesData }) => {
  const { colors, fonts } = themesData;
  const [editingColor, setEditingColor] = useState(null);
  const [showInfo, setShowInfo] = useState(null);
  const [inputValues, setInputValues] = useState(colors);

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

  const handleInputFocus = (event, colorKey) => {
    event.stopPropagation();
    setEditingColor(colorKey);
  };

  const handleColorValueChange = (event, colorKey) => {
    setInputValues((prevInputValues) => ({
      ...prevInputValues,
      [colorKey]: { value: event.target.value },
    }));
  };

  const handleInputBlur = (colorKey) => {
    setEditingColor(null);
    if (inputValues[colorKey]) {
      colors[colorKey].value = inputValues[colorKey].value;
    }
  };

  const handleInputKeyPress = (event, colorKey) => {
    if (event.key === 'Enter') {
      setEditingColor(null);
      if (inputValues[colorKey]) {
        colors[colorKey].value = inputValues[colorKey].value;
      }
    }
  };
  return (
    
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
                        <div className="color-content" style={{ position: 'relative' }}>
                          <div className="color-title">{key}</div>
                          <div
                            className="color-swatch"
                            style={{
                              backgroundColor: value.value,
                              width: '80px',
                              height: '80px',
                              border: '1px solid #DDD',
                              borderRadius: '50%',
                              position: 'relative',
                            }}
                            onClick={(event) => handleSwatchClick(key, event)}
                          />
                          {editingColor === key ? (
                            <input
                              type="text"
                              value={inputValues[key]?.value || ''}
                              onChange={(event) => handleColorValueChange(event, key)}
                              onFocus={(event) => handleInputFocus(event, key)}
                              onBlur={() => handleInputBlur(key)}
                              onKeyPress={(event) => handleInputKeyPress(event, key)}
                              style={{
                                width: '80px',
                                height: '20px',
                                border: `1px solid #DDD`,
                                position: 'relative',
                                backgroundColor: 'transparent',
                                borderRadius: '4px',
                                textAlign: 'center',
                                color: '#000',
                              }}
                            />
                          ) : (
                            <div
                              className="color-value"
                              onClick={(event) => handleInputFocus(event, key)} style={{
                                width: '80px',
                                height: '24px',
                                position: 'relative',
                                backgroundColor: 'transparent',
                                textAlign: 'center',
                                color: '#000',
                              }}
                            >
                              {value.value}
                            </div>
                          )}
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
                            <div className="message-close" onClick={() => setShowInfo(null)}>
                              X
                            </div>
                            <div className="message-text">Valor del color: {key}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              );
};

export default ColorsTab;