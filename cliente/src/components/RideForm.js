// components/RideForm.js
import React, { useState, useEffect } from 'react';
import { createRide, getRideById, updateRide } from '../services/api';

const RideForm = ({ rideId, onFormSubmit }) => {
  const [rideData, setRideData] = useState({
    origin: '',
    destination: '',
    seats: '',
    date: '',
    driver: '',
  });

  useEffect(() => {
    if (rideId) {
      const fetchRide = async () => {
        try {
          const ride = await getRideById(rideId);
          setRideData(ride);
        } catch (error) {
          console.error('Erro ao buscar a viagem:', error);
        }
      };
      fetchRide();
    }
  }, [rideId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRideData({ ...rideData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (rideId) {
        // Atualiza a viagem existente
        await updateRide(rideId, rideData);
      } else {
        // Cria uma nova viagem
        await createRide(rideData);
      }
      onFormSubmit(); // Chama a função de retorno após o envio
    } catch (error) {
      console.error('Erro ao salvar a viagem:', error);
      alert('Erro ao salvar a viagem: ' + error.message); // Mostra um alerta com a mensagem de erro
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="origin"
        value={rideData.origin}
        onChange={handleChange}
        placeholder="Origem"
        required
      />
      <input
        name="destination"
        value={rideData.destination}
        onChange={handleChange}
        placeholder="Destino"
        required
      />
      <input
        name="seats"
        value={rideData.seats}
        onChange={handleChange}
        placeholder="Assentos"
        required
      />
      <input
        type="datetime-local"
        name="date"
        value={rideData.date}
        onChange={handleChange}
        required
      />
      <input
        name="driver"
        value={rideData.driver}
        onChange={handleChange}
        placeholder="Nome do Motorista"
        required
      />
      <button type="submit">Salvar</button>
    </form>
  );
};

export default RideForm;
