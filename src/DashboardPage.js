import React from 'react';

const DashboardPage = () => {
  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <h2>Projects</h2>
        {/* Aquí puedes agregar una lista de proyectos */}
        <ul>
          <li>Project 1</li>
          <li>Project 2</li>
          <li>Project 3</li>
        </ul>
      </div>
      <div className="main-content">
        <h2>Editor</h2>
        {/* Aquí puedes agregar el editor y otros componentes */}
      </div>
    </div>
  );
};

export default DashboardPage;
