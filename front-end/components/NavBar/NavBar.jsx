import { Link, NavLink, useLocation } from "react-router-dom";
import { Dropdown, Nav, Navbar } from "react-bootstrap";
import { signOut, getProfilePicture } from "../../utilities";
import './NavBar.css';
import { useEffect, useState } from "react";

const NavBar = ({ user, setUser }) => {
    const [profileImage, setProfileImage] = useState(null);
    const location = useLocation();

    const logOut = async () => {
        setUser(await signOut(user));
    };

    useEffect(() => {
        const getImage = async () => {
            setProfileImage(await getProfilePicture());
        };
        getImage();
    }, []);

    const isActive = (pathKeywords) => {
        return pathKeywords.some((keyword) => location.pathname.includes(keyword));
    };

    return (
        <Navbar expand="lg" fixed="top" className="px-5" id="custom-navbar">
            <div className="navbar-container">
                <div className="left">
                    <Navbar.Brand as={Link} to="/">Farmers Marketplace</Navbar.Brand>
                </div>
                <div className="center">
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav" className="justify-content-center">
                        <Nav className="nav-links">
                            <Nav.Link 
                                as={Link} 
                                to="/user-post-portal" 
                                className={isActive(["user-post-portal"]) ? "active-link" : ""}
                            >
                                Your Posts
                            </Nav.Link>
                            
                            <Nav.Link 
                                as={Link} 
                                to="/search-farms" 
                                className={isActive(["search-farms"]) ? "active-link" : ""}
                            >
                                Search Farms
                            </Nav.Link>
                            <Nav.Link 
                                as={Link} 
                                to="/chats" 
                                className={isActive(["chats"]) ? "active-link" : ""}
                            >
                                Chats
                            </Nav.Link>
                            <Nav.Link 
                                as={Link} 
                                to="/users-groups" 
                                className={isActive(["group", "groups"]) ? "active-link" : ""}
                            >
                                Groups
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </div>
                <div className="right">
                    <Nav className="nav-right">
                        {user ? (
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
                                    <Dropdown.Item onClick={logOut}>Sign Out</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        ) : (
                            <Nav.Link as={Link} to="/signin">Sign In/Sign Up</Nav.Link>
                        )}
                    </Nav>
                </div> 
            </div>    
        </Navbar>
    );
};

export default NavBar;
