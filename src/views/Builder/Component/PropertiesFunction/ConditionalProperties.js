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
        setConditions([...conditions, { logic: "AND", operator: "==", "left": "", "right": "" }]);
    };

    const handleAddGroup = () => {
        setConditions([...conditions, { logic: "AND", conditions: [] }]);
    };

    return (
        <div className="conditional-group" style={{ border: '1px solid #000', padding: '10px', marginBottom: '10px' }}>
            {conditions.map((condition, condIndex) => (
                <React.Fragment key={condIndex}>
                    {condIndex !== 0 && condition.logic && (
                        <div className="conditional-property-mini-header">
                            <select 
                                className="conditional-mini-header-dropdown" 
                                value={condition.logic}
                                onChange={(e) => handleConditionChange(condIndex, 'logic', e.target.value)}
                            >
                                <option value="AND">AND</option>
                                <option value="OR">OR</option>
                                <option value="AND_NOT">AND NOT (!)</option>
                                <option value="OR_NOT">OR NOT (!)</option>
                            </select>
                            <button className="conditional-delete-property-button" onClick={() => handleRemoveCondition(condIndex)}>-</button>
                        </div>
                    )}
                    {condition.conditions ? (
                        <Group 
                            index={condIndex} 
                            group={condition} 
                            handleGroupChange={handleConditionChange} 
                            handleRemoveGroup={handleRemoveCondition} 
                        />
                    ) : (
                        <Condition 
                            index={condIndex} 
                            condition={condition} 
                            handleConditionChange={handleConditionChange} 
                            handleRemoveCondition={handleRemoveCondition}
                        />
                    )}
                </React.Fragment>
            ))}
            <button className="conditional-add-button" onClick={handleAddCondition}>Add Condition</button>
            <button className="conditional-add-button" onClick={handleAddGroup}>Add Group</button>
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
                                value={condition.left}
                                onChange={(e) => handleConditionChange(index, 'values', [e.target.value, condition.right])}
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
                            value={condition.right}
                            onChange={(e) => handleConditionChange(index, 'values', [condition.left, e.target.value])}
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
        setConditions([...conditions, { logic: "AND", operator: "==", "left": "", "right": "" }]);
    };

     const handleAddGroup = () => {
        setConditions([...conditions, { logic: "AND", conditions: [] }]);
    };

   return (
        <div className="conditional-properties">
            {conditions.map((condition, index) => 
                <React.Fragment key={index}> {/* Añadiendo key al fragmento */}
                    {index !== 0 && condition.logic && (
                        <div className="conditional-property-mini-header">
                            <select 
                                className="conditional-mini-header-dropdown" 
                                value={condition.logic} // Asegurarse de que el valor mostrado sea condition.logic
                                onChange={(e) => handleConditionChange(index, 'logic', e.target.value)} // Actualiza el valor de logic en el estado
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
                </React.Fragment>
            )}
            <button className="conditional-add-button" onClick={handleAddCondition}>Add Condition</button>
            <button className="conditional-add-button" onClick={handleAddGroup}>Add Group</button>
        </div>
    );
}

export default ConditionalProperties;
