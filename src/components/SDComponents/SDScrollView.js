import React from 'react';
import useSDPropertiesModifier from '../Common/useSDPropertiesModifier'; // Asegúrate de ajustar esta ruta a la ubicación correcta de tu hook


const SDScrollView = ({ component, children }) => {
  const { axis } = component.properties;

  // Obtenemos las propiedades de nuestro componente
  const properties = component.properties;

  const scrollAxis = axis?.axis || 'vertical';

  const initialDivStyle = {
  };

  // Usamos nuestro hook para obtener los estilos finales
  const style = useSDPropertiesModifier(properties, initialDivStyle);

  if (style.maxHeight === '100%') {
    style.maxHeight = undefined;
  }

  return (
    <div className={`sd-scroll-view sd-scroll-view-${scrollAxis}`} style={style}>
       {children}
    </div>
  );
};

export default SDScrollView;
