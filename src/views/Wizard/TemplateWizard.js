import React, { useState } from 'react';
import '../../css/Wizard/TemplateWizard.css';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

const TemplateWizard = ({ onSelect }) => {
  const navigate = useNavigate();

  const templates = [
  {
    title: "Plantillas Básicas",
    views: ["Proyecto en Blanco", "Tabulador", "Tablet", "Juego"]
  },
  {
    title: "Medios y Contenido",
    views: ["Blog", "Noticias", "Biblioteca Digital", "Streaming"]
  },
  {
    title: "Comercio",
    views: ["Tienda en Línea", "Reserva de Eventos", "Servicio de Entrega", "Restaurante"]
  },
  {
    title: "Social",
    views: ["Red Social", "Foro", "ONG", "Crowdfunding"]
  },
  {
    title: "Corporativo",
    views: ["Empresa", "Consultoría", "Portafolio", "Legal", "Startup", "Inversión", "Suscripción", "Impresión", "Seguridad"]
  },
  {
    title: "Educación",
    views: ["Aprendizaje en Línea", "Idiomas", "Preescolar"]
  },
  {
    title: "Salud",
    views: ["Bienestar", "Clínica Médica", "Fitness", "Salud Mental"]
  },
  {
    title: "Inmuebles",
    views: ["Inmobiliaria", "Gestión de Propiedades", "Construcción"]
  },
  {
    title: "Viajes",
    views: ["Turismo", "Hoteles"]
  },
  {
    title: "Servicios Específicos",
    views: ["Transporte", "Logística", "Mudanza", "Servicios Públicos"]
  },
  {
    title: "Otros Nichos",
    views: ["Agricultura", "Cosmética", "Eventos Especiales", "Cuidado Infantil", "Música", "Mascotas", "Fotografía", "Arte", "Aventura", "Anuncios", "Veterinaria", "Moda", "Salón de Eventos", "Reciclaje", "Espiritualidad", "Cocina", "Conciertos", "Consumo", "Finanzas"]
  }
];

  const handleTemplateSelect = (view) => {
    onSelect(view);
    navigate('/builder'); // Ajusta la ruta según tu configuración
  };

  return (
    <div className="template-wizard-container">
      <h2>Selecciona una plantilla</h2>

      <div className="template-categories">
        {templates.map((templateGroup, index) => (
          <div className="template-category" key={index}>
            <h3>{templateGroup.title}</h3>
            <div className="template-list">
              {templateGroup.views.map((view, i) => (
                <div className="template-item" key={i} onClick={() => handleTemplateSelect(view)}>
                  <div className="template-thumbnail">
                    <img src="https://via.placeholder.com/150" alt={view} />
                  </div>
                  <span>{view}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Button variant="secondary" onClick={() => navigate('/dashboard')}>
        Atrás
      </Button>
    </div>
  );
};

export default TemplateWizard;
