import React, { useState } from 'react';
import { searchRides } from '../../services/api'; // Função para buscar as viagens
import styles from './Home.module.css';

const Home = () => {
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
        setError(null); // Limpa o erro
    };

    return (
        <>
            <div className={styles.content}>
                <div className={styles.container}>
                    <div className={styles.rideSearchForm}>
                        <h2 className={styles.title}>
                            Encontre Caronas
                        </h2>
                        <div className={styles.inputDiv}>
                            <i class="fa-solid fa-map-location-dot"></i>
                            <input className={styles.input}
                                type="text"
                                placeholder="Onde você está agora?"
                                value={origin}
                                onChange={(e) => setOrigin(e.target.value)} />
                        </div>

                        <div className={styles.inputDiv}>
                            <i class="fa-solid fa-route"></i>
                            <input className={styles.input}
                                type="text"
                                placeholder="Para onde você vai?"
                                value={destination}
                                onChange={(e) => setDestination(e.target.value)} />
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
                                            <div><strong>Origem:</strong> {ride.origin}</div>
                                            <div><strong>Destino:</strong> {ride.destination}</div>
                                            <div><strong>Data:</strong> {formattedDate}</div>
                                            <div><strong>Assentos:</strong> {ride.seats}</div>
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
                    {/* mapa placeholder */}
                </div>
            </div>
        </>
    );
};

export default Home;
