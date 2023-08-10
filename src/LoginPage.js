import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { BrowserRouter, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch("http://localhost:3000/sessions", {
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

      // Additional actions with the API response if needed
      // e.g., storing user information in the global application state
      const data = await response.json();
      const token = data.token; // Este camino dependerá de cómo la API devuelva el token

      // Guardar el token en el almacenamiento local
      localStorage.setItem('token', token);

      // Redirect to the dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Error:", error);
      setError("Hubo un error en el inicio de sesión");
    }
  };

return (
    <div className="d-flex justify-content-center">
      <div className="login-container" style={{ maxWidth: '400px' }}>
        <h2>Login</h2>
        {error && <Alert variant="danger">{error}</Alert>}
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
  );
};

export default LoginPage;
