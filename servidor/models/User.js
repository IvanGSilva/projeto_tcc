const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    cpf: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    gender: { type: String, enum: ['M', 'F', 'O'], required: true },
    cnh: { type: String, required: false }, // Opcional
    profilePicture: { type: String, default: null },
});

module.exports = mongoose.model('User', UserSchema);
