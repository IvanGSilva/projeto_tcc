import React, { useEffect, useState } from 'react';
import styles from './RideList.module.css';

const RideList = ({ loggedUserId, onEdit, onDelete, onComplete }) => {
    const [rides, setRides] = useState([]);
    
    // Função para formatar a data corretamente considerando o fuso horário local
    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        date.setMinutes(date.getMinutes() - date.getTimezoneOffset());

        const day = String(date.getDate() + 1).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    // Função para formatar o horário no formato HH:mm
    const formatTime = (time) => {
        return time ? time.substring(0, 5) : '--:--';
    };

    // Função para mapear o status para um texto amigável
    const getStatusText = (status) => {
        switch (status) {
            case 'not_started':
                return 'Não Iniciada';
            case 'in_progress':
                return 'Em Viagem';
            case 'completed':
                return 'Finalizada';
            default:
                return 'Status desconhecido';
        }
    };

    // Função para buscar as viagens do motorista logado
    const fetchRides = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/rides?loggedUserId=${loggedUserId}`);
            const data = await response.json();
            setRides(data);
        } catch (error) {
            console.error('Erro ao carregar as viagens:', error);
        }
    };

    useEffect(() => {
        fetchRides();
    }, [loggedUserId]);

    // Filtra as viagens para mostrar apenas aquelas que não estão finalizadas
    const filteredRides = rides.filter(ride => ride.status !== 'completed');

    // Função para finalizar a carona, alterando o status para 'completed'
    const handleCompleteRide = async (rideId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/rides/${rideId}?loggedUserId${loggedUserId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    loggedUserId,
                    status: 'completed', // Apenas alterando o status para 'completed'
                }),
            });

            if (response.ok) {
                fetchRides(); // Atualiza a lista após a alteração do status
            } else {
                console.error('Erro ao finalizar a carona');
            }
        } catch (error) {
            console.error('Erro ao finalizar a carona:', error);
        }
    };

    return (
        <div className={styles.listDiv}>
            <h2>Suas Caronas Oferecidas</h2>
            {filteredRides.length === 0 ? (
                <p>Você ainda não registrou nenhuma carona não finalizada.</p>
            ) : (
                <ul className={styles.list}>
                    {filteredRides.map(ride => (
                        <li key={ride._id} className={styles.item}>
                            <div className={styles.rideData}>
                                <div>
                                    <strong>Origem:</strong> {ride.origin} <br />
                                    <strong>Destino:</strong> {ride.destination} <br />
                                    <strong>Data:</strong> {formatDate(ride.date)} <br />
                                    <strong>Horário:</strong> {formatTime(ride.time)} <br />
                                    <strong>Assentos Disponíveis:</strong> {ride.seats} <br />
                                    <strong>Status:</strong> {getStatusText(ride.status)}
                                </div>
                                <div className={styles.passengers}>
                                    <strong>Passageiros:</strong>
                                    <ul>
                                        {ride.passengers && ride.passengers.length > 0 ? (
                                            ride.passengers.map((passenger, index) => (
                                                <li key={index}>{passenger}</li>
                                            ))
                                        ) : (
                                            <li>Nenhum passageiro pediu carona ainda</li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                            <div className={styles.actions}>
                                <button
                                    className={styles.button}
                                    onClick={() => onEdit(ride._id)}
                                >
                                    Editar
                                </button>
                                <button
                                    className={styles.button}
                                    onClick={async () => {
                                        await fetch(`http://localhost:5000/api/rides/${ride._id}`, {
                                            method: 'DELETE',
                                            body: JSON.stringify({ loggedUserId }),
                                            headers: {
                                                'Content-Type': 'application/json',
                                            },
                                        });
                                        fetchRides(); // Atualiza a lista após exclusão
                                    }}
                                >
                                    Deletar
                                </button>
                                {ride.status !== 'completed' && (
                                    <button
                                        className={styles.button}
                                        onClick={() => handleCompleteRide(ride._id)} 
                                    >
                                        Finalizar Carona
                                    </button>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default RideList;
