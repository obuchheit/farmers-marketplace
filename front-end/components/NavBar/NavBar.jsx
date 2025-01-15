import { Link, NavLink } from "react-router-dom";
import { Dropdown, Nav, Navbar, NavDropdown, Button } from "react-bootstrap";
import { signOut, getProfilePicture } from "../../utilities";
import './NavBar.css';
import { useEffect, useState } from "react";
import axios from "axios";

const NavBar = ({ user, setUser }) => {
    const [profileImage, setProfileImage] = useState(null);

    const logOut = async () => {
        setUser(await signOut(user));
    };

    useEffect(() => {
        const getImage = async () => {
            setProfileImage(await getProfilePicture());
        };
        getImage();
    }, []);

    return (
        <Navbar expand="lg" fixed="top" className="px-5" id="custom-navbar">
            <Navbar.Brand as={Link} to="/">Farmers Marketplace</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                {/* Left-side Nav Links */}
                <Nav className="nav-links me-auto">
                    <Nav.Link as={Link} to="/user-post-portal">Your Posts</Nav.Link>
                    <Nav.Link as={Link} to="/saved-posts">Saved Posts</Nav.Link>
                    <Nav.Link as={Link} to="/garden">Gardening Tips</Nav.Link>
                    <Nav.Link as={Link} to="/search-farms">Search Farms</Nav.Link> {/* Added link to Search Farms */}
                    <Nav.Link as={Link} to="/chats">Chats</Nav.Link>
                    <NavDropdown title="Groups" id="basic-nav-dropdown">
                        <NavDropdown.Item as={Link} to="/find-groups">Find Groups</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/users-groups">
                            Your Groups
                        </NavDropdown.Item>
                    </NavDropdown>
                </Nav>

                {/* Right-side Nav Links */}
                <Nav className="nav-right">
                    {user ? (
                        <>
                            <Dropdown align="end">
                                <Dropdown.Toggle 
                                    id="profile-dropdown" 
                                    className="profile-dropdown-toggle" 
                                    variant="link" 
                                    aria-haspopup="true"
                                >
                                    <img 
                                        id="profile-picture" 
                                        src={profileImage} 
                                        alt="Profile" 
                                    />
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item as={Link} to="/profile">View Profile</Dropdown.Item>
                                    {/* <Dropdown.Item as={Link} to="/settings">Settings</Dropdown.Item> */}
                                    <Dropdown.Item onClick={logOut}>Sign Out</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </>
                    ) : (
                        <Nav.Link as={Link} to="/signin">Sign In/Sign Up</Nav.Link>
                    )}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default NavBar;
