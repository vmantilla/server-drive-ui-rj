import React, { useState, useEffect } from 'react';
import '../../css/Wizard/TemplateConfiguration.css';

const TemplateConfiguration = ({ selectedTemplate, configuration, setConfiguration }) => {
  // Inicializa selectedDeviceTypes con la información de configuration
  const [selectedDeviceTypes, setSelectedDeviceTypes] = useState(() => {
    const initialSelectedDeviceTypes = new Map();
    for (const platform of configuration.selectedPlatform) {
      initialSelectedDeviceTypes.set(platform, new Set());
    }
    return initialSelectedDeviceTypes;
  });

  const [modules, setModules] = useState([
    {
      title: 'Dispositivos',
      isMultiple: true, // Permite selección múltiple
      items: [
        { name: 'Web', icon: 'laptop' },
        { name: 'iOS', icon: 'apple' },
        { name: 'Android', icon: 'android2' },
        //{ name: 'Smart TV', icon: 'tv' },
      ],
    },
    /*{
      title: 'Servidor',
      isMultiple: false, 
      items: [
        { name: 'Incluir API', icon: 'gear' }
      ],
    },*/
  ]);

  const handleDeviceTypeToggle = (moduleName, deviceType) => {
    const updatedSelectedDeviceTypes = new Map(selectedDeviceTypes);
    const module = updatedSelectedDeviceTypes.get(moduleName);

    if (!module) {
      // Crear un nuevo conjunto para este módulo si no existe
      updatedSelectedDeviceTypes.set(moduleName, new Set([deviceType]));
    } else {
      if (module.has(deviceType)) {
        module.delete(deviceType);
      } else {
        if (!modules.find((m) => m.title === moduleName).isMultiple) {
          // Si no se permite selección múltiple, limpiar el conjunto antes de agregar uno nuevo
          module.clear();
        }
        module.add(deviceType);
      }
    }

    setSelectedDeviceTypes(updatedSelectedDeviceTypes);

    // Actualiza la configuración
    setConfiguration({
      ...configuration,
      selectedPlatform: [...updatedSelectedDeviceTypes.keys()], // Cambia 'platform' a 'selectedPlatform'
      projectName: configuration.projectName, // Mantén el nombre del proyecto
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
