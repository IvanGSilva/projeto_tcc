// components/Home.js
import React, { useState } from 'react';
import { searchRides } from '../../services/api'; // Função para buscar as viagens

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
    <div>
      <h2>Encontre Caronas</h2>
      <input
        type="text"
        placeholder="Onde você está agora?"
        value={origin}
        onChange={(e) => setOrigin(e.target.value)}
      />
      <input
        type="text"
        placeholder="Para onde você vai?"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
      />
      <button onClick={handleSearch} disabled={loading}>
        {loading ? 'Carregando...' : 'Buscar'}
      </button>

      <h3>Resultados:</h3>
      <ul>
        {rides.map((ride) => (
          <li key={ride._id}>
            {ride.origin} - {ride.destination} - {ride.date}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
