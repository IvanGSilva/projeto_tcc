import React, { useState } from 'react';
import axios from 'axios';
import styles from './Login.module.css';

const Login = ({ onLogin, onRegister }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                'http://localhost:5000/api/users/login',
                { email, password },
                { withCredentials: true }
            );
            if (response.status === 200) {
                console.log('Login realizado com sucesso!');
                onLogin(true, response.data.userId); 
            }
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            onLogin(false); // Falha no login
        }
    };

    return (
        <div className={styles.container}>
            <h2>Faça Login</h2>
            <form className={styles.form} onSubmit={handleLogin}>
                <input className={styles.input}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                />
                <input className={styles.input}
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Senha"
                />
                <button type="submit" className={styles.button}>Entrar</button>
            </form>
            <button className={styles.button} onClick={onRegister}>Criar Conta</button>
            <br></br>
        </div>
    );
};

export default Login;
