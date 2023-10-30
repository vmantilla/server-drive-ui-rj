import React, { useState, useEffect } from 'react';
import '../../../../css/Builder/Component/PropertiesFunction/ConditionalProperties.css';


function LogicOperator({ index, condition, handleConditionChange, handleRemoveCondition }) {
    return (
        index !== 0 && condition.logic && (
            <div className="conditional-property-mini-header">
                <select 
                    className="conditional-mini-header-dropdown" 
                    value={condition.logic}
                    onChange={(e) => handleConditionChange(index, 'logic', e.target.value)}
                >
                    <option value="AND">AND</option>
                    <option value="OR">OR</option>
                    <option value="AND_NOT">AND NOT (!)</option>
                    <option value="OR_NOT">OR NOT (!)</option>
                </select>
                <button className="conditional-delete-property-button" onClick={() => handleRemoveCondition(index)}>-</button>
            </div>
        )
    );
}

function ConditionOrGroup({ condition, index, handleConditionChange, handleRemoveCondition }) {
    return (
        <React.Fragment key={index}>
            <LogicOperator 
                index={index}
                condition={condition}
                handleConditionChange={handleConditionChange} 
                handleRemoveCondition={handleRemoveCondition}
            />
            {condition.conditions ? (
                <Group 
                    index={index} 
                    group={condition} 
                    handleGroupChange={handleConditionChange} 
                    handleRemoveGroup={handleRemoveCondition} 
                />
            ) : (
                <Condition 
                    index={index} 
                    condition={condition} 
                    handleConditionChange={handleConditionChange} 
                    handleRemoveCondition={handleRemoveCondition}
                />
            )}
        </React.Fragment>
    );
}

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
        const newCondition = conditions.length > 0 
            ? { logic: "AND", operator: "==", "left": "", "right": "" } 
            : { operator: "==", "left": "", "right": "" };

        setConditions([...conditions, newCondition]);
    };

    const handleAddGroup = () => {
        const newGroup = conditions.length > 0 
            ? { logic: "AND", conditions: [] } 
            : { conditions: [] };

        setConditions([...conditions, newGroup]);
    };

    return (
        <div className="conditional-group" style={{ border: '1px solid #000', padding: '10px', marginBottom: '10px' }}>
            {conditions.map((condition, condIndex) => (
                <ConditionOrGroup
                    key={condIndex}
                    condition={condition}
                    index={condIndex}
                    handleConditionChange={handleConditionChange}
                    handleRemoveCondition={handleRemoveCondition}
                />
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
                                onChange={(e) => handleConditionChange(index, 'left', e.target.value)}
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
                            onChange={(e) => handleConditionChange(index, 'right', e.target.value)}
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

    const handleAddConditionOrGroup = (isGroup) => {
        let newConditionOrGroup;
        
        if (isGroup) {
            newConditionOrGroup = conditions.length > 0 
                ? { logic: "AND", conditions: [] }
                : { conditions: [] };
        } else {
            newConditionOrGroup = conditions.length > 0 
                ? { logic: "AND", operator: "==", "left": "", "right": "" }
                : { operator: "==", "left": "", "right": "" };
        }
        
        setConditions([...conditions, newConditionOrGroup]);
    };

    return (
        <div className="conditional-properties">
            {conditions.map((condition, index) => 
                <ConditionOrGroup 
                    key={index}
                    condition={condition}
                    index={index}
                    handleConditionChange={handleConditionChange} 
                    handleRemoveCondition={handleRemoveCondition}
                />
            )}
            <button className="conditional-add-button" onClick={() => handleAddConditionOrGroup(false)}>Add Condition</button>
            <button className="conditional-add-button" onClick={() => handleAddConditionOrGroup(true)}>Add Group</button>
        </div>
    );
}

export default ConditionalProperties;
