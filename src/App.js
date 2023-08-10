import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage';
import Builder from './views/Builder';
import Preview from './views/Preview';
import ColorsAndFontsView from './views/ColorsAndFontsView';
import Dashboard from './views/Dashboard';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/builder/:projectId" element={<Builder />}>
            <Route path="preview" element={<Preview />} />
            <Route path="colorsAndFontsView" element={<ColorsAndFontsView />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
