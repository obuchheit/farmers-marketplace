import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import axios from "axios";
import { useMapboxToken } from "../../../utilities";
import 'mapbox-gl/dist/mapbox-gl.css';
import './FindGroupPage.css'

const FindGroupPage = () => {
  const [distance, setDistance] = useState(50);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: "", description: "", address: "", group_image: null });
  const navigate = useNavigate();
  const userToken = localStorage.getItem('token');

  const [showMap, setShowMap] = useState(false);
  const [viewport, setViewport] = useState({
    latitude: 41.8781, 
    longitude: -87.6298,
    zoom: 10,
  });

  const { token: mapboxToken, fetchToken, loading: loadingToken, error: errorToken } = useMapboxToken();

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/v1/groups/public/", {
        headers: { Authorization: `Token ${userToken}` },
        params: { distance },
      });
      console.log(response.data);
      setGroups(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch groups.");
      setLoading(false);
    }
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
            Authorization: `Token ${userToken}`, 
            "Content-Type": "multipart/form-data"
          }
        }
      );
      alert("Group created successfully!");
      setGroups([...groups, response.data]); // Optimistic update
      handleModalClose();
    } catch (err) {
      console.log(err)
      alert("Failed to create group.");
    }
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


  //Mapbox functions
  const handleOpenMap = async () => {
    await fetchToken(); 
    setShowMap(true);
  };

  const handleCloseMap = () => setShowMap(false);

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
            onChange={(e) => setDistance(e.target.value)}
            className="modern-slider"
          />
        </div>
        <button className="create-group-button" onClick={() => setShowModal(true)}>
          + Create Group
        </button>
      </header>

      <Button variant="primary" onClick={handleOpenMap} className="mt-4">
        Show Groups on Map
      </Button>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <div className="group-list">
          {groups.map((group) => (
            <div key={group.id} className="group-card" onClick={() => navigate(`/group-public-view/${group.id}`)}>
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

      <Modal show={showMap} onHide={handleCloseMap} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Group Locations</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loadingToken ? (
            <p>Loading map...</p>
          ) : errorToken ? (
            <p className="error-message">{errorToken}</p>
          ) : (
            <ReactMapGL
              initialViewState={viewport}
              style={{ width: "100%", height: "400px" }}
              mapStyle="mapbox://styles/mapbox/streets-v11"
              mapboxAccessToken={mapboxToken}
            >
              {groups.map((group) => {
                const { latitude, longitude } = group;

                // Validate if coordinates are correct before rendering
                if (typeof latitude !== "number" || typeof longitude !== "number" || isNaN(latitude) || isNaN(longitude)) {
                  console.error(`Invalid coordinates for group ${group.id}:`, latitude, longitude);
                  return null; // Skip rendering if coordinates are invalid
                }

                return (
                  <Marker key={group.id} longitude={longitude} latitude={latitude}>
                    <div className="map-div">
                      <img id='map-div-image' src={group.group_image} alt="" />
                      <p>{group.name}</p>
                      <span>{group.address}</span>
                    </div>
                  </Marker>
                );
              })}
            </ReactMapGL>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseMap}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default FindGroupPage;
