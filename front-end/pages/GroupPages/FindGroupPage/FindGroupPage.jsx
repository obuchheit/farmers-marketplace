import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import { MdOutlineEditLocationAlt, MdSearch } from "react-icons/md";
import { IoAddSharp } from "react-icons/io5";
import { GrMapLocation } from "react-icons/gr";
import { TbPhotoEdit } from "react-icons/tb";
import axios from "axios";
import { useMapboxToken } from "../../../utilities";
import RadiusLocationModal from "../../../components/RadiusLocationModal/RadiusLocationModal";
import "mapbox-gl/dist/mapbox-gl.css";
import "./FindGroupPage.css";

const FindGroupPage = () => {
  const [distance, setDistance] = useState(50);
  const [searchQuery, setSearchQuery] = useState("");
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: "",
    description: "",
    address: "",
    group_image: null,
  });
  const [userLocation, setUserLocation] = useState({
    lng: -87.6298,
    lat: 41.8781,
  }); // Default to Chicago, IL
  const [showRadiusModal, setShowRadiusModal] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [viewport, setViewport] = useState({
    latitude: 41.8781,
    longitude: -87.6298,
    zoom: 7,
  });

  const navigate = useNavigate();
  const userToken = localStorage.getItem("token");
  const { token: mapboxToken, fetchToken, loading: loadingToken, error: errorToken } = useMapboxToken();


  const fetchGroups = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/v1/groups/public/", {
        headers: { Authorization: `Token ${userToken}` },
        params: { distance, search: searchQuery },
      });
      console.log(response.data)
      setGroups(response.data);
    } catch (err) {
      setError("Failed to fetch groups.");
    } finally {
      setLoading(false);
    }
  };

  useEffect (() => {
    fetchGroups()
  }, [])

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    fetchGroups();
  };

  const toggleRadiusModal = async () => {
    await fetchToken();
    setShowRadiusModal(!showRadiusModal);
  };

  const handleMarkerDragEnd = (event) => {
    setUserLocation({ lng: event.lngLat.lng, lat: event.lngLat.lat });
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
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Group created successfully!");
      setGroups([...groups, response.data]); // Optimistic update
      handleModalClose();
    } catch (err) {
      alert("Failed to create group.");
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setNewGroup({ name: "", description: "", address: "", group_image: null });
  };

  const handleOpenMap = async () => {
    await fetchToken();
    setShowMap(true);
  };

  const handleCloseMap = () => setShowMap(false);

  return (
    <div className="find-group-page">
      {/* Header Section */}
      <div className="group-top-content">
        <div className="find-groups">
          <h4>Find Groups</h4>
        </div>
        <div className="create-group-button" onClick={() => setShowModal(true)}>
          <IoAddSharp className="create-group-icon" />
          <span className="create-group-text">Create Group</span>
        </div>

        <form className="search-form" onSubmit={handleSearchSubmit}>
          <MdSearch className="search-icon" />
          <input
            type="text"
            className="search-bar"
            placeholder="Search for groups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search" onClick={fetchGroups}>
            Search
          </button>
        </form>
        <div className="group-address-radius-container">
          <MdOutlineEditLocationAlt className="edit-location-icon" onClick={toggleRadiusModal} />
          <span className="radius-info">Radius: {distance} km</span>
        </div>
        <div className="map-icon-div">
          <GrMapLocation className="map-icon" onClick={handleOpenMap}/>
        </div>
      </div>

      {/* Group List Section */}
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <div className="card-container">
          {groups.map((group) => (
            <div
              key={group.id}
              className="group-card"
              onClick={() => navigate(`/group-public-view/${group.id}`)}
            >
              <img src={group.group_image} alt={group.name} className="group-image" />
              <div className="group-details">
                <h2>{group.name}</h2>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton className="edit-modal-header">
          <Modal.Title>Create New Group</Modal.Title>
        </Modal.Header>
        <Modal.Body className="edit-modal">
          <div style={{ position: "relative", marginBottom: "1rem" }}>
            {newGroup.group_image ? (
              <img
                src={URL.createObjectURL(newGroup.group_image)}
                alt="Group Preview"
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "200px",
                  backgroundColor: "#e9ecef",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "8px",
                  fontSize: "1.5rem",
                  color: "#6c757d",
                }}
              >
                No Image Selected
              </div>
            )}
            <TbPhotoEdit
              onClick={() => document.getElementById("group-image-input").click()}
              className="TbPhotoEdit"
            />
            <input
              type="file"
              id="group-image-input"
              style={{ display: "none" }}
              onChange={(e) => setNewGroup({ ...newGroup, group_image: e.target.files[0] })}
            />
          </div>
          <Form>
            <Form.Group>
              <Form.Label>Group Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newGroup.name}
                onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                id="form-control-background"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={newGroup.description}
                onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                id="form-control-background"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={newGroup.address}
                onChange={(e) => setNewGroup({ ...newGroup, address: e.target.value })}
                id="form-control-background"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="edit-modal-footer">
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCreateGroup}>
            Create Group
          </Button>
        </Modal.Footer>
      </Modal>


      {/* Map Modal */}
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
      <RadiusLocationModal
        show={showRadiusModal}
        onClose={() => setShowRadiusModal(false)}
        distance={distance}
        setDistance={setDistance}
        userLocation={userLocation}
        setUserLocation={setUserLocation}
        mapboxToken={mapboxToken}
        fetchPosts={fetchGroups}
      />
     
    </div>
  );
};

export default FindGroupPage;
