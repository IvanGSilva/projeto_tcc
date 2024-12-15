import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './ListVehicle.module.css';

const ListVehicle = () => {
    const [vehicles, setVehicles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchVehicles = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/vehicles', { withCredentials: true });
            setVehicles(response.data);
        } catch (error) {
            console.error('Erro ao buscar veículos:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchVehicles();
    }, []);

    if (isLoading) {
        return <p>Carregando...</p>;
    }

    return (
        <>
            <h2 className={styles.title}>Seus Veículos</h2>
            <div className={styles.container}>
                {vehicles.length > 0 ? (
                    <ul className={styles.list}>
                        {vehicles.map((vehicle) => (
                            <li key={vehicle._id} className={styles.item}>
                                <p><strong>Modelo:</strong> {vehicle.model}</p>
                                <p><strong>Placa:</strong> {vehicle.plate}</p>
                                <p><strong>Cor:</strong> {vehicle.color}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className={styles.noVehicles}>Nenhum veículo cadastrado ainda.</p>
                )}
            </div></>
    );
};

export default ListVehicle;
