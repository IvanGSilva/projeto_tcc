import React from 'react';
import styles from './RideHistory.module.css';

// Função para formatar a data corretamente considerando o fuso horário local
const formatDate = (isoDate) => {
    const date = new Date(isoDate);

    // Ajustando a data para o fuso horário local
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());

    const day = String(date.getDate() + 1).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

const RideList = ({ rides, onEdit, onDelete, onComplete }) => {
    // Função para formatar o horário no formato HH:mm
    const formatTime = (time) => {
        return time ? time.substring(0, 5) : '--:--';
    };

    // Filtra as viagens para mostrar apenas aquelas que estão finalizadas
    const filteredRides = rides.filter(ride => ride.status == 'completed');

    return (
        <div className={styles.listDiv}>
            <h2>Suas Caronas Finalizadas</h2>
            {filteredRides.length === 0 ? (
                <p>Você ainda não ofereceu nenhuma.</p>
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

export default RideList;
