import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './UserProfile.module.css';

const UserProfile = ({ onLogout }) => {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/users/profile', { withCredentials: true });
                setUserData(response.data);
            } catch (error) {
                console.error('Erro ao obter perfil:', error);
            }
        };
        
        fetchUserData(); // Chama a função para buscar os dados do usuário ao montar o componente
    }, []);

    

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Perfil do Usuário</h2>
            {userData ? (
                <>
                    <p className={styles.detail}><strong>Nome:</strong> {userData.name}</p>
                    <p className={styles.detail}><strong>Email:</strong> {userData.email}</p>
                </>
            ) : (
                <p>Carregando...</p>
            )}
        </div>
    );
};

export default UserProfile;
