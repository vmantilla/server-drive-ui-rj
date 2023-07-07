import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage';
import Builder from './views/Builder';
import Preview from './views/Preview';

import 'bootstrap/dist/css/bootstrap.min.css';

import { loadThemes } from './styles/themes';

// Llamar a loadThemes para cargar los datos de los themes
loadThemes().then((themesData) => {
  // Utilizar los datos de los themes cargados
  //console.log(themesData);
});

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/builder" element={<Builder />}>
            <Route path="preview" element={<Preview />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
