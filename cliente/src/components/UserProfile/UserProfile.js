import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './UserProfile.module.css';
import RegisterVehicle from '../RegisterVehicle/RegisterVehicle';

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
                    <p className={styles.detail}><strong>Nome:</strong> {userData.username}</p>
                    <p className={styles.detail}><strong>Email:</strong> {userData.email}</p>
                    <p className={styles.detail}><strong>CPF:</strong> {userData.cpf}</p>
                    <p className={styles.detail}><strong>Telefone:</strong> {userData.phone}</p>
                    <p className={styles.detail}><strong>Gênero:</strong> {userData.gender}</p>
                    <p className={styles.detail}><strong>Data de Nascimento:</strong> {userData.dateOfBirth}</p>
                    {userData.cnh && <p className={styles.detail}><strong>CNH:</strong> {userData.cnh}</p>}
                    {userData.profilePicture && (
                        <div className={styles.imageContainer}>
                            <strong>Foto de Perfil:</strong>
                            <img
                                src={`http://localhost:5000/uploads/webp/${userData.profilePicture}`}
                                alt="Foto de Perfil"
                                className={styles.profilePicture}
                            />
                        </div>
                    )}
                    <RegisterVehicle />
                </>
            ) : (
                <p>Carregando...</p>
            )}
        </div>
    );
};

export default UserProfile;
