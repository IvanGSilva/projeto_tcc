import axios from 'axios';

// URL da API
const API_URL = 'http://localhost:5000/api/rides';

const api = axios.create({
    // URL do servidor Express
    baseURL: 'http://localhost:5000/api', 
    withCredentials: true,
});

// Função para buscar as caronas por origem e destino
export const searchRides = async (filters) => {
    try {
        const response = await axios.get(`${API_URL}/search`, { 
            withCredentials: true, 
            params: filters 
        });
        console.log(response.data);
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Erro ao buscar caronas.';
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

// Função para adicionar um passageiro a uma carona
export const addPassengerToRide = async (rideId, userId) => {
    try {
        const response = await axios.put(
            `${API_URL}/${rideId}/addPassenger`,
            { loggedUserId: userId },
            { withCredentials: true }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Erro ao reservar a carona.';
    }
};

// Função para cancelar a reserva de uma carona
export const cancelReservation = async (rideId) => {
    try {
        const response = await api.post(`/rides/${rideId}/cancel`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Erro ao cancelar a reserva.';
    }
};

const apiServices = {
    api,
    createRide,
    getRideById,
    updateRide,
    getRides,
    deleteRide,

    addPassengerToRide,
    cancelReservation,
}

// Exportar todas as funções juntas
export default {
    apiServices
};
