import React from 'react';
import { createRoot } from 'react-dom/client';
import Framework7 from 'framework7/lite';
import Framework7React from 'framework7-react';
import reportWebVitals from './reportWebVitals';
import App from './App'; // Importa el componente principal de tu aplicación
import './index.css';

// Inicializa el plugin de Framework7 React
Framework7.use(Framework7React);

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
