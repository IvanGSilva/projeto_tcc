import React, { useState, useEffect, useRef } from 'react';
import styles from './RideForm.module.css';

const RideForm = ({ rideId, onFormSubmit, loggedUserId }) => {
    const [rideData, setRideData] = useState({
        origin: '',
        destination: '',
        date: '',
        time: '',
        seats: '',
        status: 'not_started', // Status padrão
        driverId: loggedUserId, // Define o motorista como o usuário logado
    });

    const originRef = useRef(null);
    const destinationRef = useRef(null);

    useEffect(() => {
        if (rideId) {
            fetchRideData(rideId);
        }
    }, [rideId]);

    useEffect(() => {
        if (window.google && originRef.current && destinationRef.current) {
            const originInput = originRef.current;
            const destinationInput = destinationRef.current;

            if (originInput instanceof HTMLInputElement && destinationInput instanceof HTMLInputElement) {
                const originAutocomplete = new window.google.maps.places.Autocomplete(originInput);
                originAutocomplete.addListener('place_changed', () => {
                    const place = originAutocomplete.getPlace();
                    setRideData((prevData) => ({
                        ...prevData,
                        origin: place.formatted_address || '',
                    }));
                });

                const destinationAutocomplete = new window.google.maps.places.Autocomplete(destinationInput);
                destinationAutocomplete.addListener('place_changed', () => {
                    const place = destinationAutocomplete.getPlace();
                    setRideData((prevData) => ({
                        ...prevData,
                        destination: place.formatted_address || '',
                    }));
                });
            }
        }
    }, []);

    const fetchRideData = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/rides/${id}`, {
                method: 'GET',
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();

                if (data.driver !== loggedUserId) {
                    alert('Você não tem permissão para editar esta viagem.');
                    return;
                }

                setRideData({
                    origin: data.origin,
                    destination: data.destination,
                    date: data.date.split('T')[0],
                    time: data.time,
                    seats: data.seats,
                    status: data.status,
                    driverId: data.driver,
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
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = rideId
                ? `http://localhost:5000/api/rides/${rideId}?loggedUserId=${loggedUserId}`
                : `http://localhost:5000/api/rides?loggedUserId=${loggedUserId}`;

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
                setRideData({
                    origin: '',
                    destination: '',
                    date: '',
                    time: '',
                    seats: '',
                    status: 'not_started',
                    driverId: loggedUserId,
                });
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
                    ref={originRef}
                    type="text"
                    name="origin"
                    placeholder="Local de Origem"
                    value={rideData.origin}
                    onChange={handleChange}
                    required
                />
                <input
                    className={styles.input}
                    ref={destinationRef}
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
                    type="time"
                    name="time"
                    placeholder="Horário da Viagem"
                    value={rideData.time}
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
                <select
                    className={styles.select}
                    name="status"
                    value={rideData.status}
                    onChange={handleChange}
                    required
                >
                    <option value="not_started">Não Iniciada</option>
                    <option value="in_progress">Em Andamento</option>
                </select>

                <button type="submit" className={styles.button}>
                    {rideId ? 'Atualizar Viagem' : 'Cadastrar Viagem'}
                </button>
            </form>
        </div>
    );
};

export default RideForm;
