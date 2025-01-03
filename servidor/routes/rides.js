const express = require('express');
const Ride = require('../models/Ride');
const Vehicle = require('../models/Vehicle');
const { isRideDateTimeValid, isSeatsValid } = require('../utils/validators');
const router = express.Router();

// Middleware para verificar se o usuário está autenticado
const isAuthenticated = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).send({ error: 'Usuário não autenticado' });
    }
    next();
};

// Endpoint para criar uma nova viagem
router.post('/', isAuthenticated, async (req, res) => {
    try {
        const { origin, destination, date, time, seats, vehicleId } = req.body;

        // Validação básica dos novos campos
        if (!origin || !destination || !date || !time || !seats) {
            if(seats == 0){
                return res.status(400).send({ error: 'A viagem deve ter pelo menos 1 assento disponível.' });
            }
            return res.status(400).send({ error: 'Todos os campos são obrigatórios.' });
        }

        // Valida a data e hora
        const { valid: dateTimeValid, error: dateTimeError } = isRideDateTimeValid(date, time);
        if (!dateTimeValid) {
            return res.status(400).send({ error: dateTimeError });
        }

        // Valida o número de assentos
        const { valid: seatsValid, error: seatsError } = isSeatsValid(seats);
        if (!seatsValid) {
            return res.status(400).send({ error: seatsError });
        }

        // Buscar os veículos do motorista logado
        const vehicles = await Vehicle.find({ userId: req.session.userId });

        // Caso o motorista tenha apenas um veículo, associamos automaticamente à viagem
        if (vehicles.length === 1) {
            // Associar o único veículo automaticamente à viagem
            const rideData = {
                driver: req.session.userId,
                vehicle: vehicles[0]._id, // Veículo automaticamente associado
                origin,
                destination,
                date: new Date(date),
                time,
                seats,
                passengers: [], // Inicialmente sem passageiros
                status: 'not_started', // Status padrão
            };
            const ride = new Ride(rideData);
            await ride.save();
            return res.status(201).json(ride);
        }

        // Caso o motorista tenha mais de um veículo, precisamos que ele escolha um
        if (vehicles.length > 1 && !vehicleId) {
            return res.status(400).send({ error: 'Escolha um veículo para a viagem' });
        }

        // Se o veículo foi escolhido ou o motorista tem apenas um veículo
        const selectedVehicle = vehicles.find(vehicle => vehicle._id.toString() === vehicleId);

        if (!selectedVehicle) {
            return res.status(400).send({ error: 'Veículo inválido' });
        }

        // Criar a viagem com o veículo selecionado
        const rideData = {
            driver: req.session.userId,
            vehicle: selectedVehicle._id, // Veículo escolhido
            origin,
            destination,
            date: new Date(date),
            time,
            seats,
            passengers: [], // Inicialmente sem passageiros
            status: 'not_started', // Status padrão
        };

        const ride = new Ride(rideData);
        await ride.save();

        res.status(201).json(ride);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// Endpoint para listar as viagens do motorista logado
router.get('/', isAuthenticated, async (req, res) => {
    try {
        const rides = await Ride.find({ driver: req.session.userId });
        res.status(200).json(rides);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint para buscar caronas com filtros de origem, destino, data e status
router.get('/search', async (req, res) => {
    const { origin, destination, date, status } = req.query;

    try {
        const query = {};
        if (origin) query.origin = origin;
        if (destination) query.destination = destination;
        if (date) query.date = { $gte: new Date(date) };
        if (status) query.status = status;
        if (req.session.userId) {
            query.driver = { $ne: req.session.userId }; // Excluir viagens do motorista logado
        }

        // Buscar viagens com o motorista populado
        const rides = await Ride.find(query)
            .populate('driver', 'username profilePicture')
            .populate('vehicle', 'model color plate');

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
        res.status(400).send({ error: error.message });
    }
});

// Endpoint para atualizar uma viagem pelo ID
router.put('/:id', isAuthenticated, async (req, res) => {
    try {
        const { origin, destination, date, time, seats, status } = req.body;
        const ride = await Ride.findById(req.params.id);

        if (!ride) {
            return res.status(404).send('Viagem não encontrada');
        }

        // Verifica se o motorista da viagem é o usuário logado
        if (ride.driver.toString() !== req.session.userId) {
            return res.status(403).send({ error: 'Você não tem permissão para editar esta viagem' });
        }

        // Verifica a data e hora
        if (date && time) {
            const { valid: dateTimeValid, error: dateTimeError } = isRideDateTimeValid(date, time);
            if (!dateTimeValid) {
                return res.status(400).send({ error: dateTimeError });
            }
        }

        // Verifica a quantidade de assentos
        if (seats) {
            const { valid: seatsValid, error: seatsError } = isSeatsValid(seats);
            if (!seatsValid) {
                return res.status(400).send({ error: seatsError });
            }
        }

        // Atualiza os campos permitidos
        ride.origin = origin || ride.origin;
        ride.destination = destination || ride.destination;
        ride.date = date ? new Date(date) : ride.date;
        ride.time = time || ride.time;
        ride.seats = seats || ride.seats;
        ride.status = status || ride.status;

        // Salva a viagem atualizada
        await ride.save();

        res.status(200).send(ride);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});


// Endpoint para adicionar um passageiro a uma viagem
router.post('/:id/passengers', isAuthenticated, async (req, res) => {
    try {
        const ride = await Ride.findById(req.params.id);

        if (!ride) {
            return res.status(404).send({ error: 'Viagem não encontrada' });
        }

        if (ride.passengers.includes(req.session.userId)) {
            return res.status(400).send({ error: 'Você já está na lista de passageiros' });
        }

        if (ride.passengers.length >= ride.seats) {
            return res.status(400).send({ error: 'Não há mais assentos disponíveis' });
        }

        ride.passengers.push(req.session.userId);
        await ride.save();

        res.status(200).send({ message: 'Passageiro adicionado com sucesso', ride });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Endpoint para excluir uma viagem pelo ID
router.delete('/:id', isAuthenticated, async (req, res) => {
    try {
        const ride = await Ride.findById(req.params.id);

        if (!ride) {
            return res.status(404).send({ error: 'Viagem não encontrada' });
        }

        if (ride.driver.toString() !== req.session.userId) {
            return res.status(403).send({ error: 'Você não tem permissão para excluir esta viagem' });
        }

        await Ride.findByIdAndDelete(req.params.id);
        res.status(200).send({ message: 'Viagem excluída com sucesso' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

module.exports = router;
