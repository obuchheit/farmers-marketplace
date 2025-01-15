import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MdOutlineEditLocationAlt, MdSearch } from "react-icons/md";
import HomePageCard from "../../components/HomePageCard/HomePageCard";
import { useMapboxToken } from "../../utilities";
import RadiusLocationModal from "../../components/RadiusLocationModal/RadiusLocationModal";
import "./HomePage.css";

const HomePage = () => {
  const [distance, setDistance] = useState(50);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState({
    lng: -87.6298,
    lat: 41.8781,
  });
  const [showRadiusModal, setShowRadiusModal] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navigate = useNavigate();
  const { token: mapboxToken, fetchToken } = useMapboxToken();

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);

    try {
      const userToken = localStorage.getItem("token");
      const headers = userToken ? { Authorization: `Token ${userToken}` } : {};

      const response = await axios.get("http://localhost:8000/api/v1/posts/", {
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
      setError(err.response?.data || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="main-page">
      <div className="top-content">
        <div className="todays-posts">
          <h4>Today's Posts</h4>
        </div>
        <form className="search-form" onSubmit={(e) => e.preventDefault()}>
          <MdSearch className="search-icon" onClick={() => setIsSearchOpen(!isSearchOpen)} />
          <input
            type="text"
            className={`search-bar ${isSearchOpen ? "open" : ""}`}
            placeholder="Search for posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search">Search</button>
        </form>
        <div
          className="address-radius-container"
          onClick={() => {
            fetchToken();
            setShowRadiusModal(true);
          }}
        >
          <MdOutlineEditLocationAlt className="edit-location-icon" />
          <span className="radius-info">Radius: {distance} km</span>
        </div>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <div className="card-container">
        {posts.length > 0 ? (
          posts.map((post) => (
            <HomePageCard
              key={post.id}
              post={post}
              onClick={() => navigate(`/post/${post.id}`)}
            />
          ))
        ) : (
          <p>No posts available.</p>
        )}
      </div>

      <RadiusLocationModal
        show={showRadiusModal}
        onClose={() => setShowRadiusModal(false)}
        distance={distance}
        setDistance={setDistance}
        userLocation={userLocation}
        setUserLocation={setUserLocation}
        mapboxToken={mapboxToken}
        fetchPosts={fetchPosts}
      />
    </div>
  );
};

export default HomePage;
