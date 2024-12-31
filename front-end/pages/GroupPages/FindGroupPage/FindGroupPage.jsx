import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";
import "./FindGroupPage.css";
import axios from "axios";

const FindGroupPage = () => {
  const [distance, setDistance] = useState(50);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: "", description: "", address: "", group_image: null });
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/v1/groups/public/", {
        headers: { Authorization: `Token ${token}` },
        params: { distance },
      });
      setGroups(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch groups.");
      setLoading(false);
    }
  };

  const handleCreateGroupModal = () => {
    setShowModal(true);
  };

  const handleDistanceChange = (event) => {
    setDistance(event.target.value);
  };

  const handleGroupClick = (groupId) => {
    navigate(`/group-public-view/${groupId}`);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setNewGroup({ name: "", description: "", address: "", group_image: null });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewGroup((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setNewGroup((prev) => ({ ...prev, group_image: e.target.files[0] }));
  };

  const handleCreateGroup = async () => {
    const formData = new FormData();
    formData.append("name", newGroup.name);
    formData.append("description", newGroup.description);
    formData.append("address", newGroup.address);
    if (newGroup.group_image) {
      formData.append("group_image", newGroup.group_image);
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/v1/groups/create/",
        formData,
        {
          headers: { 
            Authorization: `Token ${token}`, 
            "Content-Type": "multipart/form-data"
          }
        }
      );
      alert("Group created successfully!");
      setGroups([...groups, response.data]); // Optimistic update
      handleModalClose();
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
            <button onClick={fetchGroups} className="slider-button">Search</button>
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
        <button className="create-group-button" onClick={handleCreateGroupModal}>
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
            <div key={group.id} className="group-card" onClick={() => handleGroupClick(group.id)}>
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

      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Group</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="groupName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newGroup.name}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="groupDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={newGroup.description}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="groupAddress">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={newGroup.address}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="groupImage">
              <Form.Label>Group Image</Form.Label>
              <Form.Control
                type="file"
                name="group_image"
                onChange={handleFileChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCreateGroup}>
            Create
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default FindGroupPage;