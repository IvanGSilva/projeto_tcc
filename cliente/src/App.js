import React, { useState } from 'react';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import UserProfile from './components/UserProfile/UserProfile';
import RideForm from './components/RideForm/RideForm';
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
        setCurrentPage('profile'); // Redireciona para o perfil do usuário
    };

    const goToRideForm = () => {
        setCurrentPage('rideForm'); // Redireciona para o formulário para oferecer uma carona
    };

    const goToHome = () => {
        setCurrentPage('home'); // Redireciona para a home da aplicação quando já logado
    };

    const goToRegister = () => {
        setShowRegister(true); // Mostra o formulário de registro
    };

    const goToLogin = () => {
        setShowRegister(false); // Volta para a tela de login
    };

    // Função de callback chamada após o envio do formulário de viagem
    const handleFormSubmit = () => {
        setCurrentPage('home'); // Voltar para a página inicial após enviar a viagem
    };

    return (
        <><div>
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
                    </div></>
            ) : (
                <>
                    <div className={styles.loggedHeader}>
                        <div className={styles.titleConteiner}>
                            <h1 className={styles.title}>Projeto de Mobilidade Urbana</h1>
                        </div>
                        <nav className={styles.nav}>
                            <ul className={styles.navList}>
                                <li className={styles.navItem}>
                                    <button className={styles.navButton} onClick={goToHome}>Página Inicial</button>
                                </li>
                                <li className={styles.navItem}>
                                    <button className={styles.navButton} onClick={goToRideForm}>Ofereça uma carona</button>
                                </li>
                                <li className={styles.navItem}>
                                    <button className={styles.navButton} onClick={goToProfile}>Perfil</button>
                                </li>
                                <li className={styles.navItem}>
                                    <button className={styles.navButton} onClick={handleLogout}>Logout</button>
                                </li>
                            </ul>
                        </nav>
                    </div>

                    {/* Conteúdo Dinâmico com base no estado */}
                    {currentPage === 'home' && <Home />}
                    {currentPage === 'rideForm' && <RideForm onFormSubmit={handleFormSubmit} />}
                    {currentPage === 'profile' && <UserProfile onLogout={handleLogout} />}
                </>
            )}
        </div >
            <div className={styles.footer}>
                <p>&copy; 2024 Projeto de Mobilidade Urbana. Todos os direitos reservados.</p>
                <p>Desenvolvido como parte do projeto de TCC de Ivan G. Silva.</p>
            </div>
        </>
    );
};

export default App;
