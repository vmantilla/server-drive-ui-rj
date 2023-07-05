// components/SDZStackView.js
import React from 'react';

const SDZStackView = ({ component, children }) => {
  // Aquí puedes usar las propiedades del componente para configurar tu HStack.
  // Por ahora, solo se está utilizando el tipo de componente como texto de placeholder.
  return (
    <div className="dropArea">
      {children}
    </div>
  );
};

export default SDZStackView;
