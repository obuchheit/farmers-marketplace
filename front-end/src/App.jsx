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
      const posts = await fetchSavedPosts(); // Fetch saved posts from the API
      if (posts.length > 0) {
        setSavedPosts(posts); // Update saved posts state if posts are found
        localStorage.setItem("savedPosts", JSON.stringify(posts)); // Save to local storage
      } else {
        const storedPosts = JSON.parse(localStorage.getItem("savedPosts")) || [];
        setSavedPosts(storedPosts); // Initialize with local storage if API fails
      }
    };

    loadSavedPosts(); // Call it when the app loads or user changes

  }, [user]); // Dependency on user

  // Function to add or remove a saved post
  const toggleSavedPost = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      const isAlreadySaved = savedPosts.includes(postId);

      const method = isAlreadySaved ? 'DELETE' : 'POST';
      const url = `http://localhost:8000/api/v1/posts/user-saved-posts/${postId}/`;

      const response = await axios({
        method,
        url,
        headers: { Authorization: `Token ${token}` },
      });

      if (response.status === 200 || response.status === 204 || response.status === 201) {
        const updatedSavedPosts = isAlreadySaved
          ? savedPosts.filter((id) => id !== postId) // Remove post ID
          : [...savedPosts, postId]; // Add post ID

        setSavedPosts(updatedSavedPosts); // Update saved posts in state
        localStorage.setItem("savedPosts", JSON.stringify(updatedSavedPosts)); // Update local storage
        return true; // Indicate success
      } else {
        alert('Failed to update saved status. Please try again.');
        return false; // Indicate failure
      }
    } catch (error) {
      console.error('Error toggling saved post:', error);
      alert('An error occurred. Please try again.');
      return false; // Indicate failure
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
    <>
      {!nullUserPages.includes(location.pathname) && (
      <NavBar user={user} setUser={setUser} />
      )}      
      <Outlet context={{ user, setUser, savedPosts, toggleSavedPost }}/>
    </>
  )
}

export default App
