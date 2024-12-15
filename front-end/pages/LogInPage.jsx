import { useState } from "react";
import { Link, useOutletContext } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import Button from "react-bootstrap/Button";
import { userLogIn } from '../utilities'


const LogInPage = () => {
    const { setUser } = useOutletContext();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async(e) => {
        e.preventDefault()
        let formData = {
            'username': email,
            'password': password,
        }
        setUser(await userLogIn(formData))
    }

  return (
    <Form>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email" 
        placeholder="Enter email" 
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
        value={password}
        onChange={(e) => setPassword(e.target.value)} 
        type="password" 
        placeholder="Password" 
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        Submit
      </Button>

      <Button as={Link} to='/register' variant="secondary">
        Sign up
      </Button>
    </Form>
  )
}

export default LogInPage
