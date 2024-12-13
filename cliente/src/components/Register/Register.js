import React, { useState } from 'react';
import styles from './Register.module.css';

const Register = ({ onBack }) => {
    const [username, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [cpf, setCpf] = useState('');
    const [phone, setPhone] = useState('');
    const [gender, setGender] = useState('');
    const [cnh, setCnh] = useState(''); // Novo campo CNH

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/users/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                    dateOfBirth,
                    cpf,
                    phone,
                    gender,
                    cnh: cnh || undefined, // CNH é opcional, se não for preenchido, envia undefined
                }),
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
            <form className={styles.form} onSubmit={handleRegister} autoComplete="off">
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
                <input
                    className={styles.input}
                    type="date"
                    placeholder="Data de Nascimento"
                    name="dateOfBirth"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    required
                />
                <input
                    className={styles.input}
                    type="text"
                    placeholder="CPF"
                    name="cpf"
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                    required
                />
                <input
                    className={styles.input}
                    type="text"
                    placeholder="Telefone"
                    name="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                />
                <select
                    className={styles.select}
                    name="gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    required
                >
                    <option value="">Selecione o Sexo</option>
                    <option value="male">Masculino</option>
                    <option value="female">Feminino</option>
                    <option value="other">Outro</option>
                </select>
                <input
                    className={styles.input}
                    type="text"
                    placeholder="CNH (Opcional)"
                    name="cnh"
                    value={cnh}
                    onChange={(e) => setCnh(e.target.value)}
                />
                <button type="submit" className={styles.button}>Cadastrar</button>
            </form>
            <button className={styles.buttonSubmit} onClick={onBack}>Voltar ao Login</button>
        </div>
    );
};

export default Register;
