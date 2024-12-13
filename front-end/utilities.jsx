import axios from "axios";

export const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api/v1/"
});

export const userRegistration = async(formData) => {
    let response = await api.post('users/auth/signup/', formData)
    if (response === 201) {
        let {token, user} = response.data 
        localStorage.setItem("token", token)
        api.defaults.headers.common["Authorization"] = `Token ${token}`
        return user
    }
    alert(response.data)
    return null
}


export const userLogIn = async(formData) => {
    let response = await api.post("users/auth/signin/ ", formData)
    if (response.status === 200) {
        let {token, user} = response.data
        localStorage.setItem("token", token)
        api.defaults.headers.common['Authorization'] = `Token ${token}`
        return user
    }
    alert(response.data)
    return null
}



export const signOut = async(user) => {
    let response = await api.post("users/auth/signout/")
    if (response.status === 204){
        localStorage.removeItem("token")
        delete api.defaults.headers.common['Authorization']
        return null
    }
    alert("Failure to log out.")
}


// Might need to edit
export const getInfo = async() => {
    let token = localStorage.getItem('token')
    if (token){
        api.defaults.headers.common['Authorization'] = `Token ${token}`
        let response = await api.get("profile/")
        if (response.status === 200) {
            return response.data.email
        }
        return null
    }
    else {
        return null
    }
}