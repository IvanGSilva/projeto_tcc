const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

dotenv.config(); // Carregar variáveis de ambiente primeiro

const app = express();
const PORT = process.env.PORT || 5000;

const userRoutes = require('./routes/users');
const rideRoutes = require('./routes/rides');
const fipeRoutes = require('./routes/fipe');
const vehicleRoutes = require('./routes/vehicle');

// Configuração do Multer para armazenar as imagens temporariamente
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, 'uploads', 'profile_pictures');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const fileExtension = path.extname(file.originalname);
        const fileName = Date.now() + fileExtension;
        cb(null, fileName);
    }
});

const upload = multer({ storage });

// Middleware para servir arquivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware de sessão
app.use(session({
    secret: 'senhaCookies',
    resave: false,
    saveUninitialized: false, // Somente salva se houver mudanças
    store: MongoStore.create({ 
        mongoUrl: process.env.MONGODB_URI,
        ttl: 14 * 24 * 60 * 60,
        autoRemove: 'interval',
        autoRemoveInterval: 10
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // Expira em 1 dia
        httpOnly: true,
        secure: false, // Definir como true em produção (com HTTPS)
        sameSite: 'None',
    }
}));

// Middlewares
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

// Rotas
app.use('/api/users', userRoutes);
app.use('/api/rides', rideRoutes);
app.use('/api/fipe', fipeRoutes);
app.use('/api/vehicles', vehicleRoutes);

// Rota para upload de foto de perfil
app.post('/api/users/uploadProfilePicture', upload.single('profilePicture'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Nenhuma imagem enviada' });
        }

        const filePath = path.join(__dirname, 'uploads', 'profile_pictures', req.file.filename);
        const webpPath = filePath.replace(path.extname(req.file.filename), '.webp');

        // Convertendo a imagem para .webp
        await sharp(filePath)
            .webp({ quality: 80 }) // Ajuste a qualidade conforme necessário
            .toFile(webpPath);

        // Remover o arquivo original
        fs.unlinkSync(filePath);

        res.status(200).json({ message: 'Imagem carregada e convertida com sucesso', filePath: webpPath });
    } catch (error) {
        console.error('Erro ao processar a imagem:', error);
        res.status(500).json({ error: 'Erro ao processar a imagem' });
    }
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
