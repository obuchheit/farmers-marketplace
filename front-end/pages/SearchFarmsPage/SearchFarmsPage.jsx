import React, { useState } from 'react';

const SearchFarmsPage = () => {
    const [results, setResults] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchAllFarms = async () => {
        setLoading(true); // Show loading state
        setError(null); // Clear previous errors
        setResults([]); // Reset results for a new fetch

        try {
            console.log('Fetching data...');
            const response = await fetch('http://127.0.0.1:8000/api/v1/get-all-data/');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Data fetched:', data);

            // Combine all categories into a single array
            const allFarms = [
                ...(data.agritourism || []),
                ...(data.csa || []),
                ...(data.farmers_market || []),
                ...(data.foodhub || []),
                ...(data.on_farm_market || []),
            ];

            // Remove duplicates based on 'listing_name' and 'location_address'
            const uniqueFarms = Array.from(
                new Set(allFarms.map(farm => `${farm.listing_name}-${farm.location_address}`))
            ).map(uniqueKey => {
                return allFarms.find(
                    farm =>
                        `${farm.listing_name}-${farm.location_address}` === uniqueKey
                );
            });

            // Display a "No Data" message if no results
            if (uniqueFarms.length === 0) {
                setResults([{ noData: 'No data available for this category' }]);
            } else {
                setResults(uniqueFarms);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setError(`Failed to fetch farms: ${error.message}`);
        } finally {
            setLoading(false); // Hide loading state
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Search Local Farms</h1>
            <button onClick={fetchAllFarms} disabled={loading}>
                {loading ? 'Fetching...' : 'Fetch All Farms'}
            </button>

            {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

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
