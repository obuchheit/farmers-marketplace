import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import { MdOutlineEditLocationAlt, MdSearch } from "react-icons/md";
import { GrMapLocation } from "react-icons/gr";

import axios from "axios";
import { useMapboxToken } from "../../../utilities";
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
        <div className="todays-posts">
          <h4>Find Groups</h4>
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
        <div className="group-list">
          {groups.map((group) => (
            <div
              key={group.id}
              className="group-card"
              onClick={() => navigate(`/group-public-view/${group.id}`)}
            >
              <img src={group.group_image} alt={group.name} className="group-image" />
              <div className="group-details">
                <h2>{group.name}</h2>
                <p>{group.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Buttons */}
      <div className="button-container">
        <Button className="create-group-button" onClick={() => setShowModal(true)}>
          + Create Group
        </Button>
      </div>

      {/* Create Group Modal */}
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Group</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            name="name"
            placeholder="Group Name"
            value={newGroup.name}
            onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
          />
          <textarea
            name="description"
            placeholder="Description"
            value={newGroup.description}
            onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
          ></textarea>
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={newGroup.address}
            onChange={(e) => setNewGroup({ ...newGroup, address: e.target.value })}
          />
          <input
            type="file"
            name="group_image"
            onChange={(e) => setNewGroup({ ...newGroup, group_image: e.target.files[0] })}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCreateGroup}>
            Create
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

      {/* Radius Modal */}
      <Modal show={showRadiusModal} onHide={toggleRadiusModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Location and Radius</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ReactMapGL
            initialViewState={{
              longitude: userLocation.lng,
              latitude: userLocation.lat,
              zoom: 7,
            }}
            style={{ width: "100%", height: "50vh" }}
            mapStyle="mapbox://styles/mapbox/streets-v11"
            mapboxAccessToken={mapboxToken}
          >
            <Marker
              longitude={userLocation.lng}
              latitude={userLocation.lat}
              draggable
              onDragEnd={handleMarkerDragEnd}
            />
          </ReactMapGL>
          <input
            type="range"
            min="1"
            max="100"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={toggleRadiusModal}>
            Close
          </Button>
          <Button variant="primary" onClick={fetchGroups}>
            Apply
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default FindGroupPage;
