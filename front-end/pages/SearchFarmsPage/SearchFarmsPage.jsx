import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMapboxToken } from '/utilities.jsx'; // Adjust the import path as needed
import './SearchFarmsPage.css';

const SearchFarmsPage = () => {
    const [results, setResults] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [radius, setRadius] = useState(10); // Default radius in miles
    const [userLocation, setUserLocation] = useState(null); // Added state for user location
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const markersRef = useRef([]);
    const userMarkerRef = useRef(null); // Reference for the user location marker
    const popupRef = useRef(new mapboxgl.Popup({ offset: 25 })); // Reference for the popup

    const { token, fetchToken, loading: tokenLoading, error: tokenError } = useMapboxToken();

    useEffect(() => {
        fetchToken();
    }, []);

    useEffect(() => {
        if (!token || mapRef.current) return; // Initialize map only once and only if token is available

        mapboxgl.accessToken = token;

        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [-98.5795, 39.8283], // Center of the USA
            zoom: 4
        });
    }, [token]);

    useEffect(() => {
        if (mapRef.current && results.length > 0) {
            // Clear existing markers (except the user location marker)
            markersRef.current.forEach(marker => marker.remove());
            markersRef.current = [];

            // Add new markers for the search results
            results.forEach(farm => {
                const marker = new mapboxgl.Marker()
                    .setLngLat([farm.location.lon, farm.location.lat])
                    .addTo(mapRef.current);

                marker.getElement().addEventListener('mouseenter', () => {
                    popupRef.current
                        .setLngLat([farm.location.lon, farm.location.lat])
                        .setHTML(`
                            <div class="popup-content">
                                <h2>${farm.listing_name}</h2>
                                <p><strong>Address:</strong> ${farm.location_address}</p>
                                <p>${farm.listing_desc || 'No description available'}</p>
                                <p><strong>Distance:</strong> ${farm.distance} miles</p>
                            </div>
                        `)
                        .addTo(mapRef.current);
                });

                marker.getElement().addEventListener('mouseleave', () => {
                    popupRef.current.remove();
                });

                markersRef.current.push(marker);
            });
        }
    }, [results]);

    // Haversine Distance Function (in miles)
    const haversineDistance = (coords1, coords2) => {
        const toRad = (x) => (x * Math.PI) / 180;
        const R = 3958.8; // Radius of the Earth in miles
        const dLat = toRad(coords2.lat - coords1.lat);
        const dLon = toRad(coords2.lon - coords1.lon);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(coords1.lat)) * Math.cos(toRad(coords2.lat)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in miles
    };

    const fetchFarmsByCity = async () => {
        setLoading(true); // Show loading state
        setError(null); // Clear previous errors
        setResults([]); // Reset results for a new fetch

        // Clear existing markers (except the user location marker)
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];

        try {
            console.log('Fetching data...');
            const response = await fetch(`http://127.0.0.1:8000/api/v1/searchfarms/farms_within_radius/?city=${city},${state}&radius=${radius}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Data fetched:', data);

            // Geocode the city and state to get the user's location
            const geocodeResponse = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${city},${state}.json?access_token=${token}`);
            const geocodeData = await geocodeResponse.json();
            if (geocodeData.features && geocodeData.features.length > 0) {
                const userLocation = {
                    lon: geocodeData.features[0].center[0],
                    lat: geocodeData.features[0].center[1]
                };
                setUserLocation(userLocation);

                // Add a marker for the user's location if it doesn't already exist
                if (!userMarkerRef.current) {
                    userMarkerRef.current = new mapboxgl.Marker({ color: 'green' })
                        .setLngLat([userLocation.lon, userLocation.lat])
                        .addTo(mapRef.current);
                } else {
                    // Update the position of the existing user marker
                    userMarkerRef.current.setLngLat([userLocation.lon, userLocation.lat]);
                }

                // Calculate distance for each farm
                const resultsWithDistance = data.map(farm => {
                    const distance = haversineDistance(userLocation, {
                        lon: farm.location.lon,
                        lat: farm.location.lat
                    });
                    return { ...farm, distance: distance.toFixed(2) }; // Distance in miles
                });

                setResults(resultsWithDistance);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setError(`Failed to fetch farms: ${error.message}`);
        } finally {
            setLoading(false); // Hide loading state
        }
    };

    const clearMap = () => {
        // Clear existing markers including the user location marker
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];
        if (userMarkerRef.current) {
            userMarkerRef.current.remove();
            userMarkerRef.current = null;
        }
        setResults([]);
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }} className='search-farms-page'>
            <h1>Search Local Farms</h1>
            <div style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Enter city"
                    style={{ marginRight: '10px' }}
                />
                <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="Enter state"
                    style={{ marginRight: '10px' }}
                />
                <input
                    type="number"
                    value={radius}
                    onChange={(e) => setRadius(e.target.value)}
                    placeholder="Enter radius in miles"
                    style={{ marginRight: '10px' }}
                />
                <button onClick={fetchFarmsByCity} disabled={loading}>
                    {loading ? 'Fetching...' : 'Fetch Farms by City'}
                </button>
                <button onClick={clearMap} style={{ marginLeft: '10px' }}>
                    Clear Map
                </button>
            </div>

            {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
            {tokenError && <p style={{ color: 'red', marginTop: '10px' }}>{tokenError}</p>}

            <div id="map" ref={mapContainerRef} style={{ height: '500px', width: '90%', margin: '0 auto', border: '2px solid black' }}></div>

            <div id="results" style={{ marginTop: '20px' }}>
                {results.length > 0 ? (
                    results.map((farm, index) => (
                        <div
                            key={index}
                            style={{
                                border: '1px solid #ccc',
                                borderRadius: '5px',
                                padding: '15px',
                                marginBottom: '10px',
                            }}
                        >
                            {farm.noData ? (
                                <p style={{ textAlign: 'center', color: 'gray' }}>
                                    {farm.noData}
                                </p>
                            ) : (
                                <>
                                    <h2 style={{ margin: '0 0 10px' }}>
                                        {farm.listing_name}
                                    </h2>
                                    <p style={{ margin: '5px 0' }}>
                                        <strong>Address:</strong> {farm.location_address}
                                    </p>
                                    <p style={{ margin: '5px 0', color: '#555' }}>
                                        {farm.listing_desc || 'No description available'}
                                    </p>
                                    <p style={{ margin: '5px 0', color: '#555' }}>
                                        <strong>Distance:</strong> {farm.distance} miles
                                    </p>
                                </>
                            )}
                        </div>
                    ))
                ) : (
                    !loading && <p>No data available</p>
                )}
            </div>
        </div>
    );
};

export default SearchFarmsPage;