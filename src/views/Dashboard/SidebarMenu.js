import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/images/logo_gris.png';
import '../../css/Dashboard/SidebarMenu.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function SidebarMenu() {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  }

  const handleLogout = () => {
    localStorage.removeItem('token'); // Borrar el token del localStorage
    navigate('/'); // Redirigir al usuario al login
    // Opcionalmente puedes recargar la página si quieres reiniciar completamente la app:
    // window.location.reload(); 
  }

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <img src={logo} alt="Logo" className="logo-image" />
      </div>
      <button className="sidebar-button" onClick={() => handleNavigation('/dashboard')}>
        <i className="bi bi-house-door"></i>
        <span className="button-tooltip">Dashboard</span>
      </button>
      <button className="sidebar-button" onClick={() => handleNavigation('/')}> 
        <i className="bi bi-bell"></i>
        <span className="button-tooltip">Notification</span>
      </button>
      <button className="sidebar-button" onClick={() => handleNavigation('/configuracion')}>
        <i className="bi bi-gear-wide-connected"></i>
        <span className="button-tooltip">Configuration</span>
      </button>
      <button className="sidebar-button sidebar-exit" onClick={handleLogout}>
        <i className="bi bi-door-closed"></i>
        <span className="button-tooltip">Salir</span>
      </button>
    </div>
  );
}

export default SidebarMenu;
