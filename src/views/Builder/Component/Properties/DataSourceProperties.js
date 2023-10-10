import React, { useState } from 'react';

import '../../../../css/Builder/Component/Properties/DataSourceProperties.css';

function DataSourceProperties({ property, handlePropertyChange }) {

    const [dataSourceType, setDataSourceType] = useState(property?.type || "apiRest");
    
    const handleChange = (name, value) => {
        handlePropertyChange(name, value);
    }

    const handleJsonChange = (name, value) => {
    try {
        handleChange(name, JSON.parse(value));
    } catch (err) {
        console.error("Failed to parse JSON:", err);
    }
}

    return (
        <div className="datasource-properties">
            <div className="datasource-properties-body">
                <div className="datasource-block">
                    <div className="datasource-properties-row">
                        <div className="datasource-property">
                            <label>Type:</label>
                            <div className="input-datasource-wrapper">
                                <select value={dataSourceType} onChange={(e) => setDataSourceType(e.target.value)}>
                                	<option value="apiRest">Rest API</option>
                                    <option value="file">File</option>
                                    <option value="webSocket">WebSocket</option>
                                    <option value="graphQL">GraphQL</option>
                                    <option value="firebase">Firebase</option>
                                    <option value="bluetooth">Bluetooth</option>
                                    <option value="userInput">User Input</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    {dataSourceType === 'file' && (
                        <div>
                            <div className="datasource-property">
                                <label>Source:</label>
                                <div className="input-datasource-wrapper datasource-style-buttons">
                                    <input type="radio" name="fileType" value="local" onChange={(e) => handleChange('filePath', e.target.value)} /> Local
                                    <input type="radio" name="fileType" value="remoto" onChange={(e) => handleChange('fileURL', e.target.value)} /> Remoto
                                </div>
                            </div>
                            <div className="datasource-property">
                                <label>Path:</label>
                                <div className="input-datasource-wrapper">
                                    <input type="text" value={property?.filePath || property?.fileURL || ""} onChange={(e) => handleChange(dataSourceType === 'local' ? 'filePath' : 'fileURL', e.target.value)} />
                                </div>
                            </div>
                            <div className="datasource-property">
                                <label>Format:</label>
                                <div className="input-datasource-wrapper">
                                    <select value={property?.fileFormat || ""} onChange={(e) => handleChange('fileFormat', e.target.value)}>
                                        <option value="json">JSON</option>
                                        <option value="csv">CSV</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}
                    {dataSourceType === 'webSocket' && (
                        <div className="datasource-property">
                            <label>Socket URL:</label>
                            <div className="input-datasource-wrapper">
                                <input type="text" value={property?.socketURL || ""} onChange={(e) => handleChange('socketURL', e.target.value)} />
                            </div>
                        </div>
                    )}
                    {dataSourceType === 'graphQL' && (
					    <div>
					        <div className="datasource-property">
					            <label>Endpoint:</label>
					            <div className="input-datasource-wrapper">
					                <input type="text" value={property?.endpoint || ""} onChange={(e) => handleChange('endpoint', e.target.value)} />
					            </div>
					        </div>
					        <div className="datasource-property">
					            <label>Query:</label>
					            <div className="input-datasource-wrapper">
					                <textarea value={property?.query || ""} onChange={(e) => handleChange('query', e.target.value)} />
					            </div>
					        </div>
					        <div className="datasource-property">
					            <label>Authorization Header:</label>
					            <div className="input-datasource-wrapper">
					                <input type="text" value={property?.headers?.Authorization || ""} onChange={(e) => handleChange('headers', { ...property.headers, Authorization: e.target.value })} />
					            </div>
					        </div>
					    </div>
					)}
					{dataSourceType === 'firebase' && (
					    <div>
					        <div className="datasource-property">
					            <label>Database URL:</label>
					            <div className="input-datasource-wrapper">
					                <input type="text" value={property?.databaseURL || ""} onChange={(e) => handleChange('databaseURL', e.target.value)} />
					            </div>
					        </div>
					        <div className="datasource-property">
					            <label>Path:</label>
					            <div className="input-datasource-wrapper">
					                <input type="text" value={property?.path || ""} onChange={(e) => handleChange('path', e.target.value)} />
					            </div>
					        </div>
					        <div className="datasource-property">
					            <label>Auth Token:</label>
					            <div className="input-datasource-wrapper">
					                <input type="text" value={property?.authToken || ""} onChange={(e) => handleChange('authToken', e.target.value)} />
					            </div>
					        </div>
					    </div>
					)}
					{dataSourceType === 'bluetooth' && (
					    <div>
					        <div className="datasource-property">
					            <label>Device Identifier:</label>
					            <div className="input-datasource-wrapper">
					                <input type="text" value={property?.deviceIdentifier || ""} onChange={(e) => handleChange('deviceIdentifier', e.target.value)} />
					            </div>
					        </div>
					        <div className="datasource-property">
					            <label>Service UUID:</label>
					            <div className="input-datasource-wrapper">
					                <input type="text" value={property?.serviceUUID || ""} onChange={(e) => handleChange('serviceUUID', e.target.value)} />
					            </div>
					        </div>
					        <div className="datasource-property">
					            <label>Characteristic UUID:</label>
					            <div className="input-datasource-wrapper">
					                <input type="text" value={property?.characteristicUUID || ""} onChange={(e) => handleChange('characteristicUUID', e.target.value)} />
					            </div>
					        </div>
					    </div>
					)}
					{dataSourceType === 'userInput' && (
					    <div>
					        <div className="datasource-property">
					            <label>Input Type:</label>
					            <div className="input-datasource-wrapper">
					                <select value={property?.inputType || ""} onChange={(e) => handleChange('inputType', e.target.value)}>
					                    <option value="text">Text</option>
					                    <option value="password">Password</option>
					                    <option value="number">Number</option>
					                    <option value="email">Email</option>
					                </select>
					            </div>
					        </div>
					        <div className="datasource-property">
					            <label>Placeholder:</label>
					            <div className="input-datasource-wrapper">
					                <input type="text" value={property?.placeholder || ""} onChange={(e) => handleChange('placeholder', e.target.value)} />
					            </div>
					        </div>
					        <div className="datasource-property">
					            <label>Default Value:</label>
					            <div className="input-datasource-wrapper">
					                <input type="text" value={property?.defaultValue || ""} onChange={(e) => handleChange('defaultValue', e.target.value)} />
					            </div>
					        </div>
					    </div>
					)}
					{dataSourceType === 'apiRest' && (
					    <div>
					    	<div className="datasource-property">
					            <label>Base Url:</label>
					            <div className="input-datasource-wrapper">
					                <input type="text" value={property?.baseurl || ""} onChange={(e) => handleChange('baseurl', e.target.value)} />
					            </div>
					        </div>
					        <div className="datasource-property">
					            <label>Path:</label>
					            <div className="input-datasource-wrapper">
					                <input type="text" value={property?.endpoint || ""} onChange={(e) => handleChange('endpoint', e.target.value)} />
					            </div>
					        </div>
					        <div className="datasource-property">
					            <label>Method:</label>
					            <div className="input-datasource-wrapper">
					                <select value={property?.method || "GET"} onChange={(e) => handleChange('method', e.target.value)}>
					                    <option value="GET">GET</option>
									    <option value="POST">POST</option>
									    <option value="PUT">PUT</option>
									    <option value="DELETE">DELETE</option>
									    <option value="PATCH">PATCH</option>
									    <option value="HEAD">HEAD</option>
									    <option value="OPTIONS">OPTIONS</option>
									    <option value="CONNECT">CONNECT</option>
									    <option value="TRACE">TRACE</option>
					                </select>
					            </div>
					        </div>
					        <div className="datasource-property">
					            <label>Headers (JSON format):</label>
					            <div className="input-datasource-wrapper">
					                <textarea value={JSON.stringify(property?.headers || {})} onChange={(e) => handleJsonChange('headers', JSON.parse(e.target.value))} />
					            </div>
					        </div>
					        <div className="datasource-property">
					            <label>Body (JSON format):</label>
					            <div className="input-datasource-wrapper">
					                <textarea value={JSON.stringify(property?.body || {})} onChange={(e) => handleJsonChange('body', JSON.parse(e.target.value))} />
					            </div>
					        </div>
					    </div>
					)}

                </div>
            </div>
        </div>
    );
}

export default DataSourceProperties;
