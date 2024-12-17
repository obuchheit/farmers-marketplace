import { Link } from "react-router-dom";
import { Container, Nav, Navbar, NavDropdown, Button } from "react-bootstrap"
import { signOut } from "../utilities";




const NavBar = ({ user, setUser }) => {
    const logOut = async() => {
        setUser(await signOut(user))
    }
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand as={Link} to='/'>Farmers Marketplace</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to='/user-post-portal'>Your Posts</Nav.Link>
            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown>
            {user ? (
                <>
                    <li><Link to='/profile'>Profile</Link></li>
                    <Button onClick={logOut}>Sign Out</Button>
                </>
            ) : (
                <li><Link to='/signin'>Sign In/Sign Up</Link></li>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>

  )
}

export default NavBar
