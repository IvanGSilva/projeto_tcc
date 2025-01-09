import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RegisterVehicle from '../RegisterVehicle/RegisterVehicle';
import styles from './ListVehicle.module.css';

const ListVehicle = ({ userId }) => {
    const [vehicles, setVehicles] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editingVehicle, setEditingVehicle] = useState(null);

    const fetchVehicles = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/vehicles`, {
                params: { userId },
                withCredentials: true,
            });
            setVehicles(response.data);
        } catch (error) {
            console.error('Erro ao buscar veículos:', error);
        }
    };

    const handleDelete = async (vehicleId) => {
        if (window.confirm('Tem certeza que deseja excluir este veículo?')) {
            try {
                await axios.delete(`http://localhost:5000/api/vehicles/${vehicleId}`, { withCredentials: true });
                alert('Veículo deletado com sucesso!');
                fetchVehicles();
            } catch (error) {
                console.error('Erro ao excluir veículo:', error);
                alert('Erro ao excluir veículo: ' + error.message);
            }
        }
    };

    const handleEdit = (vehicle) => {
        setEditingVehicle(vehicle);
        setIsEditing(true);
    };

    const handleSave = () => {
        setEditingVehicle(null);
        setIsEditing(false);
        fetchVehicles();
    };

    useEffect(() => {
        if (userId) {
            fetchVehicles();
        }
    }, [userId]);

    if (isEditing) {
        return (
            <RegisterVehicle
                userId={userId}
                vehicleData={editingVehicle}
                onClose={() => setIsEditing(false)}
                onSave={handleSave}
            />
        );
    }

    return (
        <div className={styles.container}>
            <h2>Seus Veículos</h2>
            {vehicles.length === 0 ? (
                <p>Nenhum veículo cadastrado ainda.</p>
            ) : (
                vehicles.map((vehicle) => (
                    <div key={vehicle._id} className={styles.vehicleItem}>
                        <p>
                            <strong>{vehicle.brand} {vehicle.model}</strong> - {vehicle.year}
                        </p>
                        <p>Placa: {vehicle.plate}</p>
                        <p>Cor: {vehicle.color}</p>
                        <div className={styles.actions}>
                            <button onClick={() => handleEdit(vehicle)} className={styles.button}>
                                Editar
                            </button>
                            <button onClick={() => handleDelete(vehicle._id)} className={styles.button}>
                                Deletar
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default ListVehicle;
