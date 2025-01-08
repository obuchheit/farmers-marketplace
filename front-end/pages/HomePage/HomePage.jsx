import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import ReactMapGL, { Marker, Source, Layer } from 'react-map-gl';
import { MdOutlineEditLocationAlt } from "react-icons/md";
import { MdSearch } from "react-icons/md";
import HomePageCard from "../../components/HomePageCard/HomePageCard";
import { useMapboxToken } from "../../utilities";
import "./HomePage.css";

const HomePage = () => {
  const [distance, setDistance] = useState(50);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState({ lng: -87.6298, lat: 41.8781 }); // Default to Chicago, IL
  const [showRadiusModal, setShowRadiusModal] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navigate = useNavigate();
  const { token: mapboxToken, fetchToken, loading: loadingToken, error: errorToken } = useMapboxToken();


  const fetchPosts = async () => {
    setLoading(true);
    setError(null);

    try {
      const usertoken = localStorage.getItem('token'); // Get token from local storage
      const headers = usertoken ? { Authorization: `Token ${usertoken}` } : {};

      const response = await axios.get('http://localhost:8000/api/v1/posts/', {
        headers,
        params: {
          distance,
          search: searchQuery,
          lat: userLocation.lat,
          lng: userLocation.lng,
        },
      });

      setPosts(response.data);
    } catch (err) {
      setError(err.response?.data || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    fetchPosts();
  };

  const handleMarkerDragEnd = (event) => {
    setUserLocation({ lng: event.lngLat.lng, lat: event.lngLat.lat });
  };

  const toggleRadiusModal = async () => {
    await fetchToken()
    setShowRadiusModal(!showRadiusModal);
  };

  const toggleSearchBar = () => {
    setIsSearchOpen(prev => !prev);
};

  // Function to calculate the circle geometry around the marker
  const generateCircle = (center, radiusInKm, points = 64) => {
    const coordinates = [];
    const distanceX = radiusInKm / (111.32 * Math.cos((center.lat * Math.PI) / 180));
    const distanceY = radiusInKm / 110.574;

    for (let i = 0; i < points; i++) {
      const theta = (i / points) * (2 * Math.PI);
      const x = distanceX * Math.cos(theta);
      const y = distanceY * Math.sin(theta);

      coordinates.push([center.lng + x, center.lat + y]);
    }
    coordinates.push(coordinates[0]); // Close the circle
    return {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [coordinates],
      },
    };
  };

  const circleData = generateCircle(userLocation, distance);

  return (
    <div className="main-page">
         <div className="top-content">
            <div className="todays-posts">
                <h3>Today's Posts</h3>
            </div>
            <form className="search-form" onSubmit={handleSearchSubmit}>
                {/* Search Icon */}
                <MdSearch className="search-icon" onClick={toggleSearchBar} />

                {/* Search Bar */}
                <input
                    type="text"
                    className={`search-bar ${isSearchOpen ? 'open' : ''}`}
                    placeholder="Search for posts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />

                {/* Search Button */}
                <button type="submit" className="search">Search</button>
            </form>

            {/* Address and Radius Container */}
            <div className="address-radius-container">
                <MdOutlineEditLocationAlt
                    className="edit-location-icon"
                    onClick={toggleRadiusModal}
                />
                <span className="radius-info">Radius: {distance} km</span>
            </div>
        </div>

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}

      <div className="card-container">
        {posts && Array.isArray(posts) && posts.length > 0 ? (
          posts.map(post => (
            <HomePageCard key={post.id} post={post} onClick={() => navigate(`/post/${post.id}`)} />
          ))
        ) : (
          <p>No posts available.</p>
        )}
      </div>

      {/* Radius and Location Modal */}
      <Modal show={showRadiusModal} onHide={toggleRadiusModal}>
        <Modal.Header closeButton>
          <Modal.Title>Set Search Radius and Location</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-background">
            <div className="map-container">
            <ReactMapGL
                initialViewState={{
                longitude: userLocation.lng,
                latitude: userLocation.lat,
                zoom: 7,
                }}
                style={{ width: "100%", height: "50vh" }}
                mapStyle="mapbox://styles/mapbox/streets-v11"
                mapboxAccessToken={mapboxToken}
            >
                <Marker
                longitude={userLocation.lng}
                latitude={userLocation.lat}
                draggable
                color="#5E653E"
                onDragEnd={handleMarkerDragEnd}
                />
                <Source id="circle-source" type="geojson" data={circleData}>
                <Layer
                    type="fill"
                    paint={{
                    "fill-color": "#795f4b",
                    "fill-opacity": 0.4,
                    }}
                />
                <Layer
                    type="line"
                    paint={{
                    'line-color': "#795f4b",
                    'line-width': 2,
                    }}
                />
                </Source>
            </ReactMapGL>
            </div>


          <div className="slider-container">
            <label htmlFor="distance-slider" className="slider-label">
              Radius: {distance} km
            </label>
            <input
              id="distance-slider"
              type="range"
              min="1"
              max="100"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              className="modern-slider"
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button 
          variant="secondary" 
          onClick={toggleRadiusModal}
          className="modal-close-button"
          >
            Close
          </Button>
          <Button 
          variant="primary" 
          onClick={fetchPosts}
          className="modal-apply-button"
          >
            Apply
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default HomePage;
