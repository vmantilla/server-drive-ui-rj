import React, { useState } from 'react';

const FontsTab = ({ themesData, setThemesData }) => {
  const { fonts } = themesData;
  const [inputValues, setInputValues] = useState(fonts);

  const handleFontValueChange = (event, fontKey, propertyKey) => {
    const newValue = event.target.value;

    // Verifica si el nuevo valor debería ser un número
    if (['size', 'lineHeight', 'letterSpacing', 'weight'].includes(propertyKey)) {
      const parsedValue = parseFloat(newValue);
      setInputValues(prevInputValues => ({
        ...prevInputValues,
        [fontKey]: {
          ...prevInputValues[fontKey],
          [propertyKey]: parsedValue,
        },
      }));
    } else {
      setInputValues(prevInputValues => ({
        ...prevInputValues,
        [fontKey]: {
          ...prevInputValues[fontKey],
          [propertyKey]: newValue,
        },
      }));
    }
  };

  const handleInputBlur = (fontKey) => {
    if (inputValues[fontKey]) {
      fonts[fontKey] = { ...inputValues[fontKey] };
      setThemesData({ ...themesData, fonts });
    }
  };

  return (
    <div className="row">
      {Object.entries(inputValues).map(([key, value]) => (
        <div key={key} className="col-3 mb-3">
          <div className="font-item">
            <div className="font-name">{key}</div>
            <div className="font-value">
              <label htmlFor={`${key}-name`} className="font-label">Name:</label>
              <input
                type="text"
                id={`${key}-name`}
                onChange={(event) => handleFontValueChange(event, key, 'name')}
                onBlur={() => handleInputBlur(key)}
                value={value.name}
                className="font-input"
              />
            </div>
            <div className="font-value">
              <label htmlFor={`${key}-size`} className="font-label">Size:</label>
              <input
                type="number"
                id={`${key}-size`}
                onChange={(event) => handleFontValueChange(event, key, 'size')}
                onBlur={() => handleInputBlur(key)}
                value={isNaN(value.size) ? '' : value.size}
                className="font-input"
              />
            </div>
            <div className="font-value">
              <label htmlFor={`${key}-lineHeight`} className="font-label">Line Height:</label>
              <input
                type="number"
                id={`${key}-lineHeight`}
                onChange={(event) => handleFontValueChange(event, key, 'lineHeight')}
                onBlur={() => handleInputBlur(key)}
                value={isNaN(value.lineHeight) ? '' : value.lineHeight}
                className="font-input"
              />
            </div>
            <div className="font-value">
              <label htmlFor={`${key}-letterSpacing`} className="font-label">Letter Spacing:</label>
              <input
                type="number"
                id={`${key}-letterSpacing`}
                onChange={(event) => handleFontValueChange(event, key, 'letterSpacing')}
                onBlur={() => handleInputBlur(key)}
                value={isNaN(value.letterSpacing) ? '' : value.letterSpacing}
                className="font-input"
              />
            </div>
            <div className="font-value">
              <label htmlFor={`${key}-weight`} className="font-label">Weight:</label>
              <input
                type="number"
                id={`${key}-weight`}
                onChange={(event) => handleFontValueChange(event, key, 'weight')}
                onBlur={() => handleInputBlur(key)}
                value={isNaN(value.weight) ? '' : value.weight}
                className="font-input"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};


export default FontsTab;
