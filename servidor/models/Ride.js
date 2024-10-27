const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  date: { type: Date, required: true },
  seats: { type: Number, required: true },
});

const Ride = mongoose.model('Ride', rideSchema);
module.exports = Ride;
