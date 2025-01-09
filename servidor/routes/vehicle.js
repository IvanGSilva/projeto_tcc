const express = require('express');
const mongoose = require('mongoose');
const Vehicle = require('../models/Vehicle');
const User = require('../models/User');
const path = require('path');
const router = express.Router();

// Rota para criar um novo veículo
router.post('/', async (req, res) => {
    const { userId } = req.query;  // Acesse o userId da query string

    // Verifica se o userId é válido
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        console.log('userId inválido:', userId);
        return res.status(400).json({ error: 'userId inválido' });
    }

    try {
        const vehicleData = { ...req.body, userId: userId };
        const vehicle = new Vehicle(vehicleData);
        await vehicle.save();

        res.status(201).json(vehicle);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Rota para editar um veículo
router.put('/:id', async (req, res) => {
    const userId = req.query.userId;  // Acesse o userId da query string

    // Verifica se o userId é válido
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        console.log('userId inválido:', userId);
        return res.status(400).json({ error: 'userId inválido' });
    }

    try {
        const { id } = req.params;

        // Verifica se o veículo pertence ao usuário logado
        const vehicle = await Vehicle.findOne({ _id: id, userId: userId });
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


// Rota para listar veículos de um usuário
router.get('/', async (req, res) => {
    const { userId } = req.query;

    // Verifica se o userId é válido
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        console.log('userId inválido:', userId);
        return res.status(400).json({ error: 'userId inválido' });
    }

    try {
        const vehicles = await Vehicle.find({ userId });
        res.status(200).json(vehicles);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Rota para deletar um veículo
router.delete('/:id', async (req, res) => {
    const { userId } = req.query;

    // Verifica se o userId é válido
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        console.log('userId inválido:', userId);
        return res.status(400).json({ error: 'userId inválido' });
    }

    try {
        const { id } = req.params;
        const userId = userId;

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
