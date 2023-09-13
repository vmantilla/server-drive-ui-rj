import React from 'react';
import '../../css/Wizard/TemplateWizard.css';

const TemplateWizard = ({ onSelect }) => {
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

  return (
    <div className="template-container">
      {templates.map((templateGroup, index) => (
        <div className="template-group" key={index}>
          <div className="title">{templateGroup.title}</div>
          <div className="grid-container">
            {templateGroup.views.map((view, i) => (
              <div className="grid-item" key={i} onClick={() => onSelect(view)}>
                <div className="icon-container">
                  <img src="https://via.placeholder.com/150" alt={`${view}`} />
                </div>
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
