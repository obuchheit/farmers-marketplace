import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMapboxToken } from '/utilities.jsx'; // Adjust the import path as needed
import './SearchFarmsPage.css'

const SearchFarmsPage = () => {
    const [results, setResults] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [radius, setRadius] = useState(10); // Default radius in miles
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const markersRef = useRef([]);

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
            // Clear existing markers
            markersRef.current.forEach(marker => marker.remove());
            markersRef.current = [];

            // Add new markers for the search results
            results.forEach(farm => {
                const marker = new mapboxgl.Marker()
                    .setLngLat([farm.location.lon, farm.location.lat])
                    .addTo(mapRef.current);
                markersRef.current.push(marker);
            });
        }
    }, [results]);

    const fetchFarmsByCity = async () => {
        setLoading(true); // Show loading state
        setError(null); // Clear previous errors
        setResults([]); // Reset results for a new fetch

        // Clear existing markers
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
            setResults(data);

            // Geocode the city and state to get the user's location
            const geocodeResponse = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${city},${state}.json?access_token=${token}`);
            const geocodeData = await geocodeResponse.json();
            if (geocodeData.features && geocodeData.features.length > 0) {
                const userLocation = geocodeData.features[0].center;

                // Add a marker for the user's location
                const userMarker = new mapboxgl.Marker({ color: 'red' })
                    .setLngLat(userLocation)
                    .addTo(mapRef.current);
                markersRef.current.push(userMarker);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setError(`Failed to fetch farms: ${error.message}`);
        } finally {
            setLoading(false); // Hide loading state
        }
    };

    const clearMap = () => {
        // Clear existing markers
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];
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