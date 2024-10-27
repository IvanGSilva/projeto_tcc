const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

const mongoose = require('mongoose');
const dotenv = require('dotenv');

const userRoutes = require('./routes/users');
const rideRoutes = require('./routes/rides');

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/rides', rideRoutes);

app.get('/', (req, res) => {
  res.send('API do BlaBlaCar Clone');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));