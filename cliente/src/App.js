import React, { useState, useEffect } from 'react';
import RideForm from './components/RideForm';
import RideList from './components/RideList';
import { getRides, deleteRide } from './services/api'; // Importa também deleteRide
import Login from './components/Login'; // Importa o componente de Login

const App = () => {
  const [rides, setRides] = useState([]);
  const [currentRideId, setCurrentRideId] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado de autenticação

  // Função para buscar as caronas
  const fetchRides = async () => {
    const data = await getRides();
    const sortedRides = data.sort((a, b) => new Date(a.date) - new Date(b.date));
    setRides(sortedRides);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchRides(); // Carrega as viagens se o usuário estiver autenticado
    }
  }, [isAuthenticated]);

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

  // Função para lidar com o login
  const handleLogin = (success) => {
    setIsAuthenticated(success); // Atualiza o estado de autenticação com base no sucesso
  };

  return (
    <div>
      <h1>Clone do BlaBlaCar</h1>
      
      {/* Exibe o componente de Login se não estiver autenticado */}
      {!isAuthenticated ? (
        <Login onLogin={handleLogin} />
      ) : (
        <>
          {/* Exibe o formulário e a lista de caronas após o login */}
          <RideForm rideId={currentRideId} onFormSubmit={handleFormSubmit} />
          <RideList rides={rides} onEdit={handleEdit} onDelete={handleDelete} />
        </>
      )}
    </div>
  );
};

export default App;
