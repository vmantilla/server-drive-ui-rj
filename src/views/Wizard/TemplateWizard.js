import React from 'react';
import '../../css/Wizard/TemplateWizard.css';

const TemplateWizard = ({ onSelect }) => {
  const templates = [
  {
    title: "Selecciona una plantilla básica",
    views: ["Proyecto en blanco", "Plantilla Tabulador", "Plantilla Tablet", "Plantilla Juego"]
  },
  {
    title: "Medios y Contenido",
    views: ["Blog / Revista Digital", "Noticias y Medios", "Biblioteca Digital", "Streaming de Contenidos"]
  },
  {
    title: "Comercio y Ventas",
    views: ["Tienda en Línea / E-commerce", "Reserva de Eventos / Ticketing", "Servicio de Entrega / Envío", "Cafetería y Restaurantes", "Gestión de Restaurantes"]
  },
  {
    title: "Social y Comunidad",
    views: ["Red Social / Comunidad", "Foro de Discusión", "ONG / Recaudación de Fondos", "Recaudación de Fondos y Crowdfunding"]
  },
  {
    title: "Corporativo y Negocios",
    views: ["Aplicación de Empresa / Corporativa", "Servicios de Consultoría", "Portafolio / CV", "Legal / Abogados", "Tecnología y Startups", "Inversión y Mercado de Valores", "Servicios de Suscripción", "Servicios de Impresión y Diseño", "Servicios de Seguridad y Vigilancia"]
  },
  {
    title: "Educación y Aprendizaje",
    views: ["Educación y Aprendizaje en Línea", "Idiomas y Aprendizaje de Culturas", "Educación Preescolar y Cuidado de Niños"]
  },
  {
    title: "Salud y Bienestar",
    views: ["Salud y Bienestar", "Servicios Médicos y Clínicas", "Deporte y Fitness", "Salud Mental y Bienestar"]
  },
  {
    title: "Inmuebles y Propiedades",
    views: ["Inmobiliaria", "Gestión de Propiedades y Alquileres", "Construcción y Renovación"]
  },
  {
    title: "Viajes y Hospitalidad",
    views: ["Viajes y Turismo", "Hoteles y Alojamiento"]
  },
  {
    title: "Servicios Específicos",
    views: ["Automovilismo y Transporte", "Rastreo y Logística", "Servicios de Mudanza y Almacenamiento", "Gobierno y Servicios Públicos"]
  },
  {
    title: "Otros nichos",
    views: ["Agricultura y Alimentos", "Belleza y Cosmética", "Boda y Eventos Especiales", "Crianza y Cuidado Infantil", "Música y Artistas", "Animales y Mascotas", "Fotografía y Videografía", "Arte y Fotografía", "Actividades al Aire Libre y Aventura", "Anuncios y Clasificados", "Veterinaria y Cuidado de Mascotas", "Moda y Estilo", "Salón de Eventos y Fiestas", "Reciclaje y Medio Ambiente", "Religión y Espiritualidad", "Cocina y Entrega de Comidas", "Música en Vivo y Conciertos", "Bienes de Consumo / Catálogo", "Seguros y Servicios Financieros"]
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
