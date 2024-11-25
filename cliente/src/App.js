import React, { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import UserProfile from './components/UserProfile';
import Home from './components/Home'; // Componente da página inicial com pesquisa

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showRegister, setShowRegister] = useState(false); // Usado para alternar entre login e registro
  const [currentPage, setCurrentPage] = useState('login'); // Exibe a tela de login por padrão

  const handleLogin = (success) => {
    setIsAuthenticated(success);
    if (success) {
      setCurrentPage('home'); // Redireciona para a página inicial após login
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('login'); // Redireciona para o login após logout
  };

  const goToProfile = () => {
    setCurrentPage('profile');
  };

  const goToHome = () => {
    setCurrentPage('home');
  };

  const goToRegister = () => {
    setShowRegister(true); // Mostra o formulário de registro
  };

  const goToLogin = () => {
    setShowRegister(false); // Volta para a tela de login
  };

  return (
    <div>
      <h1>Clone do BlaBlaCar</h1>

      {/* Menu de navegação */}
      <nav>
        <ul>
          {!isAuthenticated ? (
            <li>
              {/* Exibe a tela de login ou registro, dependendo do estado */}
              {showRegister ? (
                <Register onBack={goToLogin} />
              ) : (
                <Login onLogin={handleLogin} onRegister={goToRegister} />
              )}
            </li>
          ) : (
            <>
              <li>
                <button onClick={goToHome}>Página Inicial</button>
              </li>
              <li>
                <button onClick={goToProfile}>Perfil</button>
              </li>
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            </>
          )}
        </ul>
      </nav>

      {/* Conteúdo Dinâmico com base no estado */}
      {currentPage === 'home' && isAuthenticated && <Home />}
      {currentPage === 'profile' && isAuthenticated && <UserProfile onLogout={handleLogout} />}
    </div>
  );
};

export default App;
