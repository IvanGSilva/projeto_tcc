import React, { useState, useEffect } from 'react';
import styles from './EditProfile.module.css';

const EditProfile = ({ onBack }) => {
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(false); // Indicador de carregamento
    const [profilePicture, setProfilePicture] = useState(null); // Foto de perfil

    useEffect(() => {
        // Busca os dados do usuário para preencher o formulário
        const fetchUserData = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/users/profile', {
                    method: 'GET',
                    credentials: 'include',
                });
                if (response.ok) {
                    const data = await response.json();
                    setUserData(data);
                } else {
                    alert('Erro ao carregar perfil');
                }
            } catch (error) {
                console.error('Erro ao buscar perfil:', error);
                alert('Erro ao buscar perfil');
            }
        };

        fetchUserData();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        if (userData.username) formData.append('username', userData.username);
        if (userData.email) formData.append('email', userData.email);
        if (userData.dateOfBirth) formData.append('dateOfBirth', userData.dateOfBirth);
        if (userData.cpf) formData.append('cpf', userData.cpf);
        if (userData.phone) formData.append('phone', userData.phone);
        if (userData.gender) formData.append('gender', userData.gender);
        if (userData.cnh) formData.append('cnh', userData.cnh);
        if (profilePicture) formData.append('profilePicture', profilePicture);

        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/users/profile', {
                method: 'PUT',
                body: formData,
                credentials: 'include',
            });

            if (response.ok) {
                alert('Perfil atualizado com sucesso!');
                onBack();
            } else {
                const errorData = await response.json();
                alert(`Erro ao atualizar perfil: ${errorData.error || 'Erro desconhecido'}`);
            }
        } catch (error) {
            console.error('Erro ao atualizar perfil:', error);
            alert('Erro ao atualizar perfil');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setProfilePicture(file);
        } else {
            alert('Por favor, envie uma imagem válida.');
        }
    };

    if (!userData) {
        return <p>Carregando...</p>;
    }

    return (
        <div className={styles.container}>
            <h2>Editar Perfil</h2>
            <form className={styles.form} onSubmit={handleUpdate} autoComplete="off">
                <input
                    className={styles.input}
                    type="text"
                    placeholder="Nome de Usuário"
                    name="username"
                    value={userData.username || ''}
                    onChange={handleInputChange}
                    required
                />
                <input
                    className={styles.input}
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={userData.email || ''}
                    onChange={handleInputChange}
                    required
                />
                <input
                    className={styles.input}
                    type="date"
                    placeholder="Data de Nascimento"
                    name="dateOfBirth"
                    value={userData.dateOfBirth || ''}
                    onChange={handleInputChange}
                    required
                />
                <input
                    className={styles.input}
                    type="text"
                    placeholder="CPF"
                    name="cpf"
                    value={userData.cpf || ''}
                    onChange={handleInputChange}
                    required
                />
                <input
                    className={styles.input}
                    type="text"
                    placeholder="Telefone"
                    name="phone"
                    value={userData.phone || ''}
                    onChange={handleInputChange}
                    required
                />
                <select
                    className={styles.select}
                    name="gender"
                    value={userData.gender || ''}
                    onChange={handleInputChange}
                    required
                >
                    <option value="">Selecione o Sexo</option>
                    <option value="M">Masculino</option>
                    <option value="F">Feminino</option>
                    <option value="O">Outro</option>
                </select>
                <input
                    className={styles.input}
                    type="text"
                    placeholder="CNH (Opcional)"
                    name="cnh"
                    value={userData.cnh || ''}
                    onChange={handleInputChange}
                />
                <input
                    className={styles.input}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    placeholder="Foto de Perfil (Opcional)"
                />
                <button type="submit" className={styles.button} disabled={isLoading}>
                    {isLoading ? 'Atualizando...' : 'Atualizar'}
                </button>
            </form>
            <button className={styles.button} onClick={onBack}>
                Voltar
            </button>
        </div>
    );
};

export default EditProfile;
