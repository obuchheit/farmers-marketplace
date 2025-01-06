import { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useOutletContext } from 'react-router-dom';
import { userRegistration } from "../../utilities";
import './RegistrationPage.css'


const RegistrationPage = () => {
  const { setUser } = useOutletContext();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    address: '',
  });

  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [isReady, setIsReady] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isReady) {
        alert("You must check the box before submitting.");
        return;
    }

    const result = await userRegistration(formData);

    if (result && result.success) {
        setMessage("Registration successful!");
        setErrors({});
        setUser(result.user); // Set user after successful registration
    } else if (result && result.errors) {
        setErrors(result.errors); // Display specific validation errors
        setMessage('');
    } else {
        setMessage("An unexpected error occurred.");
        setErrors({});
    }
};


  return (
    <>
    <div className="title">
      <h1>Welcome to Farmers Marketplace</h1>
    </div>
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
      <div className='form-div'>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            placeholder='youremail@email.com'
            value={formData.email}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-1" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            placeholder='Password'
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
            placeholder='First'
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
            placeholder='Last'
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
            placeholder='City, State'
            value={formData.address}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check 
          value={isReady}
          onChange={(e) => setIsReady(e.target.checked)}
          type="checkbox" 
          label="All the info is correct" />
        </Form.Group>

        <Button variant="primary" type="submit" className='button'>
          Sign Up
        </Button>
      </Form>

      </div>
    </div>
    </>
  );
};

export default RegistrationPage;
