import React, { useState  } from 'react';

import '../../css/Wizard/TemplateWizard.css';

const TemplateWizard = ({ modules, selectedTemplate, setSelectedTemplate }) => {
  

  const handleDeviceTypeToggle = (template) => {
    setSelectedTemplate(template);
  };

  return (
    <div className="configuration-container">
      {modules && modules.map((module, index) => (
        <div key={index}>
          <div className="api-title">{module.title}</div>
          <div className="device-grid">
            {module.template_views.map((item, itemIndex) => (
              <div
                className={`device-item ${
                  selectedTemplate && selectedTemplate.id === item.id ? 'selected' : ''
                }`}
                onClick={() => handleDeviceTypeToggle(item)}
                key={itemIndex}
              >
                <i className={`bi bi-layout-wtf fa-2x`}></i>
                <p>{item.name}</p>
                {selectedTemplate && selectedTemplate.id === item.id && (
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

export default TemplateWizard;
