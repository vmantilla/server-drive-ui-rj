import React, { useState } from 'react';

const FontsTab = ({ themesData, setThemesData }) => {
  const { fonts } = themesData;
  const [inputValues, setInputValues] = useState(fonts);

const handleFontValueChange = (event, fontKey, propertyKey) => {
    let newValue = event.target.value;

    // Verifica si el nuevo valor debería ser un número
    if (['size', 'lineHeight', 'letterSpacing', 'weight'].includes(propertyKey)) {
      let parsedValue = parseFloat(newValue);
      
      setInputValues(prevInputValues => {
        const updatedValues = {
          ...prevInputValues,
          [fontKey]: {
            ...prevInputValues[fontKey],
            [propertyKey]: parsedValue,
          },
        };

        // Actualizar themesData inmediatamente después de setInputValues
        fonts[fontKey] = { ...updatedValues[fontKey] };
        setThemesData({ ...themesData, fonts });

        return updatedValues;
      });
    } else {
      setInputValues(prevInputValues => {
        const updatedValues = {
          ...prevInputValues,
          [fontKey]: {
            ...prevInputValues[fontKey],
            [propertyKey]: newValue,
          },
        };

        // Actualizar themesData inmediatamente después de setInputValues
        fonts[fontKey] = { ...updatedValues[fontKey] };
        setThemesData({ ...themesData, fonts });

        return updatedValues;
      });
    }
  };

const handleInputBlur = (event, fontKey, propertyKey) => {
  let newValue = event.target.value;

  if (['size', 'lineHeight', 'letterSpacing', 'weight'].includes(propertyKey)) {
    let parsedValue = parseFloat(newValue);
    if (isNaN(parsedValue) || parsedValue < 0) parsedValue = 0;

    setInputValues(prevInputValues => {
      const updatedValues = {
        ...prevInputValues,
        [fontKey]: {
          ...prevInputValues[fontKey],
          [propertyKey]: parsedValue,
        },
      };

      fonts[fontKey] = { ...updatedValues[fontKey] };
      setThemesData({ ...themesData, fonts });

      return updatedValues;
    });
  } else {
    if (inputValues[fontKey]) {
      fonts[fontKey] = { ...inputValues[fontKey] };
      setThemesData({ ...themesData, fonts });

      // Update state to trigger re-render and ensure UI reflects changes
      setInputValues(prevInputValues => ({
        ...prevInputValues,
        [fontKey]: {
          ...fonts[fontKey],
        },
      }));
    }
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
                onBlur={(event) => handleInputBlur(event, key, 'size')}
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
                onBlur={(event) => handleInputBlur(event, key, 'lineHeight')}
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
                onBlur={(event) => handleInputBlur(event, key, 'letterSpacing')}
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
                onBlur={(event) => handleInputBlur(event, key, 'weight')}
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
