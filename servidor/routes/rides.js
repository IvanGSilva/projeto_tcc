const express = require('express');
const Ride = require('../models/Ride');
const router = express.Router();

// Endpoint para criar uma nova viagem
router.post('/', async (req, res) => {
  const ride = new Ride(req.body);
  await ride.save();
  res.status(201).send(ride);
});

module.exports = router;
