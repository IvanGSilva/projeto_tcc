import React, { useState, useEffect, useRef } from 'react';
import { searchRides } from '../../services/api';
import MapComponent from './Map/Map';
import styles from './Home.module.css';

const Home = ({ loggedUserId }) => {
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [rides, setRides] = useState([]);
    const [loading, setLoading] = useState(false);
    const [directions, setDirections] = useState(null);
    const [searchMade, setSearchMade] = useState(false);
    const [error, setError] = useState(null);

    const originRef = useRef(null);
    const destinationRef = useRef(null);

    useEffect(() => {
        if (window.google && originRef.current && destinationRef.current) {
            const originInput = originRef.current;
            const destinationInput = destinationRef.current;

            if (originInput instanceof HTMLInputElement && destinationInput instanceof HTMLInputElement) {
                const originAutocomplete = new window.google.maps.places.Autocomplete(originInput);
                originAutocomplete.addListener('place_changed', () => {
                    const place = originAutocomplete.getPlace();
                    setOrigin(place.formatted_address || '');
                });

                const destinationAutocomplete = new window.google.maps.places.Autocomplete(destinationInput);
                destinationAutocomplete.addListener('place_changed', () => {
                    const place = destinationAutocomplete.getPlace();
                    setDestination(place.formatted_address || '');
                });
            } else {
                console.error('Os elementos de entrada não são válidos para o Autocomplete');
            }
        }
    }, []);

    const handleSearch = async () => {
        if (!origin || !destination) {
            alert('Por favor, preencha ambos os campos!');
            return;
        }

        setLoading(true);
        setSearchMade(false);

        try {
            const directionsService = new window.google.maps.DirectionsService();
            directionsService.route(
                {
                    origin,
                    destination,
                    travelMode: window.google.maps.TravelMode.DRIVING,
                },
                async (result, status) => {
                    if (status === window.google.maps.DirectionsStatus.OK) {
                        setDirections(result);
                        const availableRides = await searchRides({ origin, destination });
                        setRides(availableRides);
                        setSearchMade(true);
                    } else {
                        setError('Erro ao buscar rota no mapa');
                    }
                }
            );
        } catch (error) {
            setError('Erro ao buscar caronas ou rota no mapa');
        } finally {
            setLoading(false);
        }
    };

    const handleClearSearch = () => {
        setOrigin('');
        setDestination('');
        setRides([]);
        setSearchMade(false);
        setDirections(null);
        setError(null);
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
                            ref={originRef}
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
                            ref={destinationRef}
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
                    <ul className={styles.list}>
                        {rides.map((ride) => {
                            // Formatar a data no formato dd/mm hh:mm
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
                                </li>
                            )
                        })}
                    </ul>
                )}
                {error && <p className={styles.error}>{error}</p>}
            </div>

            <div className={styles.map}>
                <MapComponent
                    origin={origin}
                    destination={destination}
                    directions={directions}
                />
            </div>
        </div>
    );
};

export default Home;
