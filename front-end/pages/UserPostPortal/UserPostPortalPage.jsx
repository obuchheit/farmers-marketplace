import { useState, useEffect } from "react";
import { Button } from 'react-bootstrap';
import axios from "axios";
import './UserPostPortalPage.css';
import { TbEyeEdit } from "react-icons/tb";
import { MdOutlineVisibility } from "react-icons/md";
import { CgUnavailable } from "react-icons/cg";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import './UserPostPortalPage.css';
import { fetchSavedPosts } from '../../utilities.jsx'; // Import fetchSavedPosts
import { CreatePostModal, SavedPostsCarousel, EditPostModal } from "../../components/CreatePostModal/CreatePostModal.jsx";



const UserPostPortalPage = ({ user }) => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [posts, setPosts] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [imagePreview, setImagePreview] = useState("http://127.0.0.1:8000/media/post_images/default_post_image.jpg");

    const [showSavedPosts, setShowSavedPosts] = useState(false);
    const [savedPosts, setSavedPosts] = useState([]);

    const [selectedPost, setSelectedPost] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        address: '',
        is_available: true,
        is_public: true,
        image: null,
    });
    const navigate = useNavigate();
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
        if (name === "image" && files && files[0]) {
            const file = files[0];
            setFormData({ ...formData, image: file });

            // Generate preview URL
            const reader = new FileReader();
            reader.onload = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    // User Saved Posts
    const loadSavedPosts = async () => {
        try {
            const savedPostsData = await fetchSavedPosts();
            setSavedPosts(savedPostsData);
        } catch (err) {
            console.error(err);
        }
    };

    const toggleSavedPosts = () => {
        setShowSavedPosts(!showSavedPosts);
        if (!showSavedPosts) {
            loadSavedPosts();
        }
    };

    const handlePostClick = (postId) => {
        navigate(`/post/${postId}`);
    };
    

    return (
        <div className="post-portal-page">
            {/* Header Section */}
            <div className="header">
                <h2>Post Dashboard</h2>
                <div className="stats">
                    <h4>Total Posts: {posts.length}</h4>
                    <h4>Available: {posts.filter(post => post.is_available).length}</h4>
                    <h4>Public: {posts.filter(post => post.is_public).length}</h4>
                </div>
                <div className="header-buttons">
                    <Button onClick={openCreateModal} className="header-button">
                        Create Post
                    </Button>
                    <Button onClick={toggleSavedPosts} className="header-button">Saved Posts</Button>
                </div>
            </div>

            {/* Saved Posts Carousel */}
            {showSavedPosts && (
                <SavedPostsCarousel
                    savedPosts={savedPosts}
                    handlePostClick={(postId) => navigate(`/post/${postId}`)}
                    onClose={() => setShowSavedPosts(false)}
                />
            )}
            {showSavedPosts && savedPosts.length === 0 && <p>No saved posts available.</p>}


            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}


                <div className="user-card-container ">
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

            {/* Modals */}
            <CreatePostModal
                show={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                formData={formData}
                setFormData={setFormData}
                handleCreatePost={handleCreatePost}
                imagePreview={imagePreview}
                handleChange={handleChange}
            />

            <EditPostModal
                show={showEditModal}
                onClose={() => setShowEditModal(false)}
                formData={formData}
                setFormData={setFormData}
                handleEditPost={handleEditPost}
                selectedPost={selectedPost}
                handleDeletePost={handleDeletePost}
            />
        </div>
    );
};

export default UserPostPortalPage;
