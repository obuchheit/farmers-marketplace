import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./GroupPublicPage.css";

const GroupPublicPage = () => {
  const { pk } = useParams(); // Retrieve the group ID from the URL
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [joinRequestStatus, setJoinRequestStatus] = useState('');
  const token = localStorage.getItem('token');


  useEffect(() => {
    fetchGroupDetails();
  }, []);

  const fetchGroupDetails = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/v1/groups/public/${pk}/`, {
        headers: { Authorization: `Token ${token}` },
      });
      setLoading(false);
      console.log(response.data)
      setGroup(response.data)
    } catch (err) {
      setError("Failed to fetch group details.");
      setLoading(false);
    }
  };

  const handleJoinRequest = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/v1/groups/join-request/create/",  
          { 'group': pk },
          {headers: { Authorization: `Token ${token}` },
        });
      setJoinRequestStatus("Request sent successfully.");
      alert('Request sent succesfully')
    } catch (err) {
      console.log(err)
      setJoinRequestStatus("Failed to send join request.");
      alert('Failed to send join request.')
    }
  };


  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="group-public-page">
        <div className="group-public-image" style={{ backgroundImage: `url(${group.group_image})` }}></div>
        <div className="group-header-details"> 
          <div className="group-info">
            <div>
              <h2>{group.name}</h2>
              <p>{group.address}</p>
              <p>{group.description}</p>
            </div>
          </div>
        </div>
        <div className="group-public-buttons">
        <div className="member-dropdown">
              <button className="dropdown-toggle">Members ({group.members.length})</button>
              <div className="dropdown-menu">
                {group.members.map((member) => (
                <div key={member.id} className="member-item">
                  <div className="group-member-profile">
                    <Link to={`/public-profile-page/${member.id}`} style={{ textDecoration: 'none', color: "inherit"  }}>
                      <img src={`http://127.0.0.1:8000${member.profile_picture}`} alt={`${member.first_name}'s profile`} className="member-avatar"/>
                      <span>{member.first_name} {member.last_name}</span>
                    </Link>
                  </div>
                </div>
                ))}
              </div>
            </div>
          <button className="join-group-button" onClick={handleJoinRequest}>
            Request to Join Group
          </button>
          
        </div>
    </div>
  );
};

export default GroupPublicPage
