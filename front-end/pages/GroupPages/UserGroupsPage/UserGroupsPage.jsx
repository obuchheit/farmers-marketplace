import React, { useState, useEffect } from "react";
import { IoIosNotificationsOutline } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";
import "./UserGroupsPage.css";

const UserGroupsPage = () => {
  const [groups, setGroups] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const navigate = useNavigate();
  const userToken = localStorage.getItem("token");

  useEffect(() => {
    fetchGroups();
    fetchNotifications();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/v1/groups/my-groups/", {
        headers: { Authorization: `Token ${userToken}` },
      });
      setGroups(response.data);
    } catch (err) {
      console.error("Failed to fetch groups.", err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/v1/groups/notifications/", {
        headers: { Authorization: `Token ${userToken}` },
      });
      setNotifications(response.data);
      setUnreadCount(response.data.filter((notif) => !notif.is_read).length);
    } catch (err) {
      console.error("Failed to fetch notifications.", err);
    }
  };

  const markNotificationsAsRead = async () => {
    try {
      // Mark notifications as read locally
      setNotifications((prevNotifications) =>
        prevNotifications.map((notif) => ({ ...notif, is_read: true }))
      );
      setUnreadCount(0); // Reset unread count
  
      // Send requests to mark notifications as read in the backend
      for (const notif of notifications) {
        if (!notif.is_read) {
          await axios.post(
            `http://127.0.0.1:8000/api/groups/v1/notifications/${notif.id}/read/`,
            {},
            {
              headers: { Authorization: `Token ${userToken}` },
            }
          );
        }
      }
    } catch (err) {
      console.error("Failed to mark notifications as read.", err);
    }
  };
  
  

  const toggleNotificationsModal = () => {
    setShowNotificationsModal(!showNotificationsModal);
    if (!showNotificationsModal) {
      markNotificationsAsRead();
    }
  };

  return (
    <div className="user-groups-page">
      <header className="header">
        <h1>Your Groups</h1>
        <div className="notifications-icon-container" onClick={toggleNotificationsModal}>
          <IoIosNotificationsOutline className="notifications-icon" />
          {unreadCount > 0 && <span className="unread-count">{unreadCount}</span>}
        </div>
      </header>

      <div className="group-list">
        {groups.length === 0 ? (
          <p>You are not a member of any groups yet.</p>
        ) : (
          groups.map((group) => (
            <div key={group.id} className="group-card">
              <img src={group.group_image} alt={group.name} className="group-image" />
              <div className="group-details">
                <h2>{group.name}</h2>
                <p>{group.description}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal show={showNotificationsModal} onHide={toggleNotificationsModal}>
        <Modal.Header closeButton>
          <Modal.Title>Notifications</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {notifications.length === 0 ? (
            <p>No notifications.</p>
          ) : (
            notifications.map((notif) => (
              <div key={notif.id} className={`notification-item ${notif.is_read ? "read" : "unread"}`}>
                <p>{notif.message}</p>
                <span>{new Date(notif.timestamp).toLocaleString()}</span>
              </div>
            ))
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={toggleNotificationsModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserGroupsPage;
