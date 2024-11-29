// components/RideList.js
import React from 'react';

const RideList = ({ rides, onEdit, onDelete }) => {
    return (
        <div>
            <h2>Caronas</h2>
            <ul>
                {rides.map(ride => (
                    <li key={ride._id}>
                        {ride.origin} - {ride.destination} - {ride.date}
                        <button onClick={() => onEdit(ride._id)}>Editar</button>
                        <button onClick={() => onDelete(ride._id)}>Deletar</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RideList;
