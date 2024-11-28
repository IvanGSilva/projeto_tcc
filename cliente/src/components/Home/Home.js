import React, { useState } from 'react';
import { searchRides } from '../../services/api'; // Função para buscar as viagens
import styles from './Home.module.css';

const Home = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!origin || !destination) {
      alert('Por favor, preencha ambos os campos!');
      return;
    }

    setLoading(true);
    try {
      const availableRides = await searchRides({ origin, destination });
      setRides(availableRides);
    } catch (error) {
      console.error('Erro ao buscar caronas:', error);
      alert('Erro ao buscar caronas.');
    } finally {
      setLoading(false);
    }
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

      <h3>Resultados:</h3>
      <ul className={styles.list}>
        {rides.map((ride) => (
          <li className={styles.listItem} key={ride._id}>
            {ride.origin} - {ride.destination} - {ride.date}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
