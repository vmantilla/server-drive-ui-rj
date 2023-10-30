import React, { useState, useEffect } from 'react';
import '../../../../css/Builder/Component/PropertiesFunction/LoopProperties.css';
import ConditionalProperties from './ConditionalProperties';

function LoopProperties({ property, handlePropertyChange }) {
    const [loop, setLoop] = useState(property && property.data ? property.data.loop : {});

    useEffect(() => {
        handlePropertyChange('loop', loop);
    }, [loop]);

    const handleLoopChange = (key, value) => {
	    setLoop({
	        ...loop,
	        [key]: value
	    });
	};

	const handleLoopConditionChange = (newConditions) => {
	    setLoop({
	        ...loop,
	        conditions: newConditions
	    });
	};

    return (
        <div className="loop-properties">
            <div className="conditional-properties-header">
                <span className="title">Loop Type</span>
                <select 
                    value={loop.type} 
                    onChange={(e) => handleLoopChange('type', e.target.value)}
                >
                    <option value="for">For</option>
                    <option value="while">While</option>
                    <option value="do-while">Do While</option>
                    <option value="for-each">For Each</option>
                </select>
            </div>

            {loop.type === 'for' && (
                <div className="conditional-properties-body">
                    <div className="loop-property">
                        <label>Initial Value:</label>
                        <input type="text" value={loop.initialValue} onChange={(e) => handleLoopChange('initialValue', e.target.value)} />
                    </div>

                    <div className="loop-property">
                        <label>Iteration:</label>
                        <input type="text" value={loop.iteration} onChange={(e) => handleLoopChange('iteration', e.target.value)} />
                    </div>
                </div>
            )}

            {loop.type === 'for-each' && (
                <div className="conditional-properties-body">
                    <div className="loop-property">
                        <label>Element:</label>
                        <input type="text" value={loop.element} onChange={(e) => handleLoopChange('element', e.target.value)} />
                    </div>
                    
                    <div className="loop-property">
                        <label>Collection:</label>
                        <input type="text" value={loop.collection} onChange={(e) => handleLoopChange('collection', e.target.value)} />
                    </div>
                </div>
            )}

            <div className="conditional-properties-header">
                <span className="title">Condition</span>
            </div>
            <div className="conditional-properties-body">
                <div className="loop-property">
                <label>Condition:</label>
                <ConditionalProperties
                    property={{ data: { conditions: loop.conditions ?? [] } }}
                    handlePropertyChange={handleLoopConditionChange}
                />
            </div>
            </div>
        </div>
    );
}

export default LoopProperties;
