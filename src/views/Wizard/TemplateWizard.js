import React, { useState } from 'react';
import '../../css/Wizard/TemplateWizard.css';

const TemplateWizard = ({ onSelect }) => {

  const [selectedTemplate, setSelectedTemplate] = useState(null);

const templates = [
  {
    title: "Plantillas Básicas",
    views: [
      { name: "Proyecto en Blanco", description: "Plantilla en blanco para empezar desde cero.", thumbnail: "https://via.placeholder.com/100" },
      { name: "Tabulador", description: "Plantilla con un diseño de pestañas para organizar contenido.", thumbnail: "https://via.placeholder.com/100" },
      { name: "Tablet", description: "Descripción de Tablet", thumbnail: "https://via.placeholder.com/100" },
      { name: "Juego", description: "Descripción de Juego", thumbnail: "https://via.placeholder.com/100" }
    ]
  },
  {
    title: "Medios y Contenido",
    views: [
      { name: "Blog", description: "Descripción de Blog", thumbnail: "https://via.placeholder.com/100" },
      { name: "Noticias", description: "Descripción de Noticias", thumbnail: "https://via.placeholder.com/100" },
      { name: "Biblioteca Digital", description: "Descripción de Biblioteca Digital", thumbnail: "https://via.placeholder.com/100" },
      { name: "Streaming", description: "Descripción de Streaming", thumbnail: "https://via.placeholder.com/100" }
    ]
  },
  {
    title: "Comercio",
    views: [
      { name: "Tienda en Línea", description: "Descripción de Tienda en Línea", thumbnail: "https://via.placeholder.com/100" },
      { name: "Reserva de Eventos", description: "Descripción de Reserva de Eventos", thumbnail: "https://via.placeholder.com/100" },
      { name: "Servicio de Entrega", description: "Descripción de Servicio de Entrega", thumbnail: "https://via.placeholder.com/100" },
      { name: "Restaurante", description: "Descripción de Restaurante", thumbnail: "https://via.placeholder.com/100" }
    ]
  },
  {
    title: "Social",
    views: [
      { name: "Red Social", description: "Descripción de Red Social", thumbnail: "https://via.placeholder.com/100" },
      { name: "Foro", description: "Descripción de Foro", thumbnail: "https://via.placeholder.com/100" },
      { name: "ONG", description: "Descripción de ONG", thumbnail: "https://via.placeholder.com/100" },
      { name: "Crowdfunding", description: "Descripción de Crowdfunding", thumbnail: "https://via.placeholder.com/100" }
    ]
  },
  {
    title: "Corporativo",
    views: [
      { name: "Empresa", description: "Descripción de Empresa", thumbnail: "https://via.placeholder.com/100" },
      { name: "Consultoría", description: "Descripción de Consultoría", thumbnail: "https://via.placeholder.com/100" },
      { name: "Portafolio", description: "Descripción de Portafolio", thumbnail: "https://via.placeholder.com/100" },
      { name: "Legal", description: "Descripción de Legal", thumbnail: "https://via.placeholder.com/100" },
      { name: "Startup", description: "Descripción de Startup", thumbnail: "https://via.placeholder.com/100" },
      { name: "Inversión", description: "Descripción de Inversión", thumbnail: "https://via.placeholder.com/100" },
      { name: "Suscripción", description: "Descripción de Suscripción", thumbnail: "https://via.placeholder.com/100" },
      { name: "Impresión", description: "Descripción de Impresión", thumbnail: "https://via.placeholder.com/100" },
      { name: "Seguridad", description: "Descripción de Seguridad", thumbnail: "https://via.placeholder.com/100" }
    ]
  },
  {
    title: "Educación",
    views: [
      { name: "Aprendizaje en Línea", description: "Descripción de Aprendizaje en Línea", thumbnail: "https://via.placeholder.com/100" },
      { name: "Idiomas", description: "Descripción de Idiomas", thumbnail: "https://via.placeholder.com/100" },
      { name: "Preescolar", description: "Descripción de Preescolar", thumbnail: "https://via.placeholder.com/100" }
    ]
  },
  {
    title: "Salud",
    views: [
      { name: "Bienestar", description: "Descripción de Bienestar", thumbnail: "https://via.placeholder.com/100" },
      { name: "Clínica Médica", description: "Descripción de Clínica Médica", thumbnail: "https://via.placeholder.com/100" },
      { name: "Fitness", description: "Descripción de Fitness", thumbnail: "https://via.placeholder.com/100" },
      { name: "Salud Mental", description: "Descripción de Salud Mental", thumbnail: "https://via.placeholder.com/100" }
    ]
  },
  {
    title: "Inmuebles",
    views: [
      { name: "Inmobiliaria", description: "Descripción de Inmobiliaria", thumbnail: "https://via.placeholder.com/100" },
      { name: "Gestión de Propiedades", description: "Descripción de Gestión de Propiedades", thumbnail: "https://via.placeholder.com/100" },
      { name: "Construcción", description: "Descripción de Construcción", thumbnail: "https://via.placeholder.com/100" }
    ]
  },
  {
    title: "Viajes",
    views: [
      { name: "Turismo", description: "Descripción de Turismo", thumbnail: "https://via.placeholder.com/100" },
      { name: "Hoteles", description: "Descripción de Hoteles", thumbnail: "https://via.placeholder.com/100" }
    ]
  },
  {
    title: "Servicios Específicos",
    views: [
      { name: "Transporte", description: "Descripción de Transporte", thumbnail: "https://via.placeholder.com/100" },
      { name: "Logística", description: "Descripción de Logística", thumbnail: "https://via.placeholder.com/100" },
      { name: "Mudanza", description: "Descripción de Mudanza", thumbnail: "https://via.placeholder.com/100" },
      { name: "Servicios Públicos", description: "Descripción de Servicios Públicos", thumbnail: "https://via.placeholder.com/100" }
    ]
  },
  {
    title: "Otros Nichos",
    views: [
      { name: "Agricultura", description: "Descripción de Agricultura", thumbnail: "https://via.placeholder.com/100" },
      { name: "Cosmética", description: "Descripción de Cosmética", thumbnail: "https://via.placeholder.com/100" },
      { name: "Eventos Especiales", description: "Descripción de Eventos Especiales", thumbnail: "https://via.placeholder.com/100" },
      { name: "Cuidado Infantil", description: "Descripción de Cuidado Infantil", thumbnail: "https://via.placeholder.com/100" },
      { name: "Música", description: "Descripción de Música", thumbnail: "https://via.placeholder.com/100" },
      { name: "Mascotas", description: "Descripción de Mascotas", thumbnail: "https://via.placeholder.com/100" },
      { name: "Fotografía", description: "Descripción de Fotografía", thumbnail: "https://via.placeholder.com/100" },
      { name: "Arte", description: "Descripción de Arte", thumbnail: "https://via.placeholder.com/100" },
      { name: "Aventura", description: "Descripción de Aventura", thumbnail: "https://via.placeholder.com/100" },
      { name: "Anuncios", description: "Descripción de Anuncios", thumbnail: "https://via.placeholder.com/100" },
      { name: "Veterinaria", description: "Descripción de Veterinaria", thumbnail: "https://via.placeholder.com/100" },
      { name: "Moda", description: "Descripción de Moda", thumbnail: "https://via.placeholder.com/100" },
      { name: "Salón de Eventos", description: "Descripción de Salón de Eventos", thumbnail: "https://via.placeholder.com/100" },
      { name: "Reciclaje", description: "Descripción de Reciclaje", thumbnail: "https://via.placeholder.com/100" },
      { name: "Espiritualidad", description: "Descripción de Espiritualidad", thumbnail: "https://via.placeholder.com/100" },
      { name: "Cocina", description: "Descripción de Cocina", thumbnail: "https://via.placeholder.com/100" },
      { name: "Conciertos", description: "Descripción de Conciertos", thumbnail: "https://via.placeholder.com/100" },
      { name: "Consumo", description: "Descripción de Consumo", thumbnail: "https://via.placeholder.com/100" },
      { name: "Finanzas", description: "Descripción de Finanzas", thumbnail: "https://via.placeholder.com/100" }
    ]
  }
];


  const handleTemplateSelect = (view) => {
    setSelectedTemplate(view.name); 
    onSelect(view.name);
  };

  return (
    <div className="template-wizard-container">
      <div className="template-categories">
        {templates.map((templateGroup, index) => (
          <div className="template-category" key={index}>
            <h3>{templateGroup.title}</h3>
            <div className="template-list">
              {templateGroup.views.map((view, i) => (
                <div
                  className={`template-item ${selectedTemplate === view.name ? 'selected' : ''}`}
                  key={i}
                  onClick={() => handleTemplateSelect(view)}
                ><div className="template-thumbnail">
                    <img src={view.thumbnail} alt={view.name} />
                  </div>
                  <div className="template-details">
                    <span className="template-title">{view.name}</span>
                    <p className="template-description">{view.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateWizard;
