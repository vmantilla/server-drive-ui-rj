import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './views/login/LoginPage';
import Builder from './views/Builder/Builder';
import Preview from './views/Preview';
import ColorsAndFontsView from './views/ColorsAndFontsView';
import Dashboard from './views/Dashboard';
import AuthenticatedLayout from './AuthenticatedLayout';
import Notification from './Notification'; 
import 'bootstrap-icons/font/bootstrap-icons.css';

function App() {
  const [notification, setNotification] = useState(null);

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

  return (
    <Router>
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
          >
            <Route path="preview" element={<Preview />} />
            <Route path="colorsAndFontsView" element={<ColorsAndFontsView />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
