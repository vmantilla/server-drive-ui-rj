import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0); 
  const [selectedTemplate, setSelectedTemplate] = useState(null); 
  const [modules, setModules] = useState([]);
  const [configuration, setConfiguration] = useState({
    selectedPlatform: [], 
    projectName: '',
  });

  const isFinishDisabled = configuration.selectedPlatform.length === 0 || !configuration.projectName.trim();

  useEffect(() => {
    // Realiza la solicitud a la API para obtener los módulos
    fetchTemplates()
      .then((data) => {
        setModules(data);
        if (data.length > 0 && data[0].template_views.length > 0) {
          console.log("setSelectedTemplate", data[0].template_views[0]);
          setSelectedTemplate(data[0].template_views[0]);
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
    navigate('/dashboard'); 
  };

  useEffect(() => {
    if (selectedTemplate) {
      setConfiguration({
        selectedPlatform: [],
        projectName: selectedTemplate.name,
      });
    } else {
      setConfiguration({
        selectedPlatform: [],
        projectName: "New Proyect", 
      });
    }
  }, [selectedTemplate]);
    
  const handleFinish = async () => {

    console.log("configuration", configuration);

    try {
      if (!configuration.projectName.trim()) {
        return;
      }

      const newProjectData = {
        title: configuration.projectName,
        selected_platforms: configuration.selectedPlatform.map(p => p.name).join(","),
        description: ""
      };

      const newProject = await addProjectToAPI(newProjectData); 
      navigate(`/builder/${newProject.id}`);
      
    } catch (error) {
      navigate('/dashboard');
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
          configuration={configuration}
          setConfiguration={setConfiguration}
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
            <button className={`finish ${isFinishDisabled ? 'button-disabled' : ''}`} 
             onClick={handleFinish} disabled={isFinishDisabled}>Finalizar</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectWizard;
