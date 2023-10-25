import React, { useState, useEffect } from 'react';
import '../../../../css/Builder/Component/PropertiesFunction/ConditionalProperties.css';

function Condition({ condition, index, handleConditionChange, handleRemoveCondition }) {
    return (
        <div className="conditional-properties-row">
            <div className="conditional-property">
                <label>Condition {index + 1}</label>
                <div className="input-wrapper">
                    <select value={condition.type} onChange={(e) => handleConditionChange(index, 'type', e.target.value)}>
                        <option value="==">Equal to (==)</option>
                        <option value="!=">Not equal to (!=)</option>
                        <option value="!">NOT (!)</option>
                        {/* Add more operators as needed */}
                    </select>
                </div>
            </div>
            <div className="conditional-property">
                <label>Value:</label>
                <div className="input-wrapper">
                    <input
                        type="text"
                        value={condition.values[0]}
                        onChange={(e) => handleConditionChange(index, 'values', [e.target.value, condition.values[1]])}
                    />
                </div>
            </div>
            {condition.type !== "!" && (
                <div className="conditional-property">
                    <label>Value:</label>
                    <div className="input-wrapper">
                        <input
                            type="text"
                            value={condition.values[1]}
                            onChange={(e) => handleConditionChange(index, 'values', [condition.values[0], e.target.value])}
                        />
                    </div>
                </div>
            )}
            <button onClick={() => handleRemoveCondition(index)}>Remove</button>
        </div>
    );
}

function ConditionalProperties({ property, handlePropertyChange }) {
    const [conditions, setConditions] = useState(property.data.conditions || []);

    useEffect(() => {
        handlePropertyChange('conditions', conditions);
    }, [conditions]);

    const handleConditionChange = (index, key, value) => {
        const newConditions = [...conditions];
        if (key === 'type' && value === '!') {
            // If the type is changed to NOT, keep only the first value
            newConditions[index] = { ...newConditions[index], [key]: value, values: [newConditions[index].values[0]] };
        } else if (key === 'values' && newConditions[index].type === '!' && value.length > 1) {
            // If the type is NOT, and values are being updated, keep only the first value
            newConditions[index] = { ...newConditions[index], [key]: [value[0]] };
        } else {
            newConditions[index] = { ...newConditions[index], [key]: value };
        }
        setConditions(newConditions);
    };

    const handleRemoveCondition = (index) => {
        const newConditions = conditions.filter((_, i) => i !== index);
        setConditions(newConditions);
    };

    const handleAddCondition = () => {
        setConditions([...conditions, { type: "==", values: ["", ""] }]);
    };

    return (
        <div className="conditional-properties">
            {conditions.map((condition, index) => (
                <Condition
                    key={index}
                    index={index}
                    condition={condition}
                    handleConditionChange={handleConditionChange}
                    handleRemoveCondition={handleRemoveCondition}
                />
            ))}
            <button onClick={handleAddCondition}>Add Condition</button>
        </div>
    );
}

export default ConditionalProperties;
