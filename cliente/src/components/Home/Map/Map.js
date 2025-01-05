import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import API_KEY from './apikey';

const MapComponent = () => {
    const mapContainerStyle = {
        width: '100%',
        height: '400px',
    };

    const center = {
        lat: -28.2284,
        lng: -48.6441,
    };

    return (
        <LoadScript googleMapsApiKey={API_KEY}>
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={14}
            >
                <Marker position={center} />
            </GoogleMap>
        </LoadScript>
    );
};

export default MapComponent;