import React, { useState, useEffect } from 'react';
import RideForm from './components/RideForm';
import RideList from './components/RideList';
import { getRides, deleteRide } from './services/api'; // Importe também deleteRide

const App = () => {
  const [rides, setRides] = useState([]);
  const [currentRideId, setCurrentRideId] = useState(null);

  // Função para buscar as caronas
  const fetchRides = async () => {
    const data = await getRides();
    const sortedRides = data.sort((a, b) => new Date(a.date) - new Date(b.date));
    setRides(sortedRides);
  };

  useEffect(() => {
    fetchRides(); // Carrega as viagens ao montar o componente
  }, []);

  // Função para editar uma carona
  const handleEdit = (id) => {
    setCurrentRideId(id);
  };

  // Função que é chamada após o envio do formulário
  const handleFormSubmit = async () => {
    setCurrentRideId(null);
    await fetchRides(); // Atualiza a lista de viagens após o envio do formulário
  };

  // Função para deletar uma carona
  const handleDelete = async (id) => {
    await deleteRide(id); // Chama a função deleteRide
    await fetchRides(); // Atualiza a lista de viagens após a deleção
  };

  return (
    <div>
      <h1>Clone do BlaBlaCar</h1>
      <RideForm rideId={currentRideId} onFormSubmit={handleFormSubmit} />
      <RideList rides={rides} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
};

export default App;
