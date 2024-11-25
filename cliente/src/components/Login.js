import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ onLogin, onRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:5000/api/users/login',
        { email, password },
        { withCredentials: true }
      );
      if (response.status === 200) {
        onLogin(true); // Login bem-sucedido
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      onLogin(false); // Falha no login
    }
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha"
        />
        <button type="submit">Entrar</button>
      </form>
      <button onClick={onRegister}>Criar Conta</button>
    </div>
  );
};

export default Login;
