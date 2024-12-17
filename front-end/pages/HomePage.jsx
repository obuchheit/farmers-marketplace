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
        <h1>Welcome User</h1>
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
      {posts && Array.isArray(posts) && posts.length > 0 ? (
            posts.map(post => (
                <li key={post.id} onClick={() => handlePostClick(post.id)} style={{ cursor: 'pointer' }}>
                    <img src={post.image} alt={post.title} />
                    <h2>{post.title}</h2>
                    <p>{post.description}</p>
                    <p><strong>Distance:</strong> {Math.round(post.distance / 1000)} km</p>
                </li>
            ))
            ) : (
            <p>No posts available.</p>
        )}
      </ul>
    </div>
  )
}

export default HomePage
