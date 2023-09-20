import React, { useState, useEffect } from 'react';
import '../../css/Wizard/TemplateConfiguration.css';

const TemplateConfiguration = ({ selectedTemplate, configuration, setConfiguration }) => {
  const [selectedDeviceTypes, setSelectedDeviceTypes] = useState(() => {
    const initialSelectedDeviceTypes = new Map();
    for (const platform of configuration.selectedPlatform) {
      initialSelectedDeviceTypes.set(platform.name, new Set());
    }
    return initialSelectedDeviceTypes;
  });

  useEffect(() => {
    const newSelectedDeviceTypes = new Map();
    for (const platform of configuration.selectedPlatform) {
      const moduleName = 'Dispositivos';
      const deviceType = platform.name;

      if (!newSelectedDeviceTypes.has(moduleName)) {
        newSelectedDeviceTypes.set(moduleName, new Set());
      }
      newSelectedDeviceTypes.get(moduleName).add(deviceType);
    }
    setSelectedDeviceTypes(newSelectedDeviceTypes);
  }, [configuration.selectedPlatform]);

  const [modules, setModules] = useState([
    {
      title: 'Dispositivos',
      isMultiple: true,
      items: [
        { name: 'Web', icon: 'laptop' },
        { name: 'iOS', icon: 'apple' },
        { name: 'Android', icon: 'android2' },
      ],
    },
  ]);

  const handleDeviceTypeToggle = (moduleName, deviceType) => {
    const updatedSelectedDeviceTypes = new Map(selectedDeviceTypes);
    const module = updatedSelectedDeviceTypes.get(moduleName);

    if (!module) {
      updatedSelectedDeviceTypes.set(moduleName, new Set([deviceType]));
    } else {
      if (module.has(deviceType)) {
        module.delete(deviceType);
      } else {
        if (!modules.find((m) => m.title === moduleName).isMultiple) {
          module.clear();
        }
        module.add(deviceType);
      }
    }

    setSelectedDeviceTypes(updatedSelectedDeviceTypes);

    const selectedPlatformsArray = [];
    for (const [moduleName, selectedTypes] of updatedSelectedDeviceTypes) {
      for (const selectedType of selectedTypes) {
        const platformObject = modules.find(module => module.title === moduleName)?.items.find(item => item.name === selectedType);
        if (platformObject) {
          selectedPlatformsArray.push(platformObject);
        }
      }
    }

    setConfiguration({
      ...configuration,
      selectedPlatform: selectedPlatformsArray,
      projectName: configuration.projectName,
    });
  };

  const handleProjectNameChange = (event) => {
    setConfiguration({
      ...configuration,
      projectName: event.target.value,
    });
  };

  return (
    <div className="configuration-container">
      <div className="project-name">
        <label>Nombre del Proyecto:</label>
        <input
          type="text"
          value={configuration.projectName}
          onChange={handleProjectNameChange}
        />
      </div>
      {modules.map((module, index) => (
        <div key={index}>
          <div className="api-title">{module.title}</div>
          <div className="device-grid">
            {module.items.map((item, itemIndex) => (
              <div
                className={`device-item ${
                  selectedDeviceTypes.has(module.title) &&
                  selectedDeviceTypes.get(module.title).has(item.name)
                    ? 'selected'
                    : ''
                }`}
                onClick={() => handleDeviceTypeToggle(module.title, item.name)}
                key={itemIndex}
              >
                <i className={`bi bi-${item.icon} fa-2x`}></i>
                <p>{item.name}</p>
                {selectedDeviceTypes.has(module.title) &&
                  selectedDeviceTypes.get(module.title).has(item.name) && (
                    <i className="bi bi-check-circle check-icon"></i>
                  )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TemplateConfiguration;
