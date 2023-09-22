import React, { useState, useEffect } from 'react';
import '../../../../css/Builder/Component/Properties/FooterProperties.css';

function FooterProperties({ property, handlePropertyChange }) {
  
  const [footerMode, setFooterMode] = useState(property.data.footerMode || 'normal');

  useEffect(() => {
    handlePropertyChange('footerMode', footerMode);
  }, [footerMode]);

  return (
    <div className="footer-properties">
      <div className="footer-properties-body">
        <div className="footer-properties-row">
          <div className="footer-property">
            <label>Footer Mode:</label>
            <div className="footer-property-input-wrapper">
              <select 
                value={footerMode} 
                onChange={(e) => setFooterMode(e.target.value)}>
                <option value="normal">Normal</option>
                <option value="floating">Floating</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FooterProperties;
