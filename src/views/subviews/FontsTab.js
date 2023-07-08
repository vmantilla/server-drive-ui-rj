import React from 'react';

const FontsTab = ({ themesData, setThemesData }) => {
  const { colors, fonts } = themesData;

  const handleFontValueChange = (event, fontKey, propertyKey) => {
    const newValue = event.target.value;

    // Verifica si el nuevo valor debería ser un número
    if (['size', 'lineHeight', 'letterSpacing', 'weight'].includes(propertyKey)) {
      const parsedValue = parseFloat(newValue);
      setThemesData(prevThemesData => ({
        ...prevThemesData,
        fonts: {
          ...prevThemesData.fonts,
          [fontKey]: {
            ...prevThemesData.fonts[fontKey],
            [propertyKey]: parsedValue,
          },
        },
      }));
    } else {
      setThemesData(prevThemesData => ({
        ...prevThemesData,
        fonts: {
          ...prevThemesData.fonts,
          [fontKey]: {
            ...prevThemesData.fonts[fontKey],
            [propertyKey]: newValue,
          },
        },
      }));
    }
  };

  
  return (
  	<div className="row">
    {Object.entries(fonts).map(([key, value]) => (
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
              value={value.size}
              className="font-input"
            />
          </div>
          <div className="font-value">
            <label htmlFor={`${key}-lineHeight`} className="font-label">Line Height:</label>
            <input
              type="number"
              id={`${key}-lineHeight`}
              onChange={(event) => handleFontValueChange(event, key, 'lineHeight')}
              value={value.lineHeight}
              className="font-input"
            />
          </div>
          <div className="font-value">
            <label htmlFor={`${key}-letterSpacing`} className="font-label">Letter Spacing:</label>
            <input
              type="number"
              id={`${key}-letterSpacing`}
              onChange={(event) => handleFontValueChange(event, key, 'letterSpacing')}
              value={value.letterSpacing}
              className="font-input"
            />
          </div>
          <div className="font-value">
            <label htmlFor={`${key}-weight`} className="font-label">Weight:</label>
            <input
              type="number"
              id={`${key}-weight`}
              onChange={(event) => handleFontValueChange(event, key, 'weight')}
              value={value.weight}
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
