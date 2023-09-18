import React, { useState, useEffect } from 'react';
import '../../css/Wizard/ProjectWizard.css'; 
import TemplateWizard from './TemplateWizard';
import TemplatePreview from './TemplatePreview';
import TemplateConfiguration from './TemplateConfiguration';
import { fetchTemplates, addProjectToAPI } from '../api.js'; 

const steps = [TemplateWizard, TemplatePreview, TemplateConfiguration];

const stepTitles = [
  "Explora Plantillas para tu Proyecto",
  "Vista Previa de Plantillas Disponibles",
  "Configura Tu Proyecto",
  // Agrega los títulos correspondientes a cada paso aquí
];

const ProjectWizard = () => {
  const [currentStep, setCurrentStep] = useState(0); // Controla el paso actual del asistente
  const [selectedTemplate, setSelectedTemplate] = useState(null); // Almacena la plantilla seleccionada
  const [modules, setModules] = useState([]);
  const [configuration, setConfiguration] = useState({
    selectedPlatform: [], // Almacena las plataformas seleccionadas
    projectName: 'Mi Proyecto', // Establece el nombre del proyecto predeterminado
  });

  useEffect(() => {
    // Realiza la solicitud a la API para obtener los módulos
    fetchTemplates()
      .then((data) => {
        setModules(data);
        if (data.length > 0) {
          setSelectedTemplate(data[0]);
        }
      })
      .catch((error) => {
        console.error('Error al cargar los módulos:', error);
      });
  }, []);

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

  const handleFinish = async () => {

    try {
      if (!configuration.projectName.trim()) {
        return;
      }

      const newProjectData = {
        title: configuration.projectName,
        image_url: null,
        description: ""
      };

console.log("handleFinish", newProjectData)
      const newProject = await addProjectToAPI(newProjectData); 
      
    } catch (error) {
      
    }
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
        <CurrentStepComponent
          modules={modules}
          setSelectedTemplate={setSelectedTemplate}
          selectedTemplate={selectedTemplate}
          configuration={configuration} // Pasa la configuración completa
          setConfiguration={setConfiguration} // Función para actualizar la configuración
        />
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
