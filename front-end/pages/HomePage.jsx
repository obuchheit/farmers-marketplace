import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import HomePageCard from "../components/HomePageCard/HomePageCard";


const HomePage = ({ user }) => {
  const [distance, setDistance] = useState(50);
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);

    try {
        const token = localStorage.getItem('token');
        if (!token) {
            setError("Authentication token not found. Please log in.");
            return;
        }

        const response = await axios.get('http://localhost:8000/api/v1/posts/', {
            headers: {
                Authorization: `Token ${token}`,
            },
            params: { distance },
        });
        console.log(response.data)
        setPosts(response.data);
    } catch (err) {
        setError(err.response?.data || 'An unexpected error occurred');
    } finally {
        setLoading(false);
    }
};

  // Fetch posts on initial render
  useEffect(() => {
      fetchPosts();
  }, []);

  const handleDistanceChange = (event) => {
      setDistance(event.target.value);
  };

  const handlePostClick = (postId) => {
      navigate(`/post/${postId}`);
  };


  return (
    <div>
        <h3>Today's Posts</h3>
      <div>
          <label htmlFor="distance-slider">Search Radius: {distance} km</label>
          <input
              id="distance-slider"
              type="range"
              min="1"
              max="100"
              value={distance}
              onChange={handleDistanceChange}
          />
          <button onClick={fetchPosts}>Search</button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}

      <div className="card-container">
        {posts && Array.isArray(posts) && posts.length > 0 ? (
            posts.map(post => (
                <HomePageCard key={post.id} post={post} onClick={handlePostClick} />
            ))
        ) : (
            <p>No posts available.</p>
        )}
      </div>
    </div>
  )
}

export default HomePage
