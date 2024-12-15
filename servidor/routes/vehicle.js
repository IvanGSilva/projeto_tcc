const express = require('express');
const Vehicle = require('../models/Vehicle');
const router = express.Router();

// Middleware para verificar se o usuário está autenticado
const isAuthenticated = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).send({ error: 'Usuário não autenticado' });
    }
    next();
};

// Rota para criar um novo veículo
router.post('/', isAuthenticated, async (req, res) => {
    try {
        // Verificar se o usuário está autenticado
        if (!req.session.userId) {
            return res.status(401).send({ error: 'Usuário não autenticado' });
        }

        const vehicleData = { ...req.body, userId: req.session.userId  };
        const vehicle = new Vehicle(vehicleData);
        await vehicle.save();
        
        res.status(201).json(vehicle);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Rota para listar veículos de um usuário
router.get('/', async (req, res) => {
    try {
        const vehicles = await Vehicle.find({ userId: req.session.userId });
        res.status(200).json(vehicles);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
