const express = require('express');
const multer = require('multer');
const path = require('path'); 
const sharp = require('sharp');
const fs = require('fs');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { isAgeValid, isCPFValid, isCNHValid } = require('../utils/validators');
const router = express.Router();

// Configuração do multer para armazenar a foto
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Diretório onde as fotos serão armazenadas
        cb(null, 'uploads/original');
    },
    filename: (req, file, cb) => {
        // Renomeia o arquivo com o timestamp e extensão correta
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// 'profilePicture' é o campo de arquivo enviado
const upload = multer({ storage: storage }).single('profilePicture'); 


// Função para converter e salvar a foto no formato .webp
const convertToWebP = (filePath) => {
    const outputFilePath = `uploads/webp/${path.basename(filePath, path.extname(filePath))}.webp`;
    return sharp(filePath)
        .webp({ quality: 70 })
        .toFile(outputFilePath)
        .then(() => outputFilePath)
        .catch(err => {
            throw new Error('Erro ao converter imagem para .webp');
        });
};

// Função para excluir o arquivo original
const deleteOriginalImage = (filePath) => {
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error('Erro ao excluir imagem original:', err);
        } else {
            console.log('Imagem original excluída com sucesso');
        }
    });
};

// Endpoint para criar um novo usuário
router.post('/register', upload, async (req, res) => {
    const { username, email, password, dateOfBirth, cpf, phone, gender, cnh } = req.body;
    // Caminho completo da imagem original
    const originalImagePath = req.file ? path.join('uploads/original', req.file.filename) : null;
    // Variável para armazenar o nome da imagem convertida
    let profilePicture = null; 

    // Verificando o que está sendo enviado no corpo da requisição
    console.log('Dados recebidos no servidor:', req.body);
    console.log('Foto recebida:', req.file);

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

        // Se houver foto, convertê-la para .webp
        if (originalImagePath) {
            // Converte a imagem para .webp
            profilePicture = await convertToWebP(originalImagePath); 
            // Exclui a imagem original
            deleteOriginalImage(originalImagePath); 
        }

        // Criando o usuário
        const user = new User({
            username,
            email,
            password: hashedPassword,
            dateOfBirth,
            cpf,
            phone,
            gender,
            // CNH será enviado apenas se presente
            cnh,  
            // Salva o nome da foto convertida
            profilePicture,
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

module.exports = router;
