import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import LoginPage from './views/Login/LoginPage';
import Builder from './views/Builder/Builder';
import Dashboard from './views/Dashboard/Dashboard';
import AuthenticatedLayout from './AuthenticatedLayout';
import ProjectWizard from './views/Wizard/ProjectWizard';

import Notification from './Notification'; 
import 'bootstrap-icons/font/bootstrap-icons.css';
import { setupInterceptors } from './views/api';

function App() {
  return (
    <Router>
      <AppInner />
    </Router>
  );
}

function AppInner() {
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  const showNotification = (variant, message) => {
    console.log("showNotification variant", variant);
    console.log("showNotification", message);
    setNotification({ variant, message });
    setTimeout(() => setNotification(null), 3000); 
  };

  useEffect(() => {
    const handlePopState = (event) => {
      window.history.pushState(null, null, window.location.href);
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  useEffect(() => {
    setupInterceptors(navigate); // Configura el interceptador de Axios
  }, [navigate]);

  return (
    <div>
      {notification && (
        <Notification
          variant={notification.variant}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<AuthenticatedLayout><Dashboard /></AuthenticatedLayout>} />
        <Route
          path="/builder/:projectId"
          element={<AuthenticatedLayout><Builder showNotification={showNotification} /></AuthenticatedLayout>}
        />
        <Route path="/wizard" element={<AuthenticatedLayout><ProjectWizard /></AuthenticatedLayout>} />
      </Routes>
    </div>
  );
}

export default App;
