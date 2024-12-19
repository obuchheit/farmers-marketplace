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
    <h1>Welcome to Farmers Marketplace</h1>
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
          <Button type="submit" className="button">
            Submit
          </Button>

          <Button as={Link} to='/register' className="button">
            Sign up
          </Button>
        </Form>
      </div>
    </div>
    </>
  )
}

export default LogInPage
