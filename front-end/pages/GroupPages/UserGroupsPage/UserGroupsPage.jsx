import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import './UserGroupsPage.css'

const UserGroupsPage = () => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [groups, setGroups] = useState([]);
    const navigate = useNavigate();


    useEffect(() => {
      fetchUserGroups();
    }, []);
  
    const fetchUserGroups = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/v1/groups/my-groups/", {
          headers: { Authorization: `Token ${localStorage.getItem("token")}` },
        });
        console.log(response)
        setGroups(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch your groups.");
        setLoading(false);
      }
    };

    const handleNav = (groupId) => {
      navigate(`/group-member-page/${groupId}`);
    }
  
    if (loading) return <p>Loading...</p>;
    if (error) return <p className="error">{error}</p>;
  
    return (
      <div className="user-groups-page">
        <div className="top-content ug-header">
          <h1>Your Groups</h1>
        </div>
        {groups.length === 0 ? (
          <p>You are not a member of any groups yet.</p>
        ) : (
          <div className="group-list">
            {groups.map((group) => (
              <div key={group.id} className="group-card" onClick={() => handleNav(group.id)}>
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
