// components/SDVStackView.js
import React from 'react';

const SDVStackView = ({ component, children }) => {
  // Aquí puedes usar las propiedades del componente para configurar tu VStack.
  // Por ahora, solo se está utilizando el tipo de componente como texto de placeholder.
  return (
    <div className="vstack dropArea">
      {children}
    </div>
  );
};

export default SDVStackView;
