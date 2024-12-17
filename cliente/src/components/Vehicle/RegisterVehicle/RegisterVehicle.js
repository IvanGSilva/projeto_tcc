import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import styles from './RegisterVehicle.module.css';

const RegisterVehicle = ({ userId, vehicleData = null, onClose, onSave }) => {
    const [brands, setBrands] = useState([]);
    const [models, setModels] = useState([]);
    const [brandSelecionada, setBrandSelecionada] = useState(vehicleData ? { label: vehicleData.brand, value: vehicleData.brand } : null);
    const [modelSelecionado, setModelSelecionado] = useState(vehicleData ? { label: vehicleData.model, value: vehicleData.model } : null);
    const [year, setYear] = useState(vehicleData?.year || '');
    const [plate, setPlate] = useState(vehicleData?.plate || '');
    const [color, setColor] = useState(vehicleData?.color || '');
    const [isLoadingModels, setIsLoadingModels] = useState(false);

    // Busca as marcas da API da fipe
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

    // Busca os modelos da marca selecionada
    const handleBrandChange = async (selectedOption) => {
        setBrandSelecionada(selectedOption);
        setModelSelecionado(null);
        setModels([]);
        setIsLoadingModels(true);

        try {
            const response = await axios.get(`http://localhost:5000/api/fipe/brand/${selectedOption.value}/models`);
            setModels(response.data.map((model) => ({ value: model.codigo, label: model.nome })));
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
            color,
            plate
        };

        try {
            if (vehicleData) {
                // Editar um veiculo
                await axios.put(`http://localhost:5000/api/vehicles/${vehicleData._id}`, vehicle, { withCredentials: true });
                alert('Veículo atualizado com sucesso!');
            } else {
                // Criar um novo veiculo
                await axios.post('http://localhost:5000/api/vehicles', vehicle, { withCredentials: true });
                alert('Veículo cadastrado com sucesso!');
            }
            onSave();
            onClose();
        } catch (error) {
            console.error('Erro ao salvar veículo:', error);
            alert('Erro ao salvar veículo: ' + error.message);
        }
    };

    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <h3>{vehicleData ? 'Editar Veículo' : 'Cadastrar Veículo'}</h3>
                <Select
                    className={styles.select}
                    options={brands}
                    onChange={handleBrandChange}
                    value={brandSelecionada}
                    placeholder="Selecione a marca"
                    name="brand"
                />
                <Select
                    className={styles.select}
                    options={models}
                    onChange={setModelSelecionado}
                    value={modelSelecionado}
                    isDisabled={!brandSelecionada || isLoadingModels}
                    placeholder={isLoadingModels ? 'Carregando modelos...' : 'Selecione o modelo'}
                    name="model"
                />
                <input
                    className={styles.input}
                    type="text"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="Digite o ano"
                    name="year"
                />
                <input
                    className={styles.input}
                    type="text"
                    value={plate}
                    onChange={(e) => setPlate(e.target.value)}
                    placeholder="Digite a placa (ex: ABC-1234)"
                    name="plate"
                />
                <input
                    className={styles.input}
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    placeholder="Digite a cor do veículo"
                    name="color"
                />
                <div className={styles.actions}>
                    <button type="submit" className={styles.button}>
                        {vehicleData ? 'Salvar Alterações' : 'Cadastrar Veículo'}
                    </button>
                    <button type="button" className={styles.button} onClick={onClose}>
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RegisterVehicle;
