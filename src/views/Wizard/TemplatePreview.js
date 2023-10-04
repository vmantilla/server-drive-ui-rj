import React from 'react';
import '../../css/Wizard/TemplatePreview.css';
import { Carousel } from 'react-bootstrap';

const TemplatePreview = ({ selectedTemplate, configuration }) => {
  console.log(selectedTemplate);
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
    <div className="TemplatePreview">
      <h2 style={{ textAlign: 'center' }}>{selectedTemplate && selectedTemplate.name}</h2>
      <Carousel interval={5000} pause="hover" mouseEnter={true}>
        {templates.map((template, index) => (
          <Carousel.Item key={index}>
            <img
              className="d-block w-100"
              src={template.imageUrl}
              alt={template.name}
            />
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default TemplatePreview;
