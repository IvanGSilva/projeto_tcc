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
    <div className={styles.container}>
      <h2 className={styles.title}>Encontre Caronas</h2>
      <input className={styles.input}
        type="text"
        placeholder="Onde você está agora?"
        value={origin}
        onChange={(e) => setOrigin(e.target.value)}
      />
      <input className={styles.input}
        type="text"
        placeholder="Para onde você vai?"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
      />
      <button className={styles.button} onClick={handleSearch} disabled={loading}>
        {loading ? 'Carregando...' : 'Buscar'}
      </button>

      <button className={styles.button} onClick={handleClearSearch}>
        Limpar
      </button>

        {searchMade && rides.length > 0 && (
            <div>
                <h3>Resultados:</h3>
                <ul className={styles.list}>
                    {rides.map((ride) => (
                    <li className={styles.listItem} key={ride._id}>
                        {ride.origin} - {ride.destination} - {ride.date}
                    </li>
                    ))}
                </ul>
            </div>
        )}

        {searchMade && rides.length === 0 && !loading && !error &&(
            <p className={styles.noResults}>Nenhuma carona encontrada.</p>
        )}
    </div>
  );
};

export default Home;
