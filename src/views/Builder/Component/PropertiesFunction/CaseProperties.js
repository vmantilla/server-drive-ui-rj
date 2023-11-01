import React, { useState, useEffect } from 'react';
import '../../../../css/Builder/Component/PropertiesFunction/CaseProperties.css';

function CaseProperties({ property, handlePropertyChange }) {
    const conditionTypes = ["Equals", "Not Equals", "Greater Than", "Less Than", "Range"];
    
    const [conditionType, setConditionType] = useState(property.conditionType || '');
    const [rangeMin, setRangeMin] = useState(property.rangeMin || '');
    const [rangeMax, setRangeMax] = useState(property.rangeMax || '');
    const [value, setValue] = useState(property.value || '');

    useEffect(() => {
        handlePropertyChange('conditionType', conditionType);
        handlePropertyChange('rangeMin', rangeMin);
        handlePropertyChange('rangeMax', rangeMax);
        handlePropertyChange('value', value);
    }, [conditionType, rangeMin, rangeMax, value]);

    return (
        <div className="case-properties">
            <div className="case-property">
                <label>Condition Type:</label>
                <div className="case-input-wrapper">
                    <select 
                        value={conditionType} 
                        onChange={(e) => setConditionType(e.target.value)}>
                        {conditionTypes.map(type => (
                            <option value={type} key={type}>{type}</option>
                        ))}
                    </select>
                </div>
            </div>

            {conditionType === "Range" ? (
                <div className="case-property">
                    <label>Range:</label>
                    <div className="case-input-wrapper">
                        <input
                            type="text"
                            placeholder="Min"
                            value={rangeMin}
                            onChange={(e) => setRangeMin(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Max"
                            value={rangeMax}
                            onChange={(e) => setRangeMax(e.target.value)}
                        />
                    </div>
                </div>
            ) : (
                <div className="case-property">
                    <label>Value:</label>
                    <div className="case-input-wrapper">
                        <input
                            type="text"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default CaseProperties;
