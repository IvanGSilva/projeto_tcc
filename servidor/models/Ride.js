const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    seats: { type: Number, required: true },
    passengers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    status: { 
        type: String, 
        enum: ['not_started', 'in_progress', 'completed'],
        default: 'not_started'
    },
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    distance: { type: Number, required: true },
    price: { type: String, required: true },
});

const Ride = mongoose.model('Ride', rideSchema);
module.exports = Ride;
