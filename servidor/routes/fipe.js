const express = require('express');
const axios = require('axios');
const router = express.Router();

// Função para buscar marcas
router.get('/brands', async (req, res) => {
    try {
        const response = await axios.get('https://parallelum.com.br/fipe/api/v1/carros/marcas');
        res.status(200).json(response.data);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar marcas: ' + err.message });
    }
});

// Função para buscar modelos de uma marca
router.get('/brand/:brandId/models', async (req, res) => {
    const { brandId } = req.params;
    try {
        const response = await axios.get(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${brandId}/modelos`);
        res.status(200).json(response.data.modelos);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar modelos: ' + err.message });
    }
});

module.exports = router;
