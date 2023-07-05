import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage';
import DashboardPage from './DashboardPage';
import BuilderPage from './BuilderPage';
import BuilderPreview from './builder/Preview';

import 'bootstrap/dist/css/bootstrap.min.css';

import { loadThemes } from './themes';

// Llamar a loadThemes para cargar los datos de los themes
loadThemes().then((themesData) => {
  // Utilizar los datos de los themes cargados
  console.log(themesData);
});

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/builder" element={<BuilderPage />} />
          <Route path="/preview" element={<BuilderPreview />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
