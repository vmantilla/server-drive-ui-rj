import React, { useState, useEffect } from 'react';
import '../../../../css/Builder/Component/PropertiesFunction/LoopProperties.css';
import ConditionalProperties from './ConditionalProperties';

function LoopProperties({ property, handlePropertyChange }) {
    const isValidProperty = prop => property && property.data && property.data[prop] !== undefined && property.data[prop] !== null;

    const [type, setType] = useState(isValidProperty('type') ? property.data.type : "for");
    const [initialization, setInitialization] = useState(isValidProperty('initialization') ? property.data.initialization : "");
    const [increment, setIncrement] = useState(isValidProperty('increment') ? property.data.increment : "");
    const [conditions, setConditions] = useState(isValidProperty('conditions') ? property.data.conditions : []);
    const [item, setItem] = useState(isValidProperty('item') ? property.data.item : "");
    const [index, setIndex] = useState(isValidProperty('index') ? property.data.index : "");
    const [collection, setCollection] = useState(isValidProperty('collection') ? property.data.collection : "");

    useEffect(() => {
        handlePropertyChange('item', item);
    }, [item]);

    useEffect(() => {
        handlePropertyChange('index', index);
    }, [index]);

    useEffect(() => {
        handlePropertyChange('collection', collection);
    }, [collection]);
    
    useEffect(() => {
        handlePropertyChange('type', type);
    }, [type]);

    useEffect(() => {
        handlePropertyChange('initialization', initialization);
    }, [initialization]);

    useEffect(() => {
        handlePropertyChange('increment', increment);
    }, [increment]);

    useEffect(() => {
        handlePropertyChange('conditions', conditions);
    }, [conditions]);

    return (
        <div className="loop-properties">
            <div className="loop-properties-body">
                
            <div className="loop-property">
                <label>Loop Type:</label>
                <div className="loop-input-wrapper">
                <select value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="for">For</option>
                    <option value="forEach">For Each</option>
                    <option value="while">While</option>
                    <option value="doWhile">Do While</option>
                </select>
                </div>
            </div>

            {type === "for" && (
                <>
                    <div className="loop-property">
                        <label>Initialization:</label>
                        <div className="loop-input-wrapper">
                            <input
                                type="text"
                                value={initialization}
                                onChange={(e) => setInitialization(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="loop-property">
                        <label>Increment:</label>
                        <div className="loop-input-wrapper">
                            <input
                                type="text"
                                value={increment}
                                onChange={(e) => setIncrement(e.target.value)}
                            />
                        </div>
                    </div>
                </>
            )}

            { (type === 'forEach') && (
                <>
                    <div className="loop-property">
                        <label>Item:</label>
                        <div className="loop-input-wrapper">
                            <input 
                                type="text" 
                                value={item} 
                                onChange={(e) => setItem(e.target.value)} 
                            />
                        </div>
                    </div>

                    <div className="loop-property">
                        <label>Index:</label>
                        <div className="loop-input-wrapper">
                            <input 
                                type="text" 
                                value={index} 
                                onChange={(e) => setIndex(e.target.value)} 
                            />
                        </div>
                    </div>

                    <div className="loop-property">
                        <label>Collection:</label>
                        <div className="loop-input-wrapper">
                            <input 
                                type="text" 
                                value={collection} 
                                onChange={(e) => setCollection(e.target.value)} 
                            />
                        </div>
                    </div>
                </>
            )}
            
            <div className="loop-conditions-header">
               Conditional Properties
            </div>

            <ConditionalProperties
                property={{ data: { conditions } }}
                handlePropertyChange={(key, value) => setConditions(value)}
            />
        </div>
        </div>
    );
}

export default LoopProperties;
