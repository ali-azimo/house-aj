import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
  Autocomplete,
} from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const centerDefault = {
  lat: -25.9692,
  lng: 32.5732, // Maputo como centro padrão
};

export default function MapMoz({ address }) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ['places'], // Usa 'places' para ativar o Autocomplete
  });

  const [coordinates, setCoordinates] = useState(null);
  const [open, setOpen] = useState(false);
  const [geoError, setGeoError] = useState(false);
  const [map, setMap] = useState(null);
  const [autocomplete, setAutocomplete] = useState(null);

  const onLoad = useCallback((mapInstance) => {
    setMap(mapInstance);
  }, []);

  const onAutocompleteLoad = (auto) => {
    setAutocomplete(auto);
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      if (place.geometry && place.geometry.location) {
        const newLocation = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        setCoordinates(newLocation);
        map.panTo(newLocation);
      }
    }
  };

  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            address
          )}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
        );
        const data = await response.json();
        if (data.status === 'OK') {
          const location = data.results[0].geometry.location;
          setCoordinates(location);
        } else {
          console.error('Erro na geocodificação:', data.status);
          setGeoError(true);
        }
      } catch (error) {
        console.error('Erro ao buscar coordenadas:', error);
        setGeoError(true);
      }
    };

    if (address) fetchCoordinates();
  }, [address]);

  if (loadError || geoError) {
    return <div className="text-red-500 text-center">Erro ao carregar o mapa.</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-md mt-8 m-auto">
      {isLoaded && (
        <>
          <Autocomplete
            onLoad={onAutocompleteLoad}
            onPlaceChanged={onPlaceChanged}
          >
            <input
              type="text"
              placeholder="Pesquisar localização..."
              className="w-full px-4 py-2 border border-gray-300 bg-gray-50 rounded shadow m-auto my-2"
            />
          </Autocomplete>

          <GoogleMap
            mapContainerStyle={containerStyle}
            center={coordinates || centerDefault}
            zoom={coordinates ? 15 : 13}
            onLoad={onLoad}
            options={{
              zoomControl: true,
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
            }}
          >
            {coordinates && (
              <>
                <Marker
                  position={coordinates}
                  title="Local do Imóvel"
                  onClick={() => setOpen(true)}
                />
                {open && (
                  <InfoWindow
                    position={coordinates}
                    onCloseClick={() => setOpen(false)}
                  >
                    <div className="text-sm">
                      <h3 className="font-semibold">Imóvel</h3>
                      <p>{address}</p>
                    </div>
                  </InfoWindow>
                )}
              </>
            )}
          </GoogleMap>
        </>
      )}
    </div>
  );
}
