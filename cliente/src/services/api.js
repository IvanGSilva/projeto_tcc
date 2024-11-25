// src/services/api.js
import axios from 'axios';

// URL da API
const API_URL = 'http://localhost:5000/api/rides';

const api = axios.create({
    baseURL: 'http://localhost:5000/api', // URL do seu servidor Express
});

// Função para buscar as caronas por origem e destino
export const searchRides = async (filters) => {
    try {
        const response = await axios.get(`${API_URL}/search`, { params: filters });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};  

// Função para criar uma nova carona
export const createRide = async (rideData) => {
    const response = await axios.post(API_URL, rideData);
    return response.data;
};

// Função para obter uma carona por ID
export const getRideById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

// Função para atualizar uma carona
export const updateRide = async (id, rideData) => {
    const response = await axios.put(`${API_URL}/${id}`, rideData);
    return response.data;
};

// Função para obter todas as caronas
export const getRides = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

// Função para deletar uma carona
export const deleteRide = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
};

// Exportar todas as funções juntas
export default {
    api,
    createRide,
    getRideById,
    updateRide,
    getRides,
    deleteRide,
};
