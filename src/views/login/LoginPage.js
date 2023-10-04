import React, { useState, useEffect } from 'react'; 
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import '../../css/Login/Login.css';
import logo from '../../assets/images/logo.png';


const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');  // Limpia el mensaje de error
      }, 3000);  // 3 segundos

      return () => clearTimeout(timer);  // Limpia el temporizador si el componente se desmonta
    }
  }, [error]);  // Este efecto se ejecutará cada vez que 'error' cambie


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch("http://192.168.20.35:3002/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        setError("Credenciales inválidas");
        return;
      }

      const data = await response.json();
      const token = data.token;

      localStorage.setItem('token', token);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error:", error);
      setError("Hubo un error en el inicio de sesión");
    }
  };

  return (
    <>
    {error && <div className="error-message">{error}</div>}
    <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <div className="login-container">
        <img src={logo} alt="Logo de la empresa" className="login-logo" />
        <div className="login-form">
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="email">
              <Form.Label>Email:</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Label>Password:</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Login
            </Button>
          </Form>
        </div>
      </div>
    </div>
    </>
);
};

export default LoginPage;
