import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FaRegStar, FaStar, FaMapMarkerAlt } from 'react-icons/fa'
import ReactMapGL, { Marker } from "react-map-gl";
import { useMapboxToken } from "../../utilities";
import { NavigationControl } from 'react-map-gl';
import { IoLocationOutline } from "react-icons/io5";

import { useNavigate } from 'react-router-dom';
import './SinglePostPage.css';


const SinglePostPage = () => {
    const { postId } = useParams();
    const { savedPosts, toggleSavedPost } = useOutletContext(); // Access savedPosts and toggleSavedPost
    const [post, setPost] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [viewport, setViewport] = useState({
        latitude: 41.888424,
        longitude: -87.78796,
        zoom: 12,
        width: '100%',
        height: '100%',
    });
    const navigate = useNavigate();

    const { token: mapboxToken, fetchToken, loading: loadingToken, error: errorToken } = useMapboxToken();


    // Determine if the post is saved on load
    const isInitiallySaved = savedPosts.includes(postId);
    const [isSaved, setIsSaved] = useState(isInitiallySaved);

    const handleSaveToggle = async () => {
        await toggleSavedPost(postId); // Call toggleSavedPost from App.jsx
        setIsSaved(!isSaved); // Toggle the local state
    };

    const handleStartConversation = async () => {
        console.log()
        navigate(`/chats/new-message/${post.user.id}`)
    }

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:8000/api/v1/posts/${postId}/`, {
                    headers: { Authorization: `Token ${token}` },
                });
                const { location } = response.data;
                await fetchToken()
                
                const [lng, lat] = location.replace('SRID=4326;POINT (', '').replace(')', '').split(' ');
                setViewport({
                    ...viewport,
                    latitude: parseFloat(lat),
                    longitude: parseFloat(lng),
                });                
                console.log(response.data)
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
        <div className='single-post-page'>
            <div className="post-details">
                <img className="post-image" src={post.image} alt="Post" />
                <h2 className="post-title">{post.title}</h2>
                <p className="post-description">{post.description}</p>
            </div>

            <div className="post-info">
                <Link to={`/public-profile-page/${post.user.id}`} className="user-div">
                    <img className="user-image" src={post.user.profile_picture} alt="User" />
                    <div>{post.user.first_name} {post.user.last_name}</div>
                </Link>
                <div className='message-button-div'>
                <button className="message-user-button" onClick={()=> handleStartConversation(post.user.id)}>
                     Message User
                </button>
                </div>
                <p className="post-address"><IoLocationOutline /> {post.address}</p>
                <div className="map-container">
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
                        <NavigationControl position="top-right" />
                    </Marker>
                </ReactMapGL>

                </div>
            </div>
                {/* Save Post section */}
                {/* <div className="save-post-container" onClick={handleSaveToggle}>
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
                </div> */}

        </div>
    );
};

export default SinglePostPage;
