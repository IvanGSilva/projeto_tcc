import React, { useState, useEffect } from 'react';
import RideForm from '../RideForm/RideForm';
import RideList from '../RideList/RideList';
import RideHistory from '../RideHistory/RideHistory';
import styles from './RideManager.module.css';

const RideManager = ({ loggedUserId }) => {
    const [rides, setRides] = useState([]);
    const [selectedRideId, setSelectedRideId] = useState(null);
    // Estado para controlar a exibição do histórico
    const [showHistory, setShowHistory] = useState(false);

    // Buscar viagens do servidor
    const fetchRides = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/rides', {
                method: 'GET',
                credentials: 'include',
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
                credentials: 'include',
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

    // Função para finalizar a carona
    const handleComplete = async (rideId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/rides/${rideId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: 'completed' }),
                credentials: 'include',
            });

            if (response.ok) {
                alert('Carona finalizada com sucesso!');
                // Atualiza a lista de viagens
                fetchRides();
            } else {
                alert('Erro ao finalizar a carona');
            }
        } catch (error) {
            console.error('Erro ao finalizar a carona:', error);
            alert('Erro ao finalizar a carona');
        }
    };

    useEffect(() => {
        fetchRides();
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.formColumn}>
                <RideForm rideId={selectedRideId} onFormSubmit={handleFormSubmit} loggedUserId={loggedUserId} />
            </div>

            <div className={styles.listColumn}>
                <div className={styles.historyToggle}>
                    <button onClick={() => setShowHistory(!showHistory)} className={styles.button}>
                        {showHistory ? 'Voltar' : <><i class="fa-solid fa-clock"></i> Histórico de Viagens</>}
                    </button>
                </div>

                {showHistory ? (
                    <RideHistory rides={rides.filter(ride => ride.status === 'completed')} />
                ) : (
                    <RideList
                        rides={rides}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onComplete={handleComplete}
                    />
                )}
            </div>
        </div>
    );
};

export default RideManager;
