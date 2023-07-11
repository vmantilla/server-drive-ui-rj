import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage';
import Builder from './views/Builder';
import Preview from './views/Preview';
import DropViewBuilder from "./views/DropViewBuilder"
import ColorsAndFontsView from './views/ColorsAndFontsView';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/builder" element={<DropViewBuilder />}>
            <Route path="preview" element={<Preview />} />
            <Route path="colorsAndFontsView" element={<ColorsAndFontsView />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
