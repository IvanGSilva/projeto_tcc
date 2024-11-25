const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config(); // Carregar variáveis de ambiente primeiro

const app = express();
const PORT = process.env.PORT || 5000;

const userRoutes = require('./routes/users');
const rideRoutes = require('./routes/rides');

// Middlewares
app.use(session({
    secret: 'senhaCookies',
    resave: false,
    saveUninitialized: false, // Somente salva se houver mudanças
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    cookie: {
        secure: false, // Definir como true em produção (com HTTPS)
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24, // Expira em 1 dia
    }
}));


app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

// Rotas
app.use('/api/users', userRoutes);
app.use('/api/rides', rideRoutes);

// Conectar ao MongoDB e iniciar o servidor
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Conectado ao MongoDB');
        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
        });
    })
    .catch(err => console.error('Erro ao conectar ao MongoDB:', err));
