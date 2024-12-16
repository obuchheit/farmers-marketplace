import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Form, Card, Row, Col } from 'react-bootstrap';
import axios from "axios";

const UserPostPortalPage = ({ user }) => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [posts, setPosts] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        address: '',
        is_available: true,
        is_public: true,
        image: null,
    });


    const fetchUserPosts = async () => {
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get('http://localhost:8000/user-posts/', {
                headers: { Authorization: `Token ${token}` },
            });
            setPosts(response.data);
        } catch (err) {
            setError(err.response ? err.response.data : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserPosts();
    }, []);



  return (
    <div>
      
    </div>
  )
}

export default UserPostPortalPage
