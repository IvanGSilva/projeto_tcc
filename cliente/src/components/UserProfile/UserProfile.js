import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './UserProfile.module.css';
import RegisterVehicle from '../RegisterVehicle/RegisterVehicle';

// Função para formatar a data de nascimento
const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

// Função para formatar o número de telefone
const formatPhone = (phone) => {
    if (!phone || phone.length < 11) return phone; // Retorna o número como está se não for válido
    const countryCode = "+55";
    const areaCode = phone.slice(0, 2); // Extrai os 2 primeiros dígitos como DDD
    const firstPart = phone.slice(2, 7); // Extrai os próximos 5 dígitos
    const secondPart = phone.slice(7); // Extrai os últimos 4 dígitos
    return `${countryCode} (${areaCode}) ${firstPart}-${secondPart}`;
};

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
            <div className={styles.profileSection}>
                <h2 className={styles.title}>Perfil do Usuário</h2>
                {userData ? (
                    <>
                        {userData.profilePicture && (
                            <div className={styles.imageContainer}>
                                <img
                                    src={`http://localhost:5000/uploads/webp/${userData.profilePicture}`}
                                    alt="Foto de Perfil"
                                    className={styles.profilePicture}
                                />
                            </div>
                        )}
                        <div className={styles.detailsSection}>
                            <div className={styles.detailBox}>
                                <h2 className={styles.subTitle}>Seus Dados</h2>
                                <p className={styles.detail}><strong>Nome:</strong> {userData.username}</p>
                                <p className={styles.detail}>
                                    <strong>Data de Nascimento:</strong> {formatDate(userData.dateOfBirth)}
                                </p>
                                <p className={styles.detail}><strong>CPF:</strong> {userData.cpf}</p>
                                <p className={styles.detail}><strong>Gênero:</strong> {userData.gender}</p>
                                {userData.cnh && <p className={styles.detail}><strong>CNH:</strong> {userData.cnh}</p>}
                            </div>
                            <div className={styles.detailBox}>
                                <h2 className={styles.subTitle}>Contato</h2>
                                <p className={styles.detail}>
                                    <strong>Telefone:</strong> {formatPhone(userData.phone)}
                                </p>
                                <p className={styles.detail}><strong>Email:</strong> {userData.email}</p>
                            </div>
                        </div>
                    </>
                ) : (
                    <p>Carregando...</p>
                )}
            </div>

            <div className={styles.vehicleSection}>
                <h2 className={styles.title}>Cadastro de Veículos</h2>
                {userData?.cnh ? (
                    <RegisterVehicle />
                ) : (
                    <p className={styles.warning}>
                        Você precisa cadastrar sua CNH para adicionar veículos.
                    </p>
                )}
            </div>
        </div>
    );
};

export default UserProfile;
