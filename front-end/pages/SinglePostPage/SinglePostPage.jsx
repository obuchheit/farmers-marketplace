import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FaRegStar, FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './SinglePostPage.css';

const SinglePostPage = () => {
    const { postId } = useParams();
    const { savedPosts, toggleSavedPost } = useOutletContext(); // Access savedPosts and toggleSavedPost
    const [post, setPost] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Determine if the post is saved on load
    const isInitiallySaved = savedPosts.includes(postId);
    const [isSaved, setIsSaved] = useState(isInitiallySaved);

    const handleSaveToggle = async () => {
        await toggleSavedPost(postId); // Call toggleSavedPost from App.jsx
        setIsSaved(!isSaved); // Toggle the local state
    };

    
    const handleStartConversation = async () => {
        const userFullName = `${post.user.first_name} ${post.user.last_name}`
        const otherUserId = post.user.id
        console.log(userFullName)
        navigate(`/chats/new-message/${userFullName}/${otherUserId}`)
    }

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:8000/api/v1/posts/${postId}/`, {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });
                setPost(response.data);
            } catch (err) {
                setError(err.response ? err.response.data : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [postId]);

    useEffect(() => {
        // Update the saved state when savedPosts changes
        setIsSaved(savedPosts.includes(postId));
    }, [savedPosts, postId]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h1>{post.title}</h1>
            <div className="post-image">
                <img className="post-image" src={post.image} alt="" />
            </div>
            <div className="profile-save-container">
                <Link to={`/public-profile-page/${post.user.id}`} className="link-style">
                    <div className="user-div">
                        <img className="user-image" src={post.user.profile_picture} />
                        <div>{post.user.first_name} {post.user.last_name}</div>
                    </div>
                </Link>
                {/* Save Post section */}
                <div className="save-post-container" onClick={handleSaveToggle}>
                    {isSaved ? (
                        <>
                            <FaStar className="saved-icon" />
                            <span>Unsave</span>
                        </>
                    ) : (
                        <>
                            <FaRegStar className="unsaved-icon" />
                            <span> Save</span>
                        </>
                    )}
                </div>
                <div>
                    <Link onClick={handleStartConversation}>
                        <p>message user</p>
                    </Link>
                </div>
            </div>

            <div className="info-container">
                <p><strong>Description: </strong>{post.description}</p>
                <p><strong>Location:</strong> {post.address}</p>
                <p><strong>Posted At:</strong> {Date(post.time_posted).toLocaleString()}</p>
                <p><strong>Available:</strong> {post.is_available ? 'Yes' : 'No'}</p>
            </div>
        </div>
    );
};

export default SinglePostPage;
