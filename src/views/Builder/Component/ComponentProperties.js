import React, { useState } from 'react';
import '../../../css/Builder/Component/ComponentProperties.css';

function ComponentProperties({ isPropertiesOpen, setIsPropertiesOpen }) {
  return (
    <div className="component-properties-header">
        <h2 className="component-properties-title">Propiedades</h2>
        <button className="component-properties-close" onClick={() => setIsPropertiesOpen(false)}>
          <i className="bi bi-x"></i>
        </button>
      </div>
  );
}

export default ComponentProperties;
