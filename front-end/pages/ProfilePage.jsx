import axios from "axios";
import { useState, useEffect } from "react";

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


  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div>
      <h1>Profile Page</h1>

      {/* Display Profile Picture */}
      {formData.profile_picture ? (
        <img
          src={formData.profile_picture}
          alt="Profile"
          style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover', marginBottom: '1rem' }}
        />
      ) : (
        <p>No profile picture available.</p>
      )}

      {/* Upload Profile Picture */}
      <div style={{ marginBottom: '1rem' }}>
        <label>Change Profile Picture:</label>
        <input type="file" onChange={handleProfilePictureUpload} />
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <form>
          {/* Editable fields */}
          {['first_name', 'last_name', 'address', 'bio'].map((field) => (
            <div key={field} style={{ marginBottom: '1rem' }}>
              <label>
                <strong>{field.replace('_', ' ').toUpperCase()}:</strong>
              </label>
              {editingField === field ? (
                <input
                  type="text"
                  name={field}
                  value={formData[field]}
                  onChange={handleFieldChange}
                />
              ) : (
                <p>{formData[field]}</p>
              )}
              <button
                type="button"
                onClick={() =>
                  editingField === field
                    ? handleFieldSubmit(field)
                    : setEditingField(field)
                }
              >
                {editingField === field ? 'Submit' : 'Edit'}
              </button>
            </div>
          ))}

          {/* Password change */}
          <h3>Change Password</h3>
          <div style={{ marginBottom: '1rem' }}>
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
          <div style={{ marginBottom: '1rem' }}>
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
          <button type="button" onClick={handleFieldSubmit}>
            Change Password
          </button>

          {/* Delete profile */}
          <h3>Delete Profile</h3>
          <button type="button" style={{ color: 'red' }} onClick={() => handleDeleteProfile()}>
            Delete Profile
          </button>
        </form>
      )}
    </div>
  );
};

export default ProfilePage;
