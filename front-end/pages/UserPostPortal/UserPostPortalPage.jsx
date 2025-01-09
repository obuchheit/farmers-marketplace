import { useState, useEffect } from "react";
import { Modal, Button, Form } from 'react-bootstrap';
import axios from "axios";
import './UserPostPortalPage.css';

import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";
import { CgUnavailable } from "react-icons/cg";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";

const UserPostPortalPage = ({ user }) => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [posts, setPosts] = useState([]);
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
    const token = localStorage.getItem('token');

    const fetchUserPosts = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get('http://localhost:8000/api/v1/posts/user-posts/', {
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

    const togglePublic = async (post) => {
        try {
            console.log(`Toggling public visibility for post ID: ${post.id}`, { is_public: !post.is_public });
            await axios.patch(`http://localhost:8000/api/v1/posts/user-posts/${post.id}/`, 
                { is_public: !post.is_public }, 
                { headers: { Authorization: `Token ${token}` } }
            );
            fetchUserPosts();
        } catch (err) {
            console.error(err.response || err.message);
            alert('Error toggling public visibility.');
        }
    };
    
    const toggleAvailable = async (post) => {
        try {
            console.log(`Toggling availability for post ID: ${post.id}`, { is_available: !post.is_available });
            await axios.patch(`http://localhost:8000/api/v1/posts/user-posts/${post.id}/`, 
                { is_available: !post.is_available }, 
                { headers: { Authorization: `Token ${token}` } }
            );
            fetchUserPosts();
        } catch (err) {
            console.error(err.response || err.message);
            alert('Error toggling availability.');
        }
    };
    

    const openEditModal = (post) => {
        setSelectedPost(post);
        setFormData({
            title: post.title,
            description: post.description,
            address: post.address,
            is_available: post.is_available,
            is_public: post.is_public,
            image: null,
        });
        setShowEditModal(true);
    };

    const handleEditPost = async () => {
        try {
            const form = new FormData();
            Object.keys(formData).forEach(key => {
                if (formData[key] !== null) {
                    form.append(key, formData[key]);
                }
            });

            await axios.put(`http://localhost:8000/api/v1/posts/user-posts/${selectedPost.id}/`, form, {
                headers: {
                    Authorization: `Token ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            setShowEditModal(false);
            fetchUserPosts();
        } catch (err) {
            alert('Error updating post. Please try again.');
        }
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({
            ...formData,
            [name]: files ? files[0] : value,
        });
    };

    return (
        <div className="post-portal-page">
            <div>
                <Button variant="primary" className="mb-3 create-button">Create New Post</Button>
            </div>

            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}

            <div className="posts-container">
                {posts.map(post => (
                    <div key={post.id} className="post-card">
                        <img 
                            src={post.image} 
                            alt={post.title} 
                            className="user-post-image" 
                            onClick={() => openEditModal(post)}
                        />
                        <h2>{post.title}</h2>
                        <p>{post.description}</p>

                        <div className="action-icons">
                            <div onClick={() => togglePublic(post)}>
                                {post.is_public ? 
                                    <><MdOutlineVisibilityOff /> Make visible to only your groups</> : 
                                    <><MdOutlineVisibility /> Make visible to everyone</>
                                }
                            </div>

                            <div onClick={() => toggleAvailable(post)}>
                                {post.is_available ? 
                                    <><CgUnavailable /> Mark as unavailable</> : 
                                    <><IoIosCheckmarkCircleOutline /> Mark as available</>
                                }
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Edit Post Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Post</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Title</Form.Label>
                            <Form.Control type="text" name="title" value={formData.title} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Address</Form.Label>
                            <Form.Control type="text" name="address" value={formData.address} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Image</Form.Label>
                            <Form.Control type="file" name="image" onChange={handleChange} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleEditPost}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default UserPostPortalPage;
