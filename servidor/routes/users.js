const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const { isAgeValid, isCPFValid, isCNHValid } = require('../utils/validators');
const router = express.Router();

// Endpoint para criar um novo usuário
router.post('/register', async (req, res) => {
    const { username, email, password, dateOfBirth, cpf, phone, gender, cnh } = req.body;

    // Verificando o que está sendo enviado no corpo da requisição
    console.log('Dados recebidos no servidor:', req.body);

    try {
        // Validando CPF
        if (!isCPFValid(cpf)) {
            return res.status(400).json({ error: 'CPF inválido' });
        }

        // Validando CNH (caso o usuário tenha informado)
        if (cnh && !isCNHValid(cnh)) {
            return res.status(400).json({ error: 'CNH inválido' });
        }

        // Validando idade
        if (!isAgeValid(dateOfBirth)) {
            return res.status(400).json({ error: 'Usuário deve ser maior de idade' });
        }

        // Criptografando a senha
        const hashedPassword = await bcrypt.hash(password, 10);

        // Criando o usuário
        const user = new User({
            username,
            email,
            password: hashedPassword,
            dateOfBirth,
            cpf,
            phone,
            gender,
            cnh,  // CNH será enviado apenas se presente
        });

        await user.save();

        res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
    } catch (error) {
        console.error('Erro ao cadastrar usuário:', error);
        res.status(400).json({ error: 'Erro ao cadastrar usuário: ' + error.message });
    }
});


// Endpoint para login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (user && await bcrypt.compare(password, user.password)) {
            // Salvar o userId na sessão
            req.session.userId = user._id;
            console.log('Usuário autenticado, userId salvo na sessão:', req.session.userId);
            res.status(200).json({ message: 'Login realizado com sucesso!' });
        } else {
            res.status(401).json({ error: 'Credenciais inválidas' });
        }
    } catch (error) {
        res.status(400).json({ error: 'Erro ao fazer login' });
    }
});


// Rota para obter o perfil do usuário
router.get('/profile', (req, res) => {
    console.log('Sessão atual:', req.session); // Exibe a sessão inteira
    if (!req.session.userId) {
        console.log('Usuário não autenticado - sessão não contém userId');
        return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    User.findById(req.session.userId)
        .then(user => {
            if (!user) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }
            console.log('Usuário autenticado, dados do perfil retornados:', user); // Exibe os dados do usuário se autenticado
            res.json({ name: user.username, email: user.email });
        })
        .catch(err => res.status(500).json({ error: 'Erro ao obter perfil' }));
});


// Endpoint para logout
router.post('/logout', (req, res) => {
    // Destói a sessão
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao fazer logout' });
        }
        res.status(200).json({ message: 'Logout realizado com sucesso!' });
    });
});

function isValidCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, ''); // Remove caracteres não numéricos
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

    let sum = 0;
    let remainder;

    for (let i = 1; i <= 9; i++) sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(9, 10))) return false;

    sum = 0;
    for (let i = 1; i <= 10; i++) sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(10, 11))) return false;

    return true;
}


module.exports = router;
