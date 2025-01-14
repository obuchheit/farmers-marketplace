import { Outlet, useLoaderData, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import NavBar from "../components/NavBar/NavBar";
import { getInfo, fetchSavedPosts, addSavedPost, removeSavedPost } from "../utilities";
import axios from "axios";
import './styles/global.css'


function App() {
  const [user, setUser] = useState(useLoaderData());
  const [savedPosts, setSavedPosts] = useState([]); // State for saved posts
  const navigate = useNavigate();
  const location = useLocation();
  const nullUserPages = ['/signin', '/register'];
  
  useEffect(() => {
    const loadSavedPosts = async () => {
      if (user) {
        const posts = await fetchSavedPosts();
        setSavedPosts(posts);
      }
    };

    loadSavedPosts();
  }, []);


  // Function to add or remove a saved post
  const toggleSavedPost = async (postId) => {
    try {
        const token = localStorage.getItem('token');
        const isAlreadySaved = savedPosts.includes(postId);
        
        // Determine the API endpoint and method
        const method = isAlreadySaved ? 'DELETE' : 'POST';
        const url = `http://localhost:8000/api/v1/posts/user-saved-posts/${postId}/`;

        // Send request to toggle the saved status
        const response = await axios({
            method,
            url,
            headers: {
                Authorization: `Token ${token}`,
            },
        });

        if (response.status === 200 || response.status === 204 || response.status === 201) {
            // Update local state only if the server confirms success
            setSavedPosts((prev) =>
                isAlreadySaved
                    ? prev.filter((id) => id !== postId) // Remove post ID
                    : [...prev, postId] // Add post ID
            );
        } else {
            alert('Failed to update saved status. Please try again.');
        }
    } catch (error) {
        console.error('Error toggling saved post:', error);
        alert('An error occurred. Please try again.');
    }
};



useEffect(() => {
  const nullUserUrls = ['/signin', '/register'];
  const isAllowed = nullUserUrls.includes(location.pathname);

  if (user && isAllowed) {
    navigate('/');
  } else if (!user && !isAllowed) {
    navigate('/signin');
  }

  // Update the body class for SignIn/SignUp
  if (nullUserUrls.includes(location.pathname)) {
    document.body.className = 'auth-page-body'; // Set a class for login/register pages
  } else {
    document.body.className = ''; // Reset the class for other pages
  }
}, [location.pathname, user, navigate]);

  return (
    <div className="window">
      {!nullUserPages.includes(location.pathname) && (
      <NavBar user={user} setUser={setUser} />
      )}      
      <div className="outlet-content">
        <Outlet context={{ user, setUser, savedPosts, toggleSavedPost }}/>
      </div>
    </div>
  )
}

export default App
