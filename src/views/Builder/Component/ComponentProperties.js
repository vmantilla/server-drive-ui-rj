import React, { useState } from 'react';
import '../../../css/Builder/Component/ComponentProperties.css';
import StrokeProperties from './Properties/StrokeProperties';
import FontProperties from './Properties/FontProperties';

function ComponentProperties({ isPropertiesOpen, setIsPropertiesOpen }) {
  return (
    <div className="component-properties">
	  <div className="component-properties-header">
	    <h2 className="component-properties-title" style={{ color: "#292929" }}>Propiedades</h2>
	    <button className="component-properties-close" onClick={() => setIsPropertiesOpen(false)}>
	      <i className="bi bi-x"></i>
	    </button>
	  </div>
	  <div className="component-properties-content">
	  	<FontProperties/> 
	    <StrokeProperties/>
	    <StrokeProperties/>
	    <StrokeProperties/>
	  </div>
	</div>
  );
}

export default ComponentProperties;
