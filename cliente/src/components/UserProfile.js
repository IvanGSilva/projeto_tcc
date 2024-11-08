import React, { useState, useEffect } from 'react';
import axios from 'axios';

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

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:5000/api/users/logout', {}, { withCredentials: true });
            onLogout();
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        }
    };

    return (
        <div>
            <h2>Perfil do Usuário</h2>
            {userData ? (
                <>
                    <p><strong>Nome:</strong> {userData.name}</p>
                    <p><strong>Email:</strong> {userData.email}</p>
                    <button onClick={handleLogout}>Logout</button>
                </>
            ) : (
                <p>Carregando...</p>
            )}
        </div>
    );
};

export default UserProfile;
