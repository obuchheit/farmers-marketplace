import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


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
        const token = localStorage.getItem('authToken');
        const response = await axios.get('http://localhost:8000/posts/', {
            headers: {
                Authorization: `Token ${token}`,
            },
            params: { distance },
        });
    setPosts(response.data);
    } catch (err) {
        setError(err.response ? err.response.data : 'An error occurred');
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
      <h1>Welcome, {user.name || 'User'}!</h1>

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

      <ul>
          {posts.map(post => (
              <li key={post.id} onClick={() => handlePostClick(post.id)} style={{ cursor: 'pointer' }}>
                  <h2>{post.title}</h2>
                  <p>{post.description}</p>
                  <p><strong>Distance:</strong> {Math.round(post.distance / 1000)} km</p>
              </li>
          ))}
      </ul>
    </div>
  )
}

export default HomePage
