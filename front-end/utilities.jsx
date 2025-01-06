import axios from "axios";
import { useState } from "react";

export const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api/v1/"
});

export const userRegistration = async (formData) => {
    try {
        let response = await api.post('users/auth/signup/', formData);
        if (response.status === 201) {
            let { token, user } = response.data;
            // Store the token and set default headers for future requests
            localStorage.setItem("token", token);
            api.defaults.headers.common["Authorization"] = `Token ${token}`;
            
            // Automatically log the user in after signup
            await userLogIn(formData);  // Log the user in right after signup

            return { success: true, user };  // Return success and user object
        }
    } catch (error) {
        if (error.response && error.response.data) {
            return { success: false, errors: error.response.data }; // Return validation errors
        } else {
            alert("An unexpected error occurred.");
            console.error(error);
            return { success: false, errors: { general: "An unexpected error occurred." } };
        }
    }
};



export const userLogIn = async (formData) => {
    try {
        let response = await api.post("users/auth/signin/", formData);
        if (response.status === 201) {  // Check for correct status code
            let { token, user } = response.data;
            // Store token in localStorage and set default authorization header
            localStorage.setItem("token", token);
            api.defaults.headers.common['Authorization'] = `Token ${token}`;
            return user;
        }
        alert("Invalid credentials");
        return null;
    } catch (error) {
        alert("Error during login");
        console.error(error);
        return null;
    }
};



export const signOut = async () => {
    try {
        let response = await api.post("users/auth/signout/");
        if (response.status === 204) {  // Check for successful signout
            localStorage.removeItem("token");
            delete api.defaults.headers.common['Authorization'];
            return null;
        }
        alert("Failure to log out.");
        return null;
    } catch (error) {
        alert("Error during logout");
        console.error(error);
        return null;
    }
};


// Might need to edit
export const getInfo = async() => {
    let token = localStorage.getItem('token')
    if (token){
        api.defaults.headers.common['Authorization'] = `Token ${token}`
        let response = await api.get("users/profile/")
        if (response.status === 200) {
            return response.data.email
        }
        return null
    }
    else {
        return null
    }
}


//Get profile picture for NavBar
export const getProfilePicture = async() => {
    let token = localStorage.getItem('token')
    if (token){
        api.defaults.headers.common['Authorization'] = `Token ${token}`
        let response = await api.get("users/profile/update/")
        if (response.status === 200) {
            return response.data.profile_picture
        }
        return null
    }
    else {
        return null
    }

}

// Saved Post Logic

// Fetch the user's saved posts
export const fetchSavedPosts = async () => {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            api.defaults.headers.common['Authorization'] = `Token ${token}`;
            const response = await api.get("posts/user-saved-posts/", {
                headers: {
                    Authorization: `Token ${token}`,
                }
            });
            if (response.status === 200) {
                console.log(response.data)
                return response.data; // Assume this is an array of saved post IDs
            }
        } catch (error) {
            console.error("Error fetching saved posts:", error);
        }
    }
    return [];
};

// Add a post to saved posts
export const addSavedPost = async (postId) => {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            api.defaults.headers.common['Authorization'] = `Token ${token}`;
            const response = await api.post(`posts/user-saved-posts/${postId}/`);
            if (response.status === 201) {
                return true; // Successfully saved
            }
        } catch (error) {
            console.error("Error saving post:", error);
        }
    }
    return false;
};

// Remove a post from saved posts
export const removeSavedPost = async (postId) => {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            api.defaults.headers.common['Authorization'] = `Token ${token}`;
            const response = await api.delete(`posts/user-saved-posts/${postId}/`);
            if (response.status === 204) {
                return true; // Successfully removed
            }
        } catch (error) {
            console.error("Error removing saved post:", error);
        }
    }
    return false;
};


//MapBox Token Retrieval

export const useMapboxToken = () => {
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
  
    const fetchToken = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://127.0.0.1:8000/mapbox-token/", {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        });
        setToken(response.data.accessToken);
      } catch (err) {
        console.error("Failed to fetch Mapbox token:", err);
        setError("Failed to fetch Mapbox token.");
      } finally {
        setLoading(false);
      }
    };
  
    return { token, fetchToken, loading, error };
  };
  