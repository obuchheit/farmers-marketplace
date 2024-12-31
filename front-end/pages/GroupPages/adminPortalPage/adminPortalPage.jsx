import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import './adminPortalPage.css'

const adminPortalPage = () => {
    const { pk } = useParams(); // Retrieve the group ID from the URL
    const [joinRequests, setJoinRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      fetchJoinRequests();
    }, []);
  
    const fetchJoinRequests = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/v1/groups/${pk}/join-requests/`, {
          headers: { Authorization: `Token ${localStorage.getItem("authToken")}` },
        });
        setJoinRequests(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch join requests.");
        setLoading(false);
      }
    };
  
    const handleApprove = async (requestId) => {
      try {
        await axios.post(`http://127.0.0.1:8000/api/v1/groups/join-request/approve/${requestId}/`, {}, {
          headers: { Authorization: `Token ${localStorage.getItem("authToken")}` },
        });
        alert("Join request approved successfully.");
        setJoinRequests(joinRequests.filter((request) => request.id !== requestId));
      } catch (err) {
        alert("Failed to approve join request.");
      }
    };
  
    const handleDeny = async (requestId) => {
      try {
        await axios.post(`http://127.0.0.1:8000/api/v1/groups/join-request/deny/${requestId}/`, {}, {
          headers: { Authorization: `Token ${localStorage.getItem("authToken")}` },
        });
        alert("Join request denied successfully.");
        setJoinRequests(joinRequests.filter((request) => request.id !== requestId));
      } catch (err) {
        alert("Failed to deny join request.");
      }
    };
  
    if (loading) return <p>Loading...</p>;
    if (error) return <p className="error">{error}</p>;
  
    return (
      <div className="admin-portal-page">
        <h1>Admin Portal</h1>
        {joinRequests.length === 0 ? (
          <p>No join requests at the moment.</p>
        ) : (
          <div className="join-requests">
            {joinRequests.map((request) => (
              <div key={request.id} className="join-request-card">
                <p><strong>User:</strong> {request.user.first_name} {request.user.last_name}</p>
                <p><strong>Email:</strong> {request.user.email}</p>
                <p><strong>Requested At:</strong> {new Date(request.request_date).toLocaleString()}</p>
                <div className="actions">
                  <button onClick={() => handleApprove(request.id)}>Approve</button>
                  <button onClick={() => handleDeny(request.id)}>Deny</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

export default adminPortalPage
