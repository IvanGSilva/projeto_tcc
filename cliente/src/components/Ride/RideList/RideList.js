import React from 'react';
import styles from './RideList.module.css';

const RideList = ({ rides, onEdit, onDelete }) => {
    return (
        <div className={styles.listDiv}>
            <h2>Suas Caronas Oferecidas</h2>
            <ul className={styles.list}>
                {rides.map(ride => (
                    <li key={ride._id} className={styles.item}>
                        {ride.origin} - {ride.destination} - {ride.date}
                        <button className={styles.button} onClick={() => onEdit(ride._id)}>Editar</button>
                        <button className={styles.button} onClick={() => onDelete(ride._id)}>Deletar</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RideList;
