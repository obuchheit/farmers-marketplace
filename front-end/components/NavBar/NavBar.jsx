import { Link, NavLink } from "react-router-dom";
import { Container, Nav, Navbar, NavDropdown, Button } from "react-bootstrap"
import { signOut, getProfilePicture } from "../../utilities";
import './NavBar.css';
import { useEffect, useState } from "react";
import axios from "axios";


const NavBar = ({ user, setUser }) => {
    const [profileImage, setProfileImage] = useState(null);

    const logOut = async() => {
        setUser(await signOut(user))
    }

    useEffect (() => {
        const getImage = async() => {
            setProfileImage(await getProfilePicture())
        }
        getImage()
    },[])


  return (
    <Navbar expand="lg" fixed="top" className="custom-navbar px-5">
            <Navbar.Brand as={Link} to="/">Farmers Marketplace</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                {/* Left-side Nav Links */}
                <Nav className="nav-links me-auto">
                    <Nav.Link as={Link} to="/user-post-portal">Your Posts</Nav.Link>
                    <Nav.Link as={Link} to="/garden">Gardening Tips</Nav.Link>
                </Nav>

                {/* Right-side Nav Links */}
                <Nav className="nav-right">
                    {user ? (
                        <>
                            <Button variant="outline-danger" className="sign-out" onClick={logOut}>Sign Out</Button>
                            <Link to="/profile"><img id="profile-picture" src={profileImage}/></Link>
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
