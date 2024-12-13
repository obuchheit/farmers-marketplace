import { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    address: '',
    bio: '',
  });

  const [profilePicture, setProfilePicture] = useState(null);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    Object.keys(formData).forEach((key) => form.append(key, formData[key]));
    if (profilePicture) {
      form.append('profile_picture', profilePicture);
    }

    try {
      const response = await fetch('/api/signup/', {
        method: 'POST',
        body: form,
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(data.message);
        setErrors({});
        setFormData({
          email: '',
          password: '',
          first_name: '',
          last_name: '',
          address: '',
          bio: '',
        });
        setProfilePicture(null);
      } else {
        const errorData = await response.json();
        setErrors(errorData);
        setMessage('');
      }
    } catch (error) {
      console.error('An error occurred:', error);
      setMessage('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="registration-page container mt-5">
      <h2>Sign Up</h2>
      {message && <Alert variant="success">{message}</Alert>}
      {Object.keys(errors).length > 0 && (
        <Alert variant="danger">
          <ul>
            {Object.entries(errors).map(([key, value]) => (
              <li key={key}>{key}: {value}</li>
            ))}
          </ul>
        </Alert>
      )}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="first_name">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="last_name">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="address">
          <Form.Label>Address</Form.Label>
          <Form.Control
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="bio">
          <Form.Label>Bio</Form.Label>
          <Form.Control
            as="textarea"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="profile_picture">
          <Form.Label>Profile Picture</Form.Label>
          <Form.Control
            type="file"
            onChange={handleFileChange}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Sign Up
        </Button>
      </Form>
    </div>
  );
};

export default RegistrationPage;
