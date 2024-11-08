const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Endpoint para criar um novo usuário
router.post('/register', async (req, res) => {
    try{
        const { username, email, password } = req.body;
        const user = new User({ username, email, password });
        await user.save();
        res.status(201).send(user);
    }catch (error){
        res.status(400).json({ error: 'Erro ao cadastrar usuário' });
    }
});

// Endpoint para login
router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (user && await bcrypt.compare(password, user.password)) {
        res.status(200).json({ message: 'Login realizado com sucesso!' });
      } else {
        res.status(401).json({ error: 'Credenciais inválidas' });
      }
    } catch (error) {
      res.status(400).json({ error: 'Erro ao fazer login' });
    }
  });

module.exports = router;
