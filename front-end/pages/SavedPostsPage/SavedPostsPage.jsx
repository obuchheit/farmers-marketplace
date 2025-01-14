import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { fetchSavedPosts, addSavedPost, removeSavedPost } from '../../utilities.jsx'
import HomePageCard from "../../components/HomePageCard/HomePageCard";
import './SavedPostsPage.css'



const SavedPostsPage = () => {
    const [savedPosts, setSavedPosts] = useState([]); // State for saved posts
    const navigate = useNavigate();


    useEffect(() => {
        const loadSavedPosts = async () => {
            const posts = await fetchSavedPosts();
            setSavedPosts(posts);
            console.log(posts)
        };
        
        loadSavedPosts();
      }, []);

      const handlePostClick = (postId) => {
        navigate(`/post/${postId}`);
    };
  
    
  return (
    <div className="saved-posts-page">
        <h1>Your Saved Posts</h1>
        <div className="card-container">
        {savedPosts && Array.isArray(savedPosts) && savedPosts.length > 0 ? (
            savedPosts.map(post => (
                <div className="main-card" key={post.post_details.id} onClick={() => handlePostClick(post.post_details.id)}>
                    <img className="card-image" src={post.post_details.image} alt={post.post_details.title} />
                    <h2>{post.post_details.title}</h2>
                    <p>{post.post_details.address}</p>
                    {/* <p className="distance"><strong>Distance:</strong> {post.distance} km</p> */}
                </div>
            ))
        ) : (
            <p>No posts available.</p>
        )}
      </div>
      
    </div>
  )
}

export default SavedPostsPage
