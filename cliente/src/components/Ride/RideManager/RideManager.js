import React, { useState, useEffect } from 'react';
import RideForm from '../RideForm/RideForm';
import RideList from '../RideList/RideList';
import styles from './RideManager.module.css'; // Adicione um arquivo CSS para os estilos

const RideManager = ({ loggedUserId }) => {
    const [rides, setRides] = useState([]);
    const [selectedRideId, setSelectedRideId] = useState(null);

    // Buscar viagens do servidor
    const fetchRides = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/rides', {
                method: 'GET',
                credentials: 'include', // Inclui cookies de sessão
            });

            if (response.ok) {
                const data = await response.json();
                setRides(data);
            } else {
                alert('Erro ao carregar viagens');
            }
        } catch (error) {
            console.error('Erro ao carregar viagens:', error);
            alert('Erro ao carregar viagens');
        }
    };

    // Atualiza o estado de viagens após salvar ou excluir uma viagem
    const handleFormSubmit = () => {
        fetchRides();
        setSelectedRideId(null); // Limpa a seleção após o envio do formulário
    };

    const handleEdit = (rideId) => {
        setSelectedRideId(rideId);
    };

    const handleDelete = async (rideId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/rides/${rideId}`, {
                method: 'DELETE',
                credentials: 'include', // Inclui cookies de sessão
            });

            if (response.ok) {
                alert('Viagem excluída com sucesso!');
                fetchRides();
            } else {
                alert('Erro ao excluir a viagem');
            }
        } catch (error) {
            console.error('Erro ao excluir a viagem:', error);
            alert('Erro ao excluir a viagem');
        }
    };

    useEffect(() => {
        fetchRides();
    }, []);

    return (
        <div className={styles.container}>
            {/* Coluna para o formulário de carona */}
            <div className={styles.formColumn}>
                <RideForm rideId={selectedRideId} onFormSubmit={handleFormSubmit} loggedUserId={loggedUserId} />
            </div>

            {/* Coluna para a lista de caronas */}
            <div className={styles.listColumn}>
                <RideList rides={rides} onEdit={handleEdit} onDelete={handleDelete} />
            </div>
        </div>
    );
};

export default RideManager;
