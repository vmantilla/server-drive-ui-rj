import React, { useState } from 'react';
import TemplateWizard from './TemplateWizard';
import TemplateSelection from './TemplateSelection';
import TemplateViews from './TemplateViews';

const steps = [TemplateWizard, TemplateSelection, TemplateViews];

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

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    handleNext(); // Avanza al siguiente paso
  };

  const CurrentStepComponent = steps[currentStep];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          {currentStep > 0 && (
            <button onClick={handleBack}>Atrás</button>
          )}
        </div>
        <div>
          {currentStep < steps.length - 1 && (
            <button onClick={handleNext}>Siguiente</button>
          )}
        </div>
      </div>

      <div>
        <CurrentStepComponent onSelect={handleTemplateSelect} />
      </div>
    </div>
  );
};

export default ProjectWizard;
