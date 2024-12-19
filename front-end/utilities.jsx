import axios from "axios";

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

            return user;  // Return the user object after successful signup and login
        }
        alert(response.data);
        return null;
    } catch (error) {
        alert("Error during registration");
        console.error(error);
        return null;
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