import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./GroupPublicPage.css";

const GroupPublicPage = () => {
  const { pk } = useParams(); // Retrieve the group ID from the URL
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGroupDetails();
  }, []);

  const fetchGroupDetails = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/v1/groups/public/${pk}/`); // Adjust URL if necessary
      setGroup(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch group details.");
      setLoading(false);
    }
  };

  const handleJoinRequest = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/v1/groups/join-request/", 
        { group: pk },
        { headers: { Authorization: `Token ${localStorage.getItem("authToken")}` } } // Adjust for your auth setup
      );
      setJoinRequestStatus("Request sent successfully.");
    } catch (err) {
      setJoinRequestStatus("Failed to send join request.");
    }
  };


  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="group-detail-page">
      <header className="header">
        <h1>{group.name}</h1>
      </header>
      <div className="group-detail">
        <img
          src={group.group_image || "default-group-image.jpg"}
          alt={group.name}
          className="group-image"
        />
        <div className="group-info">
          <p><strong>Description:</strong> {group.description}</p>
          <p><strong>Address:</strong> {group.address}</p>
          <p><strong>Created By:</strong> {group.created_by.first_name} {group.created_by.last_name}</p>
          <p><strong>Members:</strong> {group.members.length}</p>
          <ul>
            {group.members.map((member, index) => (
              <li key={index}>{member.first_name} {member.last_name}</li>
            ))}
          </ul>
          <button className="join-group-button" onClick={handleJoinRequest}>
            Request to Join Group
          </button>
          {joinRequestStatus && <p className="status-message">{joinRequestStatus}</p>}
        </div>
      </div>
    </div>
  );
};

export default GroupPublicPage
