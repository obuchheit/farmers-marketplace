import { Link } from "react-router-dom";
import { Container, Nav, Navbar, NavDropdown, Button } from "react-bootstrap"
import { signOut } from "../../utilities";
import './NavBar.css';





const NavBar = ({ user, setUser }) => {
    const logOut = async() => {
        setUser(await signOut(user))
    }
  return (
    <Navbar expand="lg" fixed="top" className="custom-navbar px-5">
            <Navbar.Brand as={Link} to="/">Farmers Marketplace</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                {/* Left-side Nav Links */}
                <Nav className="nav-links me-auto">
                    <Nav.Link as={Link} to="/user-post-portal">Your Posts</Nav.Link>
                    <NavDropdown title="Find" id="basic-nav-dropdown">
                        <NavDropdown.Item href="#action/3.1">Trade Groups</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.2">Another Action</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item as={Link} to="/garden">Gardening Tips</NavDropdown.Item>
                    </NavDropdown>
                </Nav>

                {/* Right-side Nav Links */}
                <Nav className="nav-right">
                    {user ? (
                        <>
                            <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
                            <Button variant="outline-danger" onClick={logOut}>Sign Out</Button>
                        </>
                    ) : (
                        <Nav.Link as={Link} to="/signin">Sign In/Sign Up</Nav.Link>
                    )}
                </Nav>
            </Navbar.Collapse>
        </Navbar>

  )
}

export default NavBar
