import React, { useEffect, useState } from 'react';
import useSDPropertiesModifier, { getAlignment } from '../../../models/modifiers/useSDPropertiesModifier'; // Asegúrate de ajustar esta ruta a la ubicación correcta de tu hook
import defaultImage from '../../../assets/images/default.png';

const SDImageView = ({ component, children, onClick }) => {
  const properties = component.properties;
  const [imgSrc, setImgSrc] = useState(null);
  
  // Usamos nuestro hook para obtener los estilos finales
  const alignmentStyle = getAlignment(properties?.frame?.alignment) ?? {};
  const initialImageStyle = {
    ...alignmentStyle,
  };

  const divStyle = useSDPropertiesModifier(properties, initialImageStyle);

  const contentModeStyle = getContentModeStyle(properties.contentMode);

  useEffect(() => {
    const sourceType = properties.source?.origin;
    const src = properties.source?.src;

    
    switch (sourceType) {
      case 'Url':
        setImgSrc(src);
        break;
      case 'Assets':
      	setImgSrc(`${process.env.PUBLIC_URL}/assets/images/${src}.png`);
        break;
      case 'System':
        setImgSrc(`${process.env.PUBLIC_URL}/assets/images/${src}.png`);
        break;
      default:
      	setImgSrc(`${process.env.PUBLIC_URL}/assets/images/default.png`);
    }
  }, [properties.source]);

  if (!imgSrc) {
    return <div></div>;
  }

  return (
    <img
      src={imgSrc}
      alt={properties.text || ''}
      style={{ ...divStyle, ...contentModeStyle }}
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = defaultImage;
        e.target.style.width = '20px'; 
        e.target.style.height = '20px';
      }}
       onClick={onClick}
    />
  );
};

const getContentModeStyle = (contentMode) => {
  switch (contentMode) {
    case "FIT":
      return { objectFit: 'contain' };
    case "FILL":
      return { objectFit: 'cover' };
    case "ASPECTFIT":
      return { objectFit: 'scale-down' };
    case "ASPECTFILL":
      return { objectFit: 'cover' };
    case "CENTER":
      return { objectFit: 'none' };
    default:
      return { objectFit: 'contain' };
  }
};


export default SDImageView;
