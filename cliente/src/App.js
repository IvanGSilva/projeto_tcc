import React, { useState } from 'react';
import { LoadScript } from '@react-google-maps/api';
import Login from './components/User/Login/Login';
import Register from './components/User/Register/Register';
import UserProfile from './components/User/UserProfile/UserProfile';
import RideManager from './components/Ride/RideManager/RideManager';
import Home from './components/Home/Home';
import styles from './App.module.css';
import apiKey from './components/Home/Map/apikey';

// Define as bibliotecas fora do componente para evitar recriação
const libraries = ['places'];

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [currentPage, setCurrentPage] = useState('login');
    const [loggedUserId, setLoggedUserId] = useState('');

    const handleLogin = (success, userId) => {
        setIsAuthenticated(success);
        setLoggedUserId(userId);
        if (success) {
            setCurrentPage('home');
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setCurrentPage('login');
        setLoggedUserId('');
    };

    const goToProfile = () => setCurrentPage('profile');
    const goToHome = () => setCurrentPage('home');
    const goToRideManager = () => setCurrentPage('rideManager');
    const goToRegister = () => setShowRegister(true);
    const goToLogin = () => setShowRegister(false);

    return (
        <LoadScript googleMapsApiKey={apiKey} libraries={libraries}>
            <div>
                {!isAuthenticated ? (
                    <>
                    <div className={styles.titleConteiner}>
                        <h1 className={styles.title}>Projeto de Mobilidade Urbana</h1>
                    </div>
                    <div className={styles.flex}>
                        <div className={styles.description}>
                            <div className={styles.descriptionInner}>
                                <p>
                                    Este site é uma plataforma de mobilidade urbana voltada para o transporte local de curta distância.
                                    Desenvolvido como projeto de TCC, o objetivo é oferecer uma alternativa acessível e eficiente
                                    para deslocamentos dentro do município.
                                </p>
                                <p>
                                    A plataforma é especialmente útil em áreas onde o transporte público é insuficiente e apps
                                    tradicionais, como Uber e 99, não estão disponíveis.
                                </p>
                                <p>
                                    O site conecta motoristas e passageiros, promovendo caronas seguras e organizadas, com foco em melhorar
                                    a mobilidade para o público de baixa renda.
                                </p>
                            </div>
                        </div>
                        <div className={styles.container}>
                            {showRegister ? (
                                <Register onBack={goToLogin} />
                            ) : (
                                <Login onLogin={handleLogin} onRegister={goToRegister} />
                            )}
                        </div>
                    </div>
                </>
                ) : (
                    <>
                        <div className={styles.loggedHeader}>
                            <div className={styles.titleConteiner}>
                                <h1 className={styles.title}>Projeto de Mobilidade Urbana</h1>
                            </div>
                            <nav className={styles.nav}>
                                <ul className={styles.navList}>
                                    <li className={styles.navItem}>
                                        <button className={styles.navButton} onClick={goToHome}>Início</button>
                                    </li>
                                    <li className={styles.navItem}>
                                        <button className={styles.navButton} onClick={goToRideManager}>Minhas Caronas</button>
                                    </li>
                                    <li className={styles.navItem}>
                                        <button className={styles.navButton} onClick={goToProfile}>Meu Perfil</button>
                                    </li>
                                    <li className={styles.navItem}>
                                        <button className={styles.navButton} onClick={handleLogout}>Logout</button>
                                    </li>
                                </ul>
                            </nav>
                        </div>

                        {currentPage === 'home' && <Home loggedUserId={loggedUserId} />}
                        {currentPage === 'profile' && <UserProfile onLogout={handleLogout} />}
                        {currentPage === 'rideManager' && <RideManager loggedUserId={loggedUserId} />}
                    </>
                )}
            </div>
            <div className={styles.footer}>
                <p>&copy; 2024 Projeto de Mobilidade Urbana. Todos os direitos reservados.</p>
                <p>Desenvolvido como parte do projeto de TCC de Ivan G. Silva.</p>
            </div>
        </LoadScript>
    );
};

export default App;
