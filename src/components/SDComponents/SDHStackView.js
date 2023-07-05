// components/SDHStackView.js
import React from 'react';

const SDHStackView = ({ component, children }) => {
  // Aquí puedes usar las propiedades del componente para configurar tu HStack.
  // Por ahora, solo se está utilizando el tipo de componente como texto de placeholder.
  return (
    <div className="hstack dropArea">
      {children}
    </div>
  );
};

export default SDHStackView;
