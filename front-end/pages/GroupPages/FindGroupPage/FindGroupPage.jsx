import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./FindGroupPage.css";
import axios from "axios";

const FindGroupPage = () => {
    const [distance, setDistance] = useState(50);
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userLocation, setUserLocation] = useState();
    const navigate = useNavigate();
  
    useEffect(() => {
      fetchGroups();
    }, []);
  
    const fetchGroups = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/v1/groups/public/",{
            headers: {
                Authorization: `Token ${token}`,
            },
            params: { distance },
      }); 
        setGroups(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch groups.");
        setLoading(false);
      }
    };

    const handleDistanceChange = (event) => {
        setDistance(event.target.value);
    };

    const handleGroupClick = (groupId) => {
        navigate(`/group-public-view/${groupId}`);
    };
  
    const handleCreateGroup = async () => {
      const groupName = prompt("Enter the name of the new group:");
      const groupDescription = prompt("Enter a description for the group:");
  
      if (!groupName || !groupDescription) {
        alert("Group name and description are required.");
        return;
      }
  
      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/api/v1/groups/create/",
          { name: groupName, description: groupDescription },
          { headers: { Authorization: `Token ${localStorage.getItem("authToken")}` } } // Adjust for your auth setup
        );
        alert("Group created successfully!");
        setGroups([...groups, response.data]); // Optimistic update
      } catch (err) {
        alert("Failed to create group.");
      }
    };
  
    return (
      <div className="group-list-page">
        <header className="header">
          <h1>Find Groups</h1>
          <div className="slider-container">
            <div className="slider-header">
                <label htmlFor="distance-slider" className="slider-label">Radius: {distance} km</label>
                <button onClick={fetchPosts} className="slider-button">Search</button>
            </div>
            <input
                id="distance-slider"
                type="range"
                min="1"
                max="100"
                value={distance}
                onChange={handleDistanceChange}
                className="modern-slider"
            />
        </div>
          <button className="create-group-button" onClick={handleCreateGroup}>
            + Create Group
          </button>
        </header>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <div className="group-list">
            {groups.map((group) => (
              <div key={group.id} className="group-card" onClick={handleGroupClick}>
                <img
                  src={group.group_image}
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
}

export default FindGroupPage
