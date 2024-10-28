// src/services/apiService.js

import axios from 'axios';

const API_URL = 'http://localhost:5000/api/rides'; // Altere para o URL do seu backend se necessário

// Função para criar uma nova carona
export const createRide = async (rideData) => {
  try {
    const response = await axios.post(API_URL, rideData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Função para obter todas as caronas
export const getRides = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Função para obter uma carona específica por ID
export const getRideById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Função para atualizar uma carona
export const updateRide = async (id, rideData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, rideData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Função para deletar uma carona
export const deleteRide = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
    return { message: 'Ride deleted successfully' };
  } catch (error) {
    throw error.response.data;
  }
};

// Função para buscar caronas com filtros
export const searchRides = async (filters) => {
  try {
    const response = await axios.get(`${API_URL}/search`, { params: filters });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
