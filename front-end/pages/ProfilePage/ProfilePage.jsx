import axios from "axios";
import { useState, useEffect } from "react";
import { FaPencilAlt } from 'react-icons/fa'; 
import "./ProfilePage.css"

const ProfilePage = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    address: '',
    bio: '',
    profile_picture: null, // Profile picture URL or file
  });

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [editingField, setEditingField] = useState(null); // Track which field is being edited
  const [passwordData, setPasswordData] = useState({ current_password: '', new_password: '' }); // For password change

  const baseUrl = 'http://localhost:8000/api/v1/users/profile/update/';
  const token = localStorage.getItem('token');

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(baseUrl, {
        headers: { Authorization: `Token ${token}` },
      });
      console.log(response.data)
      setFormData(response.data); // Populate formData with user profile data
    } catch (err) {
      setError(err.response ? err.response.data : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFieldSubmit = async (field) => {
    try {
      const response = await axios.put(
        baseUrl,
        { [field]: formData[field] }, // Only send the edited field
        { headers: { Authorization: `Token ${token}` } }
      );
      setEditingField(null); // Exit edit mode
      alert('Profile updated successfully!');
    } catch (err) {
      setError(err.response ? err.response.data : 'An error occurred');
    }
  };

  const handleProfilePictureUpload = async (e) => {
    const file = e.target.files[0];
    const formDataUpload = new FormData();
    formDataUpload.append("profile_picture", file);

    try {
      const response = await axios.put(baseUrl, formDataUpload, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setFormData((prev) => ({ ...prev, profile_picture: response.data.profile_picture }));
      alert('Profile picture updated successfully!');
    } catch (err) {
      setError(err.response ? err.response.data : 'An error occurred');
    }
  };

  const handleDeleteProfile = async () => {
    try {
      const response = await axios.delete(baseUrl, {
        headers: {
          Authorization: `Token ${token}`, 
        },
      });
      
      alert(response.data.message); // Notify the user of successful deletion.
      localStorage.removeItem('token');
      
      window.location.href = '/'; // Redirect to login or homepage.
    } catch (error) {
      console.error('Error deleting profile:', error);
      alert('Failed to delete profile. Please try again.');
    }
  };


  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="profile-page">

      {/* Display Profile Picture */}
      {formData.profile_picture ? (
        <img
          src={formData.profile_picture}
          alt="Profile"
          className="profile-picture"
        />
      ) : (
        <p>No profile picture available.</p>
      )}

      {/* Upload Profile Picture */}
      <div className="upload-section">
        <label htmlFor="profile-picture-upload" className="upload-label">
          <FaPencilAlt /> 
        </label>
        <input
          type="file"
          id="profile-picture-upload"
          onChange={handleProfilePictureUpload}
          className="file-input"
        />
      </div>

      {error && <p className="error">{error}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <form>
          {/* Editable fields */}
          {['first_name', 'last_name', 'address', 'bio'].map((field) => (
            <div key={field} className="form-group">
              <label>
                <strong>{field.replace('_', ' ').toUpperCase()}: </strong>
              </label>
              {editingField === field ? (
                <input
                  type="text"
                  name={field}
                  value={formData[field]}
                  onChange={handleFieldChange}
                />
              ) : (
                <p className="value-field">{formData[field]}</p>
              )}
              <button
                type="button"
                className="edit-button"
                onClick={() =>
                  editingField === field
                    ? handleFieldSubmit(field)
                    : setEditingField(field)
                }
              >
                {editingField === field ? 'Submit' : <FaPencilAlt />}
              </button>
            </div>
          ))}

          {/* Password change */}
          <h3>Change Password</h3>
          <div className="form-group">
            <label>Current Password:</label>
            <input
              type="password"
              name="current_password"
              value={passwordData.current_password}
              onChange={(e) =>
                setPasswordData((prev) => ({
                  ...prev,
                  current_password: e.target.value,
                }))
              }
            />
          </div>
          <div className="form-group">
            <label>New Password:</label>
            <input
              type="password"
              name="new_password"
              value={passwordData.new_password}
              onChange={(e) =>
                setPasswordData((prev) => ({
                  ...prev,
                  new_password: e.target.value,
                }))
              }
            />
          </div>
          <button type="button" className="submit-button" onClick={handleFieldSubmit}>
            Change Password
          </button>

          {/* Delete profile */}
          <h3>Delete Profile</h3>
          <button
            type="button"
            className="delete-button"
            onClick={() => handleDeleteProfile()}
          >
            Delete Profile
          </button>
        </form>
      )}
    </div>
  );
};

export default ProfilePage;
