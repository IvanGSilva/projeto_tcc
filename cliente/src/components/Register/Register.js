import React, { useState } from 'react';
import styles from './Register.module.css';

const Register = ({ onBack }) => {
    const [username, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/users/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password }),
            });
            if (response.ok) {
                alert('Cadastro realizado com sucesso!');
                onBack();
            } else {
                const errorData = await response.json();
                alert(`Erro no cadastro: ${errorData.message || 'Erro desconhecido'}`);
            }
        } catch (error) {
            console.error('Erro ao cadastrar:', error);
        }
    };

    return (
        <div className={styles.container}>
            <h2>Cadastro</h2>
            <form
                onSubmit={handleRegister}
                autoComplete="off"
            >
                <input
                    className={styles.input}
                    type="text"
                    placeholder="Nome de Usuário"
                    name="username"
                    value={username}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="new-username"
                    required
                />
                <input
                    className={styles.input}
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="new-email"
                    required
                />
                <input
                    className={styles.input}
                    type="password"
                    placeholder="Senha"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                />
                <button type="submit" className={styles.button}>Cadastrar</button>
            </form>
            <button className={styles.button} onClick={onBack}>Voltar ao Login</button>
        </div>
    );
};

export default Register;
