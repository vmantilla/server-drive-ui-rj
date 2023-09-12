import React from 'react';

import '../../css/Wizard/TemplateWizard.css';

const TemplateWizard = ({ onSelect }) => {
  const templates = [
    {
      title: "Plantillas de Blog",
      views: ["Vista 1", "Vista 2", "Vista 3"]
    },
    {
      title: "Plantillas de Tienda",
      views: ["Vista 1", "Vista 2", "Vista 3"]
    }
  ];

  return (
    <div className="template-container">
      {templates.map((templateGroup, index) => (
        <div key={index}>
          <div className="title">{templateGroup.title}</div>
          <div className="grid-container">
            {templateGroup.views.map((view, i) => (
              <div className="grid-item" key={i} onClick={() => onSelect(view)}>
                <img src="https://via.placeholder.com/150" alt={`${view}`} />
                <span>{view}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TemplateWizard;
