import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Modal, Form } from "react-bootstrap";
import "./GroupMemberPage.css";
import HomePageCard from "../../../components/HomePageCard/HomePageCard";

const GroupMemberPage = () => {
  const { pk } = useParams();
  const navigate = useNavigate();
  const [groupDetails, setGroupDetails] = useState(null);
  const [groupPosts, setGroupPosts] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [errorDetails, setErrorDetails] = useState(null);
  const [errorPosts, setErrorPosts] = useState(null);
  const [inviteStatus, setInviteStatus] = useState(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [inviteError, setInviteError] = useState(null);

  useEffect(() => {
    fetchGroupDetails();
    fetchGroupPosts();
  }, []);

  const fetchGroupDetails = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/v1/groups/${pk}/`, {
        headers: { Authorization: `Token ${localStorage.getItem("token")}` },
      });
      console.log(response.data)
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

  const handleInviteModalOpen = () => {
    setShowInviteModal(true);
  };

  const handleInviteModalClose = () => {
    setShowInviteModal(false);
    setSearchTerm("");
    setSearchResults([]);
    setInviteStatus(null);
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/v1/users/search/", {
        params: { query: searchTerm },
        headers: { Authorization: `Token ${localStorage.getItem("token")}` },
      });
      setSearchResults(response.data);
    } catch (err) {
      console.error("Failed to search users.");
    }
  };

  const handleSendInvite = async (userId) => {
    try {
      await axios.post(
        "http://127.0.0.1:8000/api/v1/groups/invite/",
        { group: pk, invitee: userId },
        { headers: { Authorization: `Token ${localStorage.getItem("token")}` } }
      );
      setInviteStatus("Invitation sent successfully.");
      setInviteError(null);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.detail) {
        setInviteError(err.response.data.detail);
      } else {
        setInviteError("An unexpected error occurred.");
      }
    }
  };

  const handleAdminPortal = () => {
    navigate(`/groups/${pk}/admin-portal`);
  };

  const handlePostClick = (postId) => {
    navigate(`/post/${postId}`);
  };


  return (
    <div className="group-member-page">
      {loadingDetails ? (
        <p>Loading group details...</p>
      ) : errorDetails ? (
        <p>{errorDetails}</p>
      ) : (
        <div className="group-header">
          <div className="group-member-image" style={{ backgroundImage: `url(${groupDetails.group_image})` }}></div>
          <div className="group-header-details"> 

            <div className="group-info">
              <div>
                <h2>{groupDetails.name}</h2>
                <p>{groupDetails.address}</p>
                <p>{groupDetails.description}</p>
              </div>
            </div>
          </div>
          <div className="group-header-buttons">
            <div className="member-dropdown">
              <button className="dropdown-toggle">Members ({groupDetails.members.length})</button>
              <div className="dropdown-menu">
                {groupDetails.members.map((member) => (
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

            <div className="group-actions">
                {groupDetails.role === "admin" && (
                  <button className="admin-button" onClick={handleAdminPortal}>
                    Admin Page
                  </button>
                )}
                <button className="invite-button" onClick={handleInviteModalOpen}>
                  Invite 
                </button>
            </div>
          </div>
          
        </div>
      )}

      {loadingPosts ? (
        <p>Loading group posts...</p>
      ) : errorPosts ? (
        <p>{errorPosts}</p>
      ) : (
        <div className="card-container">
          {groupPosts.length === 0 ? (
            <p>No posts in this group yet.</p>
          ) : (
            groupPosts.map((post) => (
              <HomePageCard key={post.id} post={post} onClick={handlePostClick} />
            ))
          )}
        </div>
      )}

      <Modal show={showInviteModal} onHide={handleInviteModalClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Invite User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            {inviteStatus && <p className="success-message">{inviteStatus}</p>}
            {inviteError && <p className="error-message">{inviteError}</p>}
          </div>
          <Form>
            <Form.Group controlId="searchTerm">
              <Form.Label>Search by name or email:</Form.Label>
              <Form.Control
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Enter name or email"
              />
            </Form.Group>
            <button className="search-button" onClick={handleSearch}>
              Search
            </button>
          </Form>
          <div className="search-results">
            {searchResults.length === 0 ? (
              <p>No users found.</p>
            ) : (
              searchResults.map((user) => (
                <div key={user.id} className="user-card">
                  <span>{user.first_name} {user.last_name} ({user.email})</span>
                  <button className="send-invite-button" onClick={() => handleSendInvite(user.id)}>
                    Send Invite
                  </button>
                </div>
              ))
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button className="close-button" onClick={handleInviteModalClose}>
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default GroupMemberPage;
