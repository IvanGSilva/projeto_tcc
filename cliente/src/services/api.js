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
        // Filtro para excluir caronas com status "completed"
        const updatedFilters = { 
            ...filters, 
            status: { $ne: 'completed' }
        };

        const response = await axios.get(`${API_URL}/search`, { withCredentials: true, params: updatedFilters });
        return response.data;
    } catch (error) {
        if (error.response) {
            // Erro da resposta HTTP
            if (error.response.status === 401) {
                throw new Error('Não autorizado. Faça login para continuar.');
            } else if (error.response.status === 404) {
                throw new Error('Nenhuma viagem encontrada.');
            } else {
                throw new Error(error.response.data?.error || 'Erro desconhecido');
            }
        } else if (error.request) {
            // A requisição foi feita, mas não obteve resposta
            throw new Error('Erro de rede. Tente novamente mais tarde.');
        } else {
            // Erro ao configurar a requisição
            throw new Error('Erro ao configurar a requisição.');
        }
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

const apiServices = {
    api,
    createRide,
    getRideById,
    updateRide,
    getRides,
    deleteRide,
}

// Exportar todas as funções juntas
export default {
    apiServices
};
