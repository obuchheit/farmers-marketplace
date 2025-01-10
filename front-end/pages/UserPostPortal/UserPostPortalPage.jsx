import { useState, useEffect } from "react";
import { Modal, Button, Form } from 'react-bootstrap';
import axios from "axios";
import './UserPostPortalPage.css';
import { TbPhotoEdit } from "react-icons/tb";
import { MdOutlineVisibility } from "react-icons/md";
import { CgUnavailable } from "react-icons/cg";
import { TbEyeEdit } from "react-icons/tb";

import { IoIosCheckmarkCircleOutline } from "react-icons/io";

const UserPostPortalPage = ({ user }) => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [posts, setPosts] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
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

    const handleCreatePost = async () => {
        try {
            const form = new FormData();
            Object.keys(formData).forEach(key => {
                if (key === "image" && !formData[key]) return; // Skip appending if image is null
                form.append(key, formData[key]);
            });

            console.log([...form.entries()]);

            await axios.post('http://localhost:8000/api/v1/posts/user-posts/', form, {
                headers: {
                    Authorization: `Token ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            setShowCreateModal(false);
            fetchUserPosts(); // Refresh posts
            
        } catch (err) {
            console.error(err.response?.data || err.message);

            alert('Error creating post. Please try again.');
        }
    }

    const openCreateModal = () => {
        setFormData({ title: '', description: '', address: '', is_available: true, is_public: true, image: null });
        setShowCreateModal(true);
    };

    const handleSwitchChange = (e) => {
        const { name, checked } = e.target;
        setFormData({
            ...formData,
            [name]: checked, // Use the `checked` property for boolean values
        });
    };


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

    const handleDeletePost = async (postId) => {
        if (!window.confirm('Are you sure you want to delete this post?')) return;

        try {
            await axios.delete(`http://localhost:8000/api/v1/posts/user-posts/${postId}/`, {
                headers: { Authorization: `Token ${token}` },
            });
            fetchUserPosts(); // Refresh posts
        } catch (err) {
            alert('Error deleting post. Please try again.');
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
            {/* Header Section */}
            <div className="header">
                <div className="stats">
                    <h4>Total Posts: {posts.length}</h4>
                    <h4>Available: {posts.filter(post => post.is_available).length}</h4>
                    <h4>Public: {posts.filter(post => post.is_public).length}</h4>
                </div>
                <div className="header-buttons">
                    <Button onClick={openCreateModal} className="header-button">
                        Create Post
                    </Button>
                    <Button className="header-button">Saved Posts</Button>
                </div>
            </div>

    {loading && <p>Loading...</p>}
    {error && <p>Error: {error}</p>}

            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}

            <div className="posts-container">
            {posts.map(post => (
    <div key={post.id} className="user-card">
        <div className="image-container">
            <img 
                src={post.image} 
                alt={post.title} 
                className="user-post-image"
            />
            <button 
                className="edit-button"
                onClick={() => openEditModal(post)}
            >
                Edit
            </button>
        </div>
        <h2>{post.title}</h2>

        <div className="action-icons">
            <div onClick={() => togglePublic(post)}>
                {post.is_public ? 
                    <button className="icon-button private-button">
                        <TbEyeEdit className="icon"/>
                        Make private
                        <span className="private-tooltip">
                            Allow only members of your groups to see this post.
                        </span>
                    </button> 
                    : 
                    <button className="icon-button"><MdOutlineVisibility className="icon"/>Make Public</button>
                }
            </div>

            <div onClick={() => toggleAvailable(post)}>
                {post.is_available ? 
                    <button className="icon-button"><CgUnavailable className="icon"/>Mark as unavailable</button> : 
                    <button className="icon-button"><IoIosCheckmarkCircleOutline className="icon"/>Mark as available</button>
                }
            </div>
        </div>
    </div>
    ))}

            </div>
            {/* Create Post Modal */}
            <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Create New Post</Modal.Title>
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
                        <Form.Group>
                            <Form.Check
                                type="switch"
                                id="is-available-switch"
                                name="is_available"
                                label="Is Available"
                                checked={formData.is_available}
                                onChange={handleSwitchChange}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Check
                                type="switch"
                                id="is-public-switch"
                                name="is_public"
                                label="Is Public"
                                checked={formData.is_public}
                                onChange={handleSwitchChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleCreatePost}>
                        Create Post
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Edit Post Modal */}
            <Modal  show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header className="edit-modal-header" closeButton>
                    <Modal.Title>Edit Post</Modal.Title>
                </Modal.Header>
                <Modal.Body className="edit-modal">
                    <div style={{ position: 'relative', marginBottom: '1rem' }}>
                        {/* Post Image */}
                        <img
                            src={selectedPost?.image}
                            alt="Post"
                            style={{
                                width: '100%',
                                height: '200px',
                                objectFit: 'cover',
                                borderRadius: '8px',
                            }}
                        />
                        {/* Edit Photo Icon */}
                        <TbPhotoEdit
                            onClick={() => document.getElementById('image-input').click()}
                            className="TbPhotoEdit"
                        />
                        <input
                            type="file"
                            id="image-input"
                            style={{ display: 'none' }}
                            name="image"
                            onChange={handleChange}
                        />
                    </div>
                    <Form>
                        {/* Title */}
                        <Form.Group>
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                id="form-control-background"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        {/* Description */}
                        <Form.Group>
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                className="form-control-background"
                                id="form-control-background"
                                as="textarea"
                                rows={3}
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        {/* Address */}
                        <Form.Group>
                            <Form.Label>Address</Form.Label>
                            <Form.Control
                                type="text"
                                name="address"
                                id="form-control-background"
                                value={formData.address}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="edit-modal-footer">
                    <div className="footer-buttons">
                        <div>
                            <Button
                                variant="danger"
                                onClick={() => handleDeletePost(selectedPost.id)}
                            >
                                Delete
                            </Button>
                        </div>    
                        <div>
                            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                                Close
                            </Button>
                            <Button className="save-button" variant="primary" onClick={handleEditPost}>
                                Save Changes
                            </Button>
                        </div>    
                    </div>
                </Modal.Footer>
            </Modal>

        </div>
    );
};

export default UserPostPortalPage;
