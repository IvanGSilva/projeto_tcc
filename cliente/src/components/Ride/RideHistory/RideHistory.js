import React, { useEffect, useState } from 'react';
import styles from './RideHistory.module.css';

// Função para formatar a data corretamente considerando o fuso horário local
const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    const day = String(date.getDate() + 1).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

const RideHistory = ({ loggedUserId }) => {
    const [rides, setRides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Função para formatar o horário no formato HH:mm
    const formatTime = (time) => {
        return time ? time.substring(0, 5) : '--:--';
    };

    // Função para buscar as viagens do motorista logado
    const fetchRides = async () => {
        setLoading(true);
        setError(null);
        try {
            console.log('Buscando caronas finalizadas para o usuário:', loggedUserId);
            const response = await fetch(`http://localhost:5000/api/rides?loggedUserId=${loggedUserId}`);
            if (response.ok) {
                const data = await response.json();
                setRides(data);
            } else {
                const errorMessage = `Erro ao buscar as viagens: ${response.statusText}`;
                console.error(errorMessage);
                setError(errorMessage);
            }
        } catch (error) {
            console.error('Erro ao buscar as viagens:', error);
            setError('Erro ao buscar as viagens.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (loggedUserId) {
            fetchRides();
        } else {
            setError('Usuário não está logado.');
            setLoading(false);
        }
    }, [loggedUserId]);

    // Filtra as viagens para mostrar apenas aquelas que estão finalizadas
    const filteredRides = rides.filter((ride) => ride.status === 'completed');

    return (
        <div className={styles.listDiv}>
            <h2>Suas Caronas Finalizadas</h2>

            {loading ? (
                <p>Carregando...</p>
            ) : error ? (
                <p>{error}</p>
            ) : filteredRides.length === 0 ? (
                <p>Você ainda não ofereceu nenhuma carona finalizada.</p>
            ) : (
                <ul className={styles.list}>
                    {filteredRides.map((ride) => (
                        <li key={ride._id} className={styles.item}>
                            <div className={styles.rideData}>
                                <div>
                                    <strong>Origem:</strong> {ride.origin} <br />
                                    <strong>Destino:</strong> {ride.destination} <br />
                                    <strong>Data:</strong> {formatDate(ride.date)} <br />
                                    <strong>Horário:</strong> {formatTime(ride.time)} <br />
                                    <strong>Assentos Disponíveis:</strong> {ride.seats} <br />
                                    <strong>Status: </strong>Finalizada
                                </div>
                                <div className={styles.passengers}>
                                    <strong>Passageiros:</strong>
                                    <ul>
                                        {ride.passengers.map((passenger, index) => (
                                            <li key={index}>{passenger}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default RideHistory;
