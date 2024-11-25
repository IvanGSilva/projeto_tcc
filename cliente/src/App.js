import React, { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import UserProfile from './components/UserProfile'; // Novo componente para perfil

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const handleLogin = (success) => {
    setIsAuthenticated(success);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <div>
      <h1>Clone do BlaBlaCar</h1>
      {!isAuthenticated ? (
        showRegister ? (
          <Register onBack={() => setShowRegister(false)} />
        ) : (
          <Login onLogin={handleLogin} onRegister={() => setShowRegister(true)} />
        )
      ) : (
        <UserProfile onLogout={handleLogout} />
      )}
    </div>
  );
};

export default App;
