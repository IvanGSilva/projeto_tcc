import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import styles from './RegisterVehicle.module.css';

const RegisterVehicle = ({ userId }) => {
    const [brands, setBrands] = useState([]);
    const [models, setModels] = useState([]);
    const [brandSelecionada, setBrandSelecionada] = useState(null);
    const [modelSelecionado, setModelSelecionado] = useState(null);
    const [year, setYear] = useState('');
    const [plate, setPlate] = useState('');
    const [isLoadingModels, setIsLoadingModels] = useState(false);

    // Fetch brands from the backend
    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/fipe/brands');
                setBrands(response.data.map((brand) => ({ value: brand.codigo, label: brand.nome })));
            } catch (error) {
                console.error('Erro ao buscar marcas:', error);
            }
        };
        fetchBrands();
    }, []);

    // Handle brand selection and fetch models
    const handleBrandChange = async (selectedOption) => {
        setBrandSelecionada(selectedOption);
        setModelSelecionado(null);
        setModels([]);
        setIsLoadingModels(true);

        try {
            const response = await axios.get(`http://localhost:5000/api/fipe/brand/${selectedOption.value}/models`);
            setModels(response.data.map((models) => ({ value: models.codigo, label: models.nome })));
        } catch (error) {
            console.error('Erro ao buscar modelos:', error);
        } finally {
            setIsLoadingModels(false);
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!brandSelecionada || !modelSelecionado || !year || !plate) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        const vehicle = {
            userId: userId,
            brand: brandSelecionada.label,
            model: modelSelecionado.label,
            year,
            plate
        };

        try {
            await axios.post('http://localhost:5000/api/vehicles', vehicle, { withCredentials: true });
            alert('Veículo cadastrado com sucesso!');
            setBrandSelecionada(null);
            setModelSelecionado(null);
            setYear('');
            setPlate('');
        } catch (error) {
            console.error('Erro ao cadastrar veículo:', error);
            alert('Erro ao cadastrar veículo: ' + error.message);
        }
    };

    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <h3>Cadastro de Veículo</h3>
                <Select
                    className={styles.input}
                    options={brands}
                    onChange={handleBrandChange}
                    value={brandSelecionada}
                    placeholder="Selecione a brand"
                    name="brand"
                />
                <Select
                    className={styles.input}
                    options={models}
                    onChange={setModelSelecionado}
                    value={modelSelecionado}
                    isDisabled={!brandSelecionada || isLoadingModels}
                    placeholder={isLoadingModels ? 'Carregando models...' : 'Selecione o model'}
                    name="model"
                />
                <input
                    className={styles.input}
                    type="text"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="Digite o year"
                    name="year"
                />
                <input
                    className={styles.input}
                    type="text"
                    value={plate}
                    onChange={(e) => setPlate(e.target.value)}
                    placeholder="Digite a plate (ex: ABC-1234)"
                    name="plate"
                />
                <button type="submit" className={styles.button}>
                    Cadastrar Veículo
                </button>
            </form>
        </div>
    );
};

export default RegisterVehicle;
