import React from 'react';
import styles from './RideList.module.css';

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

const RideList = ({ rides, onEdit, onDelete }) => {
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

    return (
        <div className={styles.listDiv}>
            <h2>Suas Caronas Oferecidas</h2>
            {rides.length === 0 ? (
                <p>Você ainda não registrou nenhuma carona.</p>
            ) : (
                <ul className={styles.list}>
                    {rides.map(ride => (
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
                                    onClick={() => onDelete(ride._id)}
                                >
                                    Deletar
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default RideList;
