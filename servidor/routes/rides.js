const express = require('express');
const Ride = require('../models/Ride');
const router = express.Router();

// Endpoint para criar uma nova viagem
router.post('/', async (req, res) => {
  try {
    const ride = new Ride(req.body);
    await ride.save();
    res.status(201).send(ride);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Endpoint para listar todas as viagens
router.get('/', async (req, res) => {
  try {
    const rides = await Ride.find();
    res.status(200).send(rides);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Endpoint para buscar caronas com filtros de origem, destino e data
router.get('/search', async (req, res) => {
    const { origin, destination, date } = req.query;
    try {
        const query = {};

        if (origin) query.origin = origin;
        if (destination) query.destination = destination;
        if (date) query.date = { $gte: new Date(date) };

        const rides = await Ride.find(query);
        res.status(200).json(rides);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Endpoint para obter uma viagem pelo ID
router.get('/:id', async (req, res) => {
    try {
      const ride = await Ride.findById(req.params.id);
      if (!ride) {
        return res.status(404).send('Viagem não encontrada');
      }
      res.status(200).send(ride);
    } catch (error) {
      res.status(400).send(error);
    }
});

// Endpoint para atualizar uma viagem pelo ID
router.put('/:id', async (req, res) => {
    try {
      const ride = await Ride.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!ride) {
        return res.status(404).send('Viagem não encontrada');
      }
      res.status(200).send(ride);
    } catch (error) {
      res.status(400).send(error);
    }
});  

// Endpoint para excluir uma viagem pelo ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedRide = await Ride.findByIdAndDelete(req.params.id);
    if (!deletedRide) return res.status(404).send({ error: 'Viagem não encontrada' });
    res.status(200).send({ message: 'Viagem excluída com sucesso' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
