import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import './GroupMemberPage.css';
import HomePageCard from "../../../components/HomePageCard/HomePageCard";

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
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

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
      const response = await axios.get("http://127.0.0.1:8000/api/v1/users/", {
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
    } catch (err) {
      setInviteStatus("Failed to send invitation.");
    }
  };

  const handleAdminPortal = () => {
    navigate(`/groups/${pk}/admin-portal`);
  };

  const handlePostClick = (postId) => {
    navigate(`/post/${postId}`);
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
          <Button onClick={handleInviteModalOpen}>Send Invite</Button>
          {inviteStatus && <p>{inviteStatus}</p>}
          {(groupDetails.role === "admin" || groupDetails.role === "creator") && (
            <Button onClick={handleAdminPortal}>Admin Page</Button>
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
            groupPosts.map(post => (
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
            <Button variant="primary" onClick={handleSearch} className="mt-2">
              Search
            </Button>
          </Form>
          <div className="search-results mt-3">
            {searchResults.length === 0 ? (
              <p>No users found.</p>
            ) : (
              searchResults.map((user) => (
                <div key={user.id} className="user-card d-flex justify-content-between align-items-center mb-2">
                  <span>{user.first_name} {user.last_name} ({user.email})</span>
                  <Button variant="success" onClick={() => handleSendInvite(user.id)}>
                    Send Invite
                  </Button>
                </div>
              ))
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleInviteModalClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default GroupMemberPage;