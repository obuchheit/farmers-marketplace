import { useState, useEffect } from "react"
import axios from 'axios'
import './UserGroupsPage.css'

const UserGroupsPage = () => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [groups, setGroups] = useState([]);

    useEffect(() => {
      fetchUserGroups();
    }, []);
  
    const fetchUserGroups = async () => {
      try {
        const response = await axios.get("/api/groups/my-groups/", {
          headers: { Authorization: `Token ${localStorage.getItem("authToken")}` }, // Adjust for your auth setup
        });
        setGroups(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch your groups.");
        setLoading(false);
      }
    };
  
    if (loading) return <p>Loading...</p>;
    if (error) return <p className="error">{error}</p>;
  
    return (
      <div className="user-groups-page">
        <header className="header">
          <h1>Your Groups</h1>
        </header>
        {groups.length === 0 ? (
          <p>You are not a member of any groups yet.</p>
        ) : (
          <div className="group-list">
            {groups.map((group) => (
              <div key={group.id} className="group-card">
                <img
                  src={group.group_image || "default-group-image.jpg"}
                  alt={group.name}
                  className="group-image"
                />
                <div className="group-details">
                  <h2>{group.name}</h2>
                  <p>{group.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

export default UserGroupsPage
