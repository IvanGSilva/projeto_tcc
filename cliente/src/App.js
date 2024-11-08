import React, { useState } from 'react';
import Login from './components/Login';
import UserProfile from './components/UserProfile'; // Novo componente para perfil

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
        <Login onLogin={handleLogin} />
      ) : (
        <UserProfile onLogout={handleLogout} />
      )}
    </div>
  );
};

export default App;
