import React, { useState } from 'react';
import '../../css/Wizard/ProjectWizard.css'; 
import TemplateWizard from './TemplateWizard';
import TemplateSelection from './TemplateSelection';
import TemplateViews from './TemplateViews';

const steps = [TemplateWizard, TemplateSelection, TemplateViews];

const stepTitles = [
  "Explora Plantillas para tu Proyecto",
  "2 An application in Okta represents an integration with the software you're building. Choose your platform, and we'll recommend settings on the next step.",
  "3 An application in Okta represents an integration with the software you're building. Choose your platform, and we'll recommend settings on the next step.",
  // Agrega los títulos correspondientes a cada paso aquí
];

const ProjectWizard = () => {
  const [currentStep, setCurrentStep] = useState(0); // Controla el paso actual del asistente
  const [selectedTemplate, setSelectedTemplate] = useState(null); // Almacena la plantilla seleccionada

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Has alcanzado el último paso, puedes realizar alguna acción o finalizar el asistente
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      // Estás en el primer paso, puedes manejar esto según tus necesidades
    }
  };

  const handleCancel = () => {
    // Agrega lógica para cancelar el wizard o redirigir a otra página
  };

  const handleFinish = () => {
    // Agrega lógica para cancelar el wizard o redirigir a otra página
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
  };

  const CurrentStepComponent = steps[currentStep];

  return (
    <div className="dashboard">
      <div className="stepper-header">
        <h2>Nuevo Proyecto</h2>
        <div className="stepper">
          {steps.map((step, index) => (
            <div key={index} className={`step ${index === currentStep ? 'active' : ''}`}>
              <div className="step-circle">{index + 1}</div>
              <div className="step-title">Paso {index + 1}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="step-description">
        {stepTitles[currentStep]}
      </div>
      <div className="step-content">
        <CurrentStepComponent onSelect={handleTemplateSelect} />
      </div>
      <div className="button-container">
        <div>
          {currentStep > 0 && (
            <button className="active" onClick={handleBack}>Atrás</button>
          )}
          {currentStep > 0 && (
            <button className="space"></button>
          )}
          <button className="cancel" onClick={handleCancel}>Cancelar</button>
        </div>
        <div>
          {currentStep < steps.length - 1 && (
            <button className="active" onClick={handleNext}>Siguiente</button>
          )}
          {currentStep === steps.length - 1 && (
            <button className="finish" onClick={handleFinish}>Finalizar</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectWizard;
