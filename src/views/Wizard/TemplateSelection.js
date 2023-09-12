import React from 'react';
import '../../css/Wizard/TemplateSelection.css';
import { Carousel } from 'react-bootstrap';

const TemplateSelection = ({ onSelect }) => {
  const templates = [
    {
      name: 'Plantilla 1',
      imageUrl: 'https://yi-files.s3.eu-west-1.amazonaws.com/products/945000/945404/1597940-full.jpg'
    },
    {
      name: 'Plantilla 2',
      imageUrl: 'https://yi-files.s3.eu-west-1.amazonaws.com/products/945000/945404/1597940-full.jpg'
    },
    {
      name: 'Plantilla 3',
      imageUrl: 'https://yi-files.s3.eu-west-1.amazonaws.com/products/945000/945404/1597940-full.jpg'
    }
  ];


    return (
    <div>
      <h2 style={{ textAlign: 'center' }}>Selecciona una plantilla</h2>
      <Carousel>
        {templates.map((template, index) => (
          <Carousel.Item key={index}>
            <img
              className="d-block w-100"
              src={template.imageUrl}
              alt={template.name}
            />
            <Carousel.Caption>
              <h3>{template.name}</h3>
              <button onClick={() => onSelect(template.name)}>Elegir esta plantilla</button>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default TemplateSelection;