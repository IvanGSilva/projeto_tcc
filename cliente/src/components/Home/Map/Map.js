import React, { useEffect, useRef } from 'react';
import { GoogleMap, DirectionsRenderer } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '100%',
};

const center = {
    lat: -28.24,
    lng: -48.67,
};

const MapComponent = ({ origin, destination, directions }) => {
    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={13}
        >
            {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
    );
};

export default MapComponent;
