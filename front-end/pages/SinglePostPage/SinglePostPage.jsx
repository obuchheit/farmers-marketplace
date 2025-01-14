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
    const { savedPosts, toggleSavedPost } = useOutletContext(); 
    const [post, setPost] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSaved, setIsSaved] = useState(false);
    const { token: mapboxToken, fetchToken, loading: loadingToken, error: errorToken } = useMapboxToken();
    const [viewport, setViewport] = useState({
        latitude: 41.888424,
        longitude: -87.78796,
        zoom: 12,
        width: '100%',
        height: '100%',
    });
    const navigate = useNavigate();

    useEffect(() => {
        const getMapToken = async() => {
            await fetchToken()
        }
        getMapToken()
    }, [])
    // Extract saved post IDs for quick lookup
    useEffect(() => {
        const fetchPost = async () => {
            try {
                console.log("Fetching post...");
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:8000/api/v1/posts/${postId}/`, {
                    headers: { Authorization: `Token ${token}` },
                });
                console.log("Post fetched:", response.data);


                const { location } = response.data;
                const [lng, lat] = location.replace('SRID=4326;POINT (', '').replace(')', '').split(' ');

                setViewport((prev) => ({
                    ...prev,
                    latitude: parseFloat(lat),
                    longitude: parseFloat(lng),
                }));
                setPost(response.data);

                // Check if the post is saved
                const isPostSaved = savedPosts.some((savedPost) => savedPost.post_details.id === Number(postId));
                console.log("Is post saved:", isPostSaved);
                setIsSaved(isPostSaved);
            } catch (err) {
                console.error("Error fetching post:", err);

                setError(err.response?.data || 'An error occurred while fetching the post.');
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [postId, savedPosts]);

    // Toggle saved state
    const handleSaveToggle = async () => {
        await toggleSavedPost(postId);
        setIsSaved((prev) => !prev); // Update local state
    };

    const handleStartConversation = () => {
        if (post && post.user) {
            const userFullName = `${post.user.first_name} ${post.user.last_name}`;
            const otherUserId = post.user.id;
            navigate(`/chats/new-message/${userFullName}/${otherUserId}`);
        }
    };


    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className='single-post-page'>
            <div className="post-details">
                <div className="image-container">
                    {post?.image && <img className="post-image" src={post.image} alt="Post" />}
                    <div className="save-icon" onClick={handleSaveToggle}>
                        <span className="tooltip">{isSaved ? 'Unsave Post' : 'Save Post'}</span>
                        {isSaved ? <FaStar className="saved-icon" /> : <FaRegStar className="unsaved-icon" />}
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
