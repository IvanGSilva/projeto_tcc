// components/Login.js
import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Substitua pela sua URL de autenticação
      const response = await axios.post('http://localhost:5000/api/users/login', { email, password });
      
      // Se o login for bem-sucedido, chama onLogin com sucesso
      onLogin(true);
    } catch (error) {
      // Exibe erro em caso de falha no login
      setErrorMessage('Credenciais inválidas');
      onLogin(false); // Falha no login
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Entrar</button>
      </form>
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
};

export default Login;
