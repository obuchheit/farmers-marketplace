import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { FaRegStar, FaStar, FaMapMarkerAlt } from 'react-icons/fa';
import ReactMapGL, { Marker, NavigationControl } from 'react-map-gl';
import { useMapboxToken } from "../../utilities";
import './SinglePostPage.css';

const SinglePostPage = () => {
    const { postId } = useParams();
    const { savedPosts, toggleSavedPost } = useOutletContext(); // Access context
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const { token: mapboxToken, fetchToken, loading: loadingToken, error: errorToken } = useMapboxToken();
    const [viewport, setViewport] = useState({
        latitude: 41.888424,
        longitude: -87.78796,
        zoom: 12,
        width: '100%',
        height: '100%',
    });
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    // Fetch Map token once
    useEffect(() => {
        const getMapToken = async () => {
            await fetchToken();
        };
        getMapToken();
    }, []);

    // Fetch post details on page load
    useEffect(() => {
        const fetchPost = async () => {
          try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:8000/api/v1/posts/${postId}/`, {
              headers: { Authorization: `Token ${token}` },
            });
            setPost(response.data);
          } catch (err) {
            setError(err.response?.data || 'An error occurred while fetching the post.');
          } finally {
            setLoading(false);
          }
        };
    
        fetchPost();
      }, [postId]);
    
    // Directly check savedPosts from context
    const isPostSaved = savedPosts.includes(postId);

    const handleSaveToggle = async () => {
        await toggleSavedPost(postId); // Toggle save state
        console.log('Updated saved posts:', savedPosts); // Verify the saved state after toggling
    };
      
    const handleStartConversation = () => {
        if (post && post.user) {
            const userFullName = `${post.user.first_name} ${post.user.last_name}`;
            const otherUserId = post.user.id;
            navigate(`/chats/new-message/${userFullName}/${otherUserId}`);
        }
    };

    useEffect(() => {
        // When savedPosts changes, this will update the UI to reflect the new state
        console.log('Saved posts updated:', savedPosts);
    }, [savedPosts]); // Make sure to listen for changes in savedPosts

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className='single-post-page'>
            <div className="post-details">
                <div className="image-container">
                    {post?.image && <img className="post-image" src={post.image} alt="Post" />}
                    <div className="save-icon" onClick={handleSaveToggle}>
                        <span className="tooltip">{isPostSaved ? 'Unsave Post' : 'Save Post'}</span>
                        {isPostSaved ? <FaStar className="saved-icon" /> : <FaRegStar className="unsaved-icon" />}
                    </div>
                </div>
                <h2 className="post-title">{post?.title}</h2>
                <p className="post-description">{post?.description}</p>
            </div>

            <div className="post-info">
                {post?.user && (
                    <Link to={`/public-profile-page/${post.user.id}`} className="user-div">
                        <img className="user-image" src={post.user.profile_picture} alt="User" />
                        <div>{post.user.first_name} {post.user.last_name}</div>
                    </Link>
                )}
                <div className="message-button-div">
                    <button className="message-user-button" onClick={handleStartConversation}>
                        Message User
                    </button>
                </div>
                <p className="post-address">
                    <FaMapMarkerAlt /> {post?.address}
                </p>
                <div className="post-map-container">
                    <ReactMapGL
                        {...viewport}
                        mapboxAccessToken={mapboxToken}
                        onMove={(evt) => setViewport(evt.viewState)}
                        mapStyle="mapbox://styles/mapbox/streets-v11"
                        dragPan={false}
                        scrollZoom={false}
                        doubleClickZoom={false}
                        touchZoomRotate={false}
                    >
                        <Marker latitude={viewport.latitude} longitude={viewport.longitude}>
                            <FaMapMarkerAlt size={40} color="#795f4b" />
                        </Marker>
                        <NavigationControl position="top-right" />
                    </ReactMapGL>
                </div>
            </div>
        </div>
    );
};

export default SinglePostPage;
