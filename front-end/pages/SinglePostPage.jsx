import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const SinglePostPage = () => {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:8000/api/v1/posts/${postId}/`, {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
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

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h1>{post.title}</h1>
            <img src={post.image} alt="" />
            <p>{post.description}</p>
            <p><strong>Location:</strong> {post.address}</p>
            <p><strong>Posted At:</strong> {Date(post.time_posted).toLocaleString()}</p>
            <p><strong>Available:</strong> {post.is_available ? 'Yes' : 'No'}</p>
        </div>
    );
};

export default SinglePostPage;
