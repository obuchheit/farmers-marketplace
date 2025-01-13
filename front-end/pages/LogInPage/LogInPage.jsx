import { useState } from "react";
import { Link, useOutletContext } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import Button from "react-bootstrap/Button";
import { userLogIn } from '../../utilities'
import './LogInPage.css'


const LogInPage = () => {
    const { setUser } = useOutletContext();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async(e) => {
        e.preventDefault()
        let formData = {
            'email': email,
            'password': password,
        }
        setUser(await userLogIn(formData))
    }

  return (
    <>
    <div className="auth-header">
        <h1>Welcome to Farmers Marketplace</h1>
    </div>
    <div className="page">
      <div className="container">
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Control 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email" 
            placeholder="Enter email" 
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Control
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
            type="password" 
            placeholder="Password" 
            />
          </Form.Group>
          <div className="buttons-container">
            <Button type="submit" className="button">
              Sign In
            </Button>
            <Link to='/register' className="signup-link">Sign Up</Link>
          </div>
        </Form>
      </div>
    </div>
    </>
  )
}

export default LogInPage
