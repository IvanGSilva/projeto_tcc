const express = require('express');
const Ride = require('../models/Ride');
const Vehicle = require('../models/Vehicle');
const { isRideDateTimeValid, isSeatsValid } = require('../utils/validators');
const router = express.Router();

// Endpoint para criar uma nova viagem
router.post('/', async (req, res) => {
    try {
        const loggedUserId = req.query.loggedUserId || req.body.loggedUserId;
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
        const vehicles = await Vehicle.find({ userId: loggedUserId });

        // Caso o motorista tenha apenas um veículo, associamos automaticamente à viagem
        if (vehicles.length === 1) {
            // Associar o único veículo automaticamente à viagem
            const rideData = {
                driver: loggedUserId,
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

        // Caso o motorista tenha mais de um veículo,  ele escolhe um
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
            driver: loggedUserId,
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

// Endpoint para atualizar uma viagem pelo ID
router.put('/:id', async (req, res) => {
    const loggedUserId = req.query.loggedUserId || req.body.loggedUserId;
    const { origin, destination, date, time, seats, status } = req.body;

    try {
        const ride = await Ride.findById(req.params.id);

        if (!ride) {
            return res.status(404).send('Viagem não encontrada');
        }

        // Verifica se o motorista da viagem é o usuário logado
        if (ride.driver.toString() !== loggedUserId) {
            return res
                .status(403)
                .send({ error: 'Você não tem permissão para editar esta viagem.' });
        }

        // Atualiza os campos permitidos
        ride.origin = origin || ride.origin;
        ride.destination = destination || ride.destination;
        ride.date = date ? new Date(date) : ride.date; // Certifique-se do formato
        ride.time = time || ride.time;
        ride.seats = seats || ride.seats;
        ride.status = status || ride.status;

        // Salva a viagem atualizada
        await ride.save();

        res.status(200).send(ride);
    } catch (error) {
        console.error('Erro ao atualizar viagem:', error.message);
        res.status(400).send({ error: error.message });
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
    const { loggedUserId } = req.body;

    try {
        const ride = await Ride.findById(req.params.id);

        if (!ride) {
            return res.status(404).send({ error: 'Viagem não encontrada' });
        }

        if (ride.driver.toString() !== loggedUserId) {
            return res.status(403).send({ error: 'Você não tem permissão para excluir esta viagem' });
        }

        await Ride.findByIdAndDelete(req.params.id);
        res.status(200).send({ message: 'Viagem excluída com sucesso' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

module.exports = router;
