import React from 'react';

const SDTextView = ({ component, children }) => {
  const font = component.properties.font?.fontValue();
  const color = component.properties.font?.colorValue();

  const alignmentType = component.properties.textAlignment?.alignment || 'leading';

  return (
    <div>
      <span style={{ color, font }}>{component.properties.text || ''}</span>
      {children}
    </div>
  );
};

export default SDTextView;
