import React from 'react';

function BuilderComponents({ setIsPropertiesOpen }) {
  return (
    <div className="builder-components">
      <h2>Componentes</h2>
      {['Texto', 'Imagen', 'Botón',].map(component => (
        <div draggable="true" onClick={() => setIsPropertiesOpen(true)} key={component}>
          {component}
        </div>
      ))}
    </div>
  );
}

export default BuilderComponents;
