import React, { useState, useEffect } from 'react';
import { searchRides, reserveRide, cancelReservation } from '../../services/api';
import styles from './Home.module.css';

const Home = ({ loggedUserId }) => {
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [rides, setRides] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchMade, setSearchMade] = useState(false);
    const [error, setError] = useState(null);

    const handleSearch = async () => {
        if (!origin || !destination) {
            alert('Por favor, preencha ambos os campos!');
            return;
        }

        setLoading(true);
        setSearchMade(true);
        setError(null);

        try {
            const availableRides = await searchRides({ origin, destination });
            setRides(availableRides);
        } catch (error) {
            console.error('Erro ao buscar caronas:', error);
            alert('Erro ao buscar caronas.');
            setRides([]);
        } finally {
            setLoading(false);
        }
    };

    const handleClearSearch = () => {
        setOrigin('');
        setDestination('');
        setRides([]);
        setSearchMade(false);
        setError(null);
    };

    const handleReserve = async (rideId) => {
        try {
            const updatedRide = await reserveRide(rideId);
            alert('Reserva realizada com sucesso!');
            setRides((prevRides) =>
                prevRides.map((ride) => (ride._id === updatedRide.ride._id ? updatedRide.ride : ride))
            );
        } catch (error) {
            alert(`Erro ao reservar carona: ${error}`);
        }
    };

    const handleCancelReservation = async (rideId) => {
        try {
            const updatedRide = await cancelReservation(rideId);
            alert('Reserva cancelada com sucesso!');
            setRides((prevRides) =>
                prevRides.map((ride) => (ride._id === updatedRide.ride._id ? updatedRide.ride : ride))
            );
        } catch (error) {
            alert(`Erro ao cancelar reserva: ${error}`);
        }
    };

    return (
        <div className={styles.content}>
            <div className={styles.container}>
                <div className={styles.rideSearchForm}>
                    <h2 className={styles.title}>Encontre Caronas</h2>
                    <div className={styles.inputDiv}>
                        <i className="fa-solid fa-map-location-dot"></i>
                        <input
                            className={styles.input}
                            type="text"
                            placeholder="Onde você está agora?"
                            value={origin}
                            onChange={(e) => setOrigin(e.target.value)}
                        />
                    </div>

                    <div className={styles.inputDiv}>
                        <i className="fa-solid fa-route"></i>
                        <input
                            className={styles.input}
                            type="text"
                            placeholder="Para onde você vai?"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                        />
                    </div>

                    <div className={styles.buttonDiv}>
                        <button className={styles.button} onClick={handleSearch} disabled={loading}>
                            {loading ? 'Carregando...' : 'Buscar'}
                        </button>

                        <button className={styles.button} onClick={handleClearSearch}>
                            Limpar
                        </button>
                    </div>
                </div>

                {searchMade && rides.length > 0 && (
                    <div>
                        <h3>Resultados:</h3>
                        <ul className={styles.list}>
                            {rides.map((ride) => {
                                const rideDate = new Date(ride.date);
                                const formattedDate = rideDate.toLocaleString('pt-BR', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: false
                                });

                                return (
                                    <li className={styles.listItem} key={ride._id}>
                                        <div className={styles.ride_result}>
                                            <div className={styles.ride_data}>
                                                <div><strong>Origem:</strong> {ride.origin}</div>
                                                <div><strong>Destino:</strong> {ride.destination}</div>
                                                <div><strong>Data:</strong> {formattedDate}</div>
                                                <div><strong>Assentos:</strong> {ride.seats}</div>
                                            </div>

                                            <div className={styles.driver_and_vehicle}>
                                                {ride.driver && (
                                                    <>
                                                        <div className={styles.imageContainer}>
                                                            {ride.driver.profilePicture && (
                                                                <img
                                                                    className={styles.profileImage}
                                                                    src={`http://localhost:5000/${ride.driver.profilePicture}`}
                                                                    alt={`Foto de perfil de ${ride.driver.username}`}
                                                                />
                                                            )}
                                                        </div>
                                                        <div><strong>Condutor:</strong> {ride.driver.username}</div>
                                                    </>
                                                )}
                                                {ride.vehicle && (
                                                    <div>
                                                        <strong>Veículo:</strong>
                                                        <div><strong>Modelo: </strong>{ride.vehicle.model}</div>
                                                        <div><strong>Cor: </strong>{ride.vehicle.color}</div>
                                                        <div><strong>Placa: </strong>{ride.vehicle.plate}</div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className={styles.ride_options}>
                                            {ride.passengers.includes(loggedUserId) ? (
                                                <button
                                                    className={styles.button}
                                                    onClick={() => handleCancelReservation(ride._id)}
                                                >
                                                    Cancelar Reserva
                                                </button>
                                            ) : (
                                                <button
                                                    className={styles.button}
                                                    onClick={() => handleReserve(ride._id)}
                                                >
                                                    Reservar
                                                </button>
                                            )}
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}

                {searchMade && rides.length === 0 && !loading && !error && (
                    <p className={styles.noResults}>Nenhuma carona encontrada.</p>
                )}
            </div>

            <div className={styles.map}>
                {/* Mapa placeholder */}
            </div>
        </div>
    );
};

export default Home;
