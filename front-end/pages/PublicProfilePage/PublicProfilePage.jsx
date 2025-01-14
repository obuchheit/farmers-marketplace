import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'
import axios from 'axios'
import './PublicProfilePage.css'

const PublicProfilePage = () => {
  const { userId } = useParams();
  const [userInfo, setUserInfo] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

    useEffect(() => {
      const fetchData = async () => {
          try {
              const token = localStorage.getItem('token');
              const userResponse = await axios.get(`http://localhost:8000/api/v1/users/user/${userId}/`, {
                  headers: { Authorization: `Token ${token}` },
              });
              const postsResponse = await axios.get(`http://localhost:8000/api/v1/posts/user-public-posts/${userId}/`, {
                  headers: { Authorization: `Token ${token}` },
              });
              console.log(userResponse.data)
              console.log(postsResponse.data)
              setUserInfo(userResponse.data);
              setUserPosts(postsResponse.data);
          } catch (err) {
              setError(err.response?.data || 'An error occurred.');
          } finally {
              setLoading(false);
          }
      };

      fetchData();
  }, [userId]);


    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>
    
    return (
      <div className="public-profile-page">
          {/* User Info Section */}
          <div className="profile-info">
              <img className="profile-picture" src={`http://localhost:8000${userInfo.profile_picture}`} alt="Profile" />
              <h2 className="profile-name">{`${userInfo.first_name} ${userInfo.last_name}`}</h2>
              <p className="profile-bio">{userInfo.bio}</p>
              <p className="profile-address">
                  <strong>Location:</strong> {userInfo.address}
              </p>
          </div>

          {/* User Posts Section */}
          <div className="user-posts-grid">
              {userPosts.map((post) => (
                  <div key={post.id} className="post-card">
                      <img src={post.image} alt={post.title} className="post-image" />
                      <h3 className="post-title">{post.title}</h3>
                      <p className="post-address">{post.address}</p>
                      <p className="post-distance">{post.distance} km away</p>
                  </div>
              ))}
          </div>
      </div>
  );
}

export default PublicProfilePage
