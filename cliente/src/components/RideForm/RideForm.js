import React, { useState, useEffect } from 'react';
import styles from './RideForm.module.css';

const RideForm = ({ rideId, onFormSubmit, loggedUserId }) => {
    const [rideData, setRideData] = useState({
        origin: '',
        destination: '',
        date: '',
        seats: '',
        driverId: loggedUserId // Define o motorista como o usuário logado
    });

    // Carrega dados da viagem se for uma edição
    useEffect(() => {
        if (rideId) {
            fetchRideData(rideId);
        }
    }, [rideId]);

    const fetchRideData = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/rides/${id}`, {
                method: 'GET',
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();

                // Verifica se a viagem pertence ao motorista logado
                if (data.driverId !== loggedUserId) {
                    alert('Você não tem permissão para editar esta viagem.');
                    return;
                }

                setRideData({
                    origin: data.origin,
                    destination: data.destination,
                    date: data.date,
                    price: data.price,
                    seats: data.seats,
                    driverId: data.driverId
                });
            } else {
                alert('Erro ao carregar dados da viagem');
            }
        } catch (error) {
            console.error('Erro ao carregar dados da viagem:', error);
            alert('Erro ao carregar dados da viagem');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRideData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = rideId
                ? `http://localhost:5000/api/rides/${rideId}`  // Atualiza a viagem
                : 'http://localhost:5000/api/rides';           // Cria uma nova viagem

            const method = rideId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(rideData),
                credentials: 'include',
            });

            if (response.ok) {
                onFormSubmit();
                alert(rideId ? 'Viagem atualizada com sucesso!' : 'Viagem registrada com sucesso!');
            } else {
                const errorData = await response.json();
                alert(`Erro ao salvar a viagem: ${errorData.error || 'Erro desconhecido'}`);
            }
        } catch (error) {
            console.error('Erro ao salvar a viagem:', error);
            alert('Erro ao salvar a viagem: ' + error.message);
        }
    };

    return (
        <div className={styles.container}>
            <h2>{rideId ? 'Editar Viagem' : 'Cadastrar Viagem'}</h2>
            <form className={styles.form} onSubmit={handleSubmit}>
                <input
                    className={styles.input}
                    type="text"
                    name="origin"
                    placeholder="Local de Origem"
                    value={rideData.origin}
                    onChange={handleChange}
                    required
                />
                <input
                    className={styles.input}
                    type="text"
                    name="destination"
                    placeholder="Local de Chegada"
                    value={rideData.destination}
                    onChange={handleChange}
                    required
                />
                <input
                    className={styles.input}
                    type="date"
                    name="date"
                    placeholder="Data da Viagem"
                    value={rideData.date}
                    onChange={handleChange}
                    required
                />
                <input
                    className={styles.input}
                    name="seats"
                    placeholder="Assentos"
                    type="number"
                    value={rideData.seats}
                    onChange={handleChange}
                    required
                />

                <button type="submit" className={styles.button}>
                    {rideId ? 'Atualizar Viagem' : 'Cadastrar Viagem'}
                </button>
            </form>
        </div>
    );
};

export default RideForm;
