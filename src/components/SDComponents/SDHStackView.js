// components/SDHStackView.js
import React from 'react';
import useSDPropertiesModifier from '../Common/useSDPropertiesModifier'; // Asegúrate de ajustar esta ruta a la ubicación correcta de tu hook

const SDHStackView = ({ component, children }) => {
  // Obtenemos las propiedades de nuestro componente
  const properties = component.properties;

  // Configuramos nuestro estilo inicial del div
  const initialDivStyle = {
  };

  // Usamos nuestro hook para obtener los estilos finales
  const style = useSDPropertiesModifier(properties, initialDivStyle);
  
  // Aquí puedes usar las propiedades del componente para configurar tu HStack.
  // Por ahora, solo se está utilizando el tipo de componente como texto de placeholder.
  return (
    <div className="hstack dropArea" style={style}>
      {children}
    </div>
  );
};

export default SDHStackView;
