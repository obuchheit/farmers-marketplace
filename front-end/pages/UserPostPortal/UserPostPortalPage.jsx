import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Form, Card, Row, Col } from 'react-bootstrap';
import axios from "axios";
import './UserPostPortalPage.css'

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

    const handleEditPost = async () => {
        try {
            const form = new FormData();

            //Append all form fields
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
            fetchUserPosts(); // Refresh posts
        } catch (err) {
            alert('Error updating post. Please try again.');
            console.error(err.response?.data || err.message);
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

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({
            ...formData,
            [name]: files ? files[0] : value,
        });
    };

    const handleSwitchChange = (e) => {
        const { name, checked } = e.target;
        setFormData({
            ...formData,
            [name]: checked, // Use the `checked` property for boolean values
        });
    };


  return (
    <div>
            <div>
                <Button onClick={openCreateModal} variant="primary" className="mb-3 create-button">
                    Create New Post
                </Button>
            </div>
    
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}

            <Row xs={1} md={2} lg={3} className="g-4">
                {posts.map(post => (
                    <Col key={post.id}>
                        <div className="card" onClick={() => onClick(post.id)}>
                            <img src={post.image} alt={post.title} />
                            <h2>{post.title}</h2>
                            <p>{post.description}</p>
                            <div className="button-container">
                                <button className="edit-button" variant="info" onClick={() => openEditModal(post)}>Edit</button>{' '}
                                <button className="delete-button" variant="danger" onClick={() => handleDeletePost(post.id)}>Delete</button>
                            </div>
                        </div>
                    </Col>
                    
                ))}
            </Row>

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
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleEditPost}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
  )
}

export default UserPostPortalPage
