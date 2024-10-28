const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config(); // Carregar variáveis de ambiente primeiro

const app = express();
const PORT = process.env.PORT || 5000;

const userRoutes = require('./routes/users');
const rideRoutes = require('./routes/rides');

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/users', userRoutes);
app.use('/api/rides', rideRoutes);

// Rota de teste
app.get('/', (req, res) => {
  res.send('API do BlaBlaCar Clone');
});

// Conectar ao MongoDB e iniciar o servidor
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Conectado ao MongoDB');
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));
