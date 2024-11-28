import React, { useState } from 'react';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import UserProfile from './components/UserProfile/UserProfile';
import Home from './components/Home/Home'; // Componente da página inicial com pesquisa
import styles from './App.module.css';

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
    <div className={styles.container}>
      <h1 className={styles.title}>Clone do BlaBlaCar</h1>

      {/* Menu de navegação */}
      <nav className={styles.nav}>
        <ul className={styles.navList}>
          {!isAuthenticated ? (
            <li className={styles.navItem}>
              {/* Exibe a tela de login ou registro, dependendo do estado */}
              {showRegister ? (
                <Register onBack={goToLogin} />
              ) : (
                <Login onLogin={handleLogin} onRegister={goToRegister} />
              )}
            </li>
          ) : (
            <>
              <li className={styles.navItem}>
                <button className={styles.navButton} onClick={goToHome}>Página Inicial</button>
              </li>
              <li className={styles.navItem}>
                <button className={styles.navButton} onClick={goToProfile}>Perfil</button>
              </li>
              <li className={styles.navItem}>
                <button className={styles.navButton} onClick={handleLogout}>Logout</button>
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
