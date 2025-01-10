const express = require('express');
const Ride = require('../models/Ride');
const Vehicle = require('../models/Vehicle');
const { isRideDateTimeValid, isSeatsValid } = require('../utils/validators');
const {API_KEY} = require('../utils/apikey');
const router = express.Router();
const axios = require('axios');

// Função para calcular a distância utilizando a API do Google Maps
const calculateDistance = async (origin, destination) => {
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${encodeURIComponent(
        origin
    )}&destinations=${encodeURIComponent(destination)}&key=${API_KEY}`;

    try {
        const response = await axios.get(url);
        const data = response.data;

        if (
            data.rows &&
            data.rows[0] &&
            data.rows[0].elements &&
            data.rows[0].elements[0].status === 'OK'
        ) {
            const distanceInMeters = data.rows[0].elements[0].distance.value;
            const distanceInKm = distanceInMeters / 1000; 
            return distanceInKm;
        } else {
            throw new Error('Não foi possível calcular a distância entre os endereços.');
        }
    } catch (error) {
        console.error('Erro ao calcular distância:', error.message);
        throw new Error('Erro ao calcular distância.');
    }
};

// Função para calcular o preço da carona com base na distancia
const calculatePrice = async (distance, seats) =>{
    try {
        const price = (distance*5)/seats;
        return price;
    } catch (error){
        console.error('Erro ao calcular o preço da carona:', error.message);
        throw new Error('Erro ao calcular o preço');
    }
}

// Endpoint para criar uma nova viagem
router.post('/', async (req, res) => {
    try {
        const loggedUserId = req.query.loggedUserId || req.body.loggedUserId;
        const { origin, destination, date, time, seats, vehicleId } = req.body;

        if (!origin || !destination || !date || !time || !seats) {
            return res.status(400).send({ error: 'Todos os campos são obrigatórios.' });
        }

        const distance = await calculateDistance(origin, destination);
        const price = await calculatePrice(distance, seats);

        const vehicles = await Vehicle.find({ userId: loggedUserId });
        const selectedVehicle = vehicleId
            ? vehicles.find(vehicle => vehicle._id.toString() === vehicleId)
            : vehicles[0];

        if (!selectedVehicle) {
            return res.status(400).send({ error: 'Veículo inválido' });
        }

        const rideData = {
            driver: loggedUserId,
            vehicle: selectedVehicle._id,
            origin,
            destination,
            date: new Date(date),
            time,
            seats,
            passengers: [],
            status: 'not_started',
            distance,
            price,
        };

        const ride = new Ride(rideData);
        await ride.save();
        res.status(201).json(ride);
    } catch (error) {
        console.error('Erro ao criar carona:', error.message);
        res.status(500).send({ error: error.message });
    }
});

// Endpoint para atualizar uma viagem pelo ID
router.put('/:id', async (req, res) => {
    try {
        const rideId = req.params.id;
        const loggedUserId = req.query.loggedUserId || req.body.loggedUserId;
        const { origin, destination, date, time, seats, status } = req.body;

        if (!origin || !destination || !date || !time || !seats) {
            return res.status(400).send({ error: 'Todos os campos são obrigatórios.' });
        }

        const distance = await calculateDistance(origin, destination);
        const price = await calculatePrice(distance, seats);

        const ride = await Ride.findById(rideId);
        if (!ride) {
            return res.status(404).send({ error: 'Carona não encontrada.' });
        }

        if (ride.driver.toString() !== loggedUserId) {
            return res.status(403).send({ error: 'Você não tem permissão para editar esta carona.' });
        }

        ride.origin = origin;
        ride.destination = destination;
        ride.date = new Date(date);
        ride.time = time;
        ride.seats = seats;
        ride.status = status || ride.status;
        ride.distance = distance;
        ride.price = price;

        await ride.save();
        res.status(200).json(ride);
    } catch (error) {
        console.error('Erro ao atualizar carona:', error.message);
        res.status(500).send({ error: error.message });
    }
});

// Endpoint para buscar caronas por origem e destino
router.get('/search', async (req, res) => {
    const { origin, destination } = req.query;

    try {
        const query = {
            status: { $ne: 'completed' }, // Exclui caronas com status "completed"
        };

        // Adiciona o filtro de origem, se fornecido
        if (origin) {
            query.origin = { $regex: new RegExp(origin, 'i') }; // Busca insensível a maiúsculas/minúsculas
        }

        // Adiciona o filtro de destino, se fornecido
        if (destination) {
            query.destination = { $regex: new RegExp(destination, 'i') }; // Busca insensível a maiúsculas/minúsculas
        }

        // Busca as caronas com os filtros aplicados
        const rides = await Ride.find(query)
            .populate('driver', 'username profilePicture')  // Popula o motorista com os campos necessários
            .populate('vehicle', 'model color plate');     // Popula o veículo com os campos necessários

        if (rides.length === 0) {
            return res.status(404).json({ error: 'Nenhuma carona encontrada com os filtros fornecidos.' });
        }
        console.log(rides); // Verifique se os dados agora estão completos

        res.status(200).json(rides);
    } catch (error) {
        console.error('Erro ao buscar caronas:', error.message);
        res.status(500).json({ error: 'Erro ao buscar caronas.' });
    }
});

// Endpoint para listar as viagens do motorista logado
router.get('/', async (req, res) => {
    const { loggedUserId } = req.query;
    try {
        const rides = await Ride.find({ driver: loggedUserId });
        res.status(200).json(rides);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//Endpoint para listar uma viagem pelo ID
router.get('/:id', async (req, res) => {
    try {
        const ride = await Ride.findById(req.params.id);
        if (!ride) {
            return res.status(404).send('Viagem não encontrada');
        }
        res.status(200).send(ride);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// Endpoint para excluir uma viagem pelo ID
router.delete('/:id', async (req, res) => {
    const loggedUserId = req.query.loggedUserId || req.body.loggedUserId;

    try {
        const ride = await Ride.findById(req.params.id);

        if (!ride) {
            return res.status(404).send({ error: 'Viagem não encontrada' });
        }

        // Verifica se o motorista da viagem é o usuário logado
        if (ride.driver.toString() !== loggedUserId) {
            return res
                .status(403)
                .send({ error: 'Você não tem permissão para deletar esta viagem.' });
        }

        await Ride.findByIdAndDelete(req.params.id);
        res.status(200).send({ message: 'Viagem excluída com sucesso' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

module.exports = router;
