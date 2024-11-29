// routes/users.js
const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const router = express.Router();

// Endpoint para criar um novo usuário
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ username, email, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
    } catch (error) {
        res.status(400).json({ error: 'Erro ao cadastrar usuário' });
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

module.exports = router;
