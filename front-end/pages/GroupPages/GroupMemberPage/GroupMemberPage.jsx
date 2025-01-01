import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import './GroupMemberPage.css'

const GroupMemberPage = () => {
  const { pk } = useParams(); // Retrieve the group ID from the URL
  const navigate = useNavigate(); // For navigating to another page
  const [groupDetails, setGroupDetails] = useState(null);
  const [groupPosts, setGroupPosts] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [errorDetails, setErrorDetails] = useState(null);
  const [errorPosts, setErrorPosts] = useState(null);
  const [inviteStatus, setInviteStatus] = useState(null);


  useEffect(() => {
    fetchGroupDetails();
    fetchGroupPosts();
  }, []);

  const fetchGroupDetails = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/v1/groups/${pk}/`, {
        headers: { Authorization: `Token ${localStorage.getItem("token")}` },
      });
      setGroupDetails(response.data);
      setLoadingDetails(false);
    } catch (err) {
      setErrorDetails("Failed to fetch group details.");
      setLoadingDetails(false);
    }
  };

  const fetchGroupPosts = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/v1/groups/${pk}/posts`, {
        headers: { Authorization: `Token ${localStorage.getItem("token")}` },
      });
      setGroupPosts(response.data);
      setLoadingPosts(false);
    } catch (err) {
      setErrorPosts("Failed to fetch group posts.");
      setLoadingPosts(false);
    }
  };

  const handleInvite = async () => {
    const inviteeId = prompt("Enter the ID of the user you want to invite:");
    if (!inviteeId) {
      alert("Invitee ID is required.");
      return;
    }

    try {
      const response = await axios.post(
        "/api/groups/invite/",
        { group: pk, invitee: inviteeId },
        { headers: { Authorization: `Token ${localStorage.getItem("authToken")}` } }
      );
      setInviteStatus("Invitation sent successfully.");
    } catch (err) {
      setInviteStatus("Failed to send invitation.");
    }
  };

  const handleAdminPortal = () => {
    navigate("/groups/:pk/admin-portal"); // Update this route as necessary
  };

  return (
    <div>
      {loadingDetails ? (
        <p>Loading group details...</p>
      ) : errorDetails ? (
        <p>{errorDetails}</p>
      ) : (
        <div>
          <h1>{groupDetails.name}</h1>
          <p>{groupDetails.description}</p>
          <button onClick={handleInvite}>Send Invite</button>
          {inviteStatus && <p>{inviteStatus}</p>}
          {(groupDetails.role === "admin" || groupDetails.role === "creator") && (
            <button onClick={handleAdminPortal}>Admin Page</button>
          )}
        </div>
      )}

      {loadingPosts ? (
        <p>Loading group posts...</p>
      ) : errorPosts ? (
        <p>{errorPosts}</p>
      ) : (
        <div>
          <h2>Group Posts</h2>
          {groupPosts.length === 0 ? (
            <p>No posts in this group yet.</p>
          ) : (
            <ul>
              {groupPosts.map((post) => (
                <li key={post.id}>{post.content}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default GroupMemberPage;
