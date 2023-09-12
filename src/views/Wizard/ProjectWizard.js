import React, { useState } from 'react';
import TemplateSelection from './TemplateSelection';  // Asegúrate de que la ruta de importación sea la correcta

// Este es el componente principal del asistente
const ProjectWizard = () => {
  const [currentStep, setCurrentStep] = useState('templateSelection'); // Controla el paso actual del asistente
  const [selectedTemplate, setSelectedTemplate] = useState(null); // Almacena la plantilla seleccionada

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setCurrentStep('generalConfiguration'); // Avanza al siguiente paso
  };

  return (
    <div>
      {currentStep === 'templateSelection' && (
        <TemplateSelection onSelect={handleTemplateSelect} />
      )}

      {currentStep === 'generalConfiguration' && (
        <div>
          <h2>Configuración General</h2>
          <p>Plantilla seleccionada: {selectedTemplate}</p>
          {/* Aquí podría ir la lógica para la configuración general */}
        </div>
      )}

      {/* Aquí podrías añadir más pasos según tus necesidades */}
    </div>
  );
};

export default ProjectWizard;
