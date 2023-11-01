import React from 'react';
import '../../../../css/Builder/Component/PropertiesFunction/SwitchCaseProperties.css';

function SwitchCaseProperties({ property, handlePropertyChange }) {
    return (
        <div className="switch-case-properties">
            <div className="case-property">
                <label>Variable de entrada:</label>
                <div className="case-input-wrapper">
                    <input 
                        type="text"
                        value={property?.data?.inputVar || ''}
                        onChange={(e) => handlePropertyChange('inputVar', e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
}

export default SwitchCaseProperties;
