import axios from "axios";
import { useState, useEffect } from "react"
import axios from "axios";


const ProfilePage = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    address: '',
    bio: '',
    profile_picture: null,
  });

  const baseUrl = 'http://localhost:8000/api/v1/users/update/'
  const token = localStorage.getItem('token');


  const fetchProfile = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(baseUrl, {
        headers: {Authorization: `Token ${token}`}
      })

    } catch (err) {
      setError(err.response ? err.response.data : 'An error occured');
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  

  return (
    <div>
      
    </div>
  )
}

export default ProfilePage
