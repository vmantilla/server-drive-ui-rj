import React, { useState, useEffect } from 'react';
import '../../../../css/Builder/Component/PropertiesFunction/ConditionalProperties.css';

function Group({ group, index, handleGroupChange, handleRemoveGroup }) {
    const [conditions, setConditions] = useState(group.conditions || []);

    useEffect(() => {
        handleGroupChange(index, 'conditions', conditions);
    }, [conditions]);

    const handleConditionChange = (condIndex, key, value) => {
        const newConditions = [...conditions];
        newConditions[condIndex] = { ...newConditions[condIndex], [key]: value };
        setConditions(newConditions);
    };

    const handleRemoveCondition = (condIndex) => {
        const newConditions = conditions.filter((_, i) => i !== condIndex);
        setConditions(newConditions);
    };

    const handleAddCondition = () => {
        if (conditions.length === 0) {
            setConditions([{ operator: "AND", conditions: [{ operator: "==", values: ["", ""] }] }]);
        } else {
            setConditions([...conditions, { operator: "==", values: ["", ""] }]);
        }
    };

    return (
        <div className="conditional-group" style={{ border: '1px solid #000', padding: '10px', marginBottom: '10px' }}>
            <div className="conditional-group-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            </div>
            <ConditionalProperties 
                conditions={conditions} 
                handleConditionsChange={setConditions} 
                handleConditionChange={handleConditionChange}
                handleRemoveCondition={handleRemoveCondition}
                handleAddCondition={handleAddCondition}
            />
        </div>
    );
}

function Condition({ condition, index, handleConditionChange, handleRemoveCondition }) {
    return (
        <div className="conditional-properties">
            <div className="conditional-properties-body">
                
                {/* Renderizar el campo "Left Value" solo si el operador no es "NOT (!)" */}
                {condition.operator !== 'NOT' && (
                    <div className="conditional-property">
                        <label>Left Value:</label>
                        <div className="conditional-input-wrapper">
                            <input
                                type="text"
                                value={condition.values[0]}
                                onChange={(e) => handleConditionChange(index, 'values', [e.target.value, condition.values[1]])}
                            />
                        </div>
                    </div>
                )}

                <div className="conditional-property">
                    <label>Operator:</label>
                    <div className="conditional-input-wrapper">
                        <select 
                            value={condition.operator} 
                            onChange={(e) => handleConditionChange(index, 'operator', e.target.value)} 
                        >
                            <option value="==">Equal to (==)</option>
                            <option value="!=">Not equal to (!=)</option>
                            <option value=">">Greater than (&gt;)</option>
                            <option value="<">Less than (&lt;)</option>
                            <option value=">=">Greater than or equal to (&gt;=)</option>
                            <option value="<=">Less than or equal to (&lt;=)</option>
                            <option value="NOT">NOT (!)</option> {/* Asegúrese de agregar esta opción */}
                        </select>
                    </div>
                </div>
                <div className="conditional-property">
                    <label>Right Value:</label>
                    <div className="conditional-input-wrapper">
                        <input
                            type="text"
                            value={condition.values[1]}
                            onChange={(e) => handleConditionChange(index, 'values', [condition.values[0], e.target.value])}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}


function ConditionalProperties({ property, handlePropertyChange }) {
    const [conditions, setConditions] = useState(
        property && property.data && property.data.conditions ? property.data.conditions : []
    );

    useEffect(() => {
        if (typeof handlePropertyChange === 'function') {
        handlePropertyChange('conditions', conditions);
    }
    }, [conditions, handlePropertyChange]);

    const handleConditionChange = (index, key, value) => {
        const newConditions = [...conditions];
        newConditions[index] = { ...newConditions[index], [key]: value };
        setConditions(newConditions);
    };

    const handleRemoveCondition = (index) => {
        const newConditions = conditions.filter((_, i) => i !== index);
        setConditions(newConditions);
    };

    const handleAddCondition = () => {
        setConditions([...conditions, { operator: "==", values: ["", ""] }]);
    };

     const handleAddGroup = () => {
        setConditions([...conditions, { operator: "AND", conditions: [] }]);
    };

    return (
        <div className="conditional-properties">
            {conditions.map((condition, index) => 
                <>
                    {index !== 0 && (
                        <div className="conditional-property-mini-header">
                            <select 
                                className="conditional-mini-header-dropdown" 
                                onChange={(e) => {/* Tu función de manejo aquí */}} 
                            >
                                <option value="AND">AND</option>
                                <option value="OR">OR</option>
                                <option value="AND_NOT">AND NOT (!)</option>
                                <option value="OR_NOT">OR NOT (!)</option>
                            </select>
                            <button className="conditional-delete-property-button" onClick={() => handleRemoveCondition(index)}>-</button>
                        </div>
                    )}

                    {condition.conditions ? (
                        <Group 
                            key={index} 
                            index={index} 
                            group={condition} 
                            handleGroupChange={handleConditionChange} 
                            handleRemoveGroup={handleRemoveCondition} 
                        />
                    ) : (
                        <Condition 
                            key={index} 
                            index={index} 
                            condition={condition} 
                            handleConditionChange={handleConditionChange} 
                            handleRemoveCondition={handleRemoveCondition}
                        />
                    )}
                </>
            )}
            <button className="conditional-add-button" onClick={handleAddCondition}>Add Condition</button>
            <button className="conditional-add-button" onClick={handleAddGroup}>Add Group</button>
        </div>
    );
}

export default ConditionalProperties;
