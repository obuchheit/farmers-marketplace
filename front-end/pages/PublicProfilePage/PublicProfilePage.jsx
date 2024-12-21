import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'
import axios from 'axios'
import './PublicProfilePage.css'

const PublicProfilePage = () => {
    const { userId } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchProfile = async() => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:8000/api/v1/users/user/${userId}/`, {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });
                console.log(response.data)
                setData(response.data)
            } catch (err) {
                setError(err.response ? err.response.data : 'An error occurred');
            } finally {
                setLoading(false);
            }
        }
        fetchProfile();
    }, [userId]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>
    
  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <img
            src={`http://127.0.0.1:8000${data.profile_picture}`}
            alt={`${data.first_name} ${data.last_name}`}
            className="profile-picture"
          />
        </div>
        <div className="profile-details">
          <h1 className="profile-name">{`${data.first_name} ${data.last_name}`}</h1>
          <p className="profile-email">{data.email}</p>
          <p className="profile-bio">{data.bio || "No bio provided."}</p>
          <p className="profile-address">
            <strong>Address:</strong> {data.address || "Not available"}
          </p>
        </div>
      </div>
    </div>
  )
}

export default PublicProfilePage
