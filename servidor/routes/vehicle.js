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

// Rota para editar um veículo
router.put('/:id', isAuthenticated, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.session.userId;

        // Verifica se o veículo pertence ao usuário logado
        const vehicle = await Vehicle.findOne({ _id: id, userId });
        if (!vehicle) {
            return res.status(404).json({ error: 'Veículo não encontrado ou você não tem permissão para editá-lo.' });
        }

        // Atualiza o veículo com os dados enviados
        const updatedVehicle = await Vehicle.findByIdAndUpdate(
            id,
            { ...req.body },
            { new: true, runValidators: true }
        );

        res.status(200).json(updatedVehicle);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Rota para deletar um veículo
router.delete('/:id', isAuthenticated, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.session.userId;

        // Verifica se o veículo pertence ao usuário logado
        const vehicle = await Vehicle.findOne({ _id: id, userId });
        if (!vehicle) {
            return res.status(404).json({ error: 'Veículo não encontrado ou você não tem permissão para deletá-lo.' });
        }

        // Remove o veículo
        await Vehicle.findByIdAndDelete(id);

        res.status(200).json({ message: 'Veículo deletado com sucesso.' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


module.exports = router;
