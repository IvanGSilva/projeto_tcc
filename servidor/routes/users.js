const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Endpoint para criar um novo usuário
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const user = new User({ username, password });
  await user.save();
  res.status(201).send(user);
});

module.exports = router;
