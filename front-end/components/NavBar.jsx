import { Link } from "react-router-dom";
import { Container, Nav, Navbar, NavDropdown, Button } from "react-bootstrap"
import { signOut } from "../utilities";




const NavBar = ({ user, setUser }) => {
    const logOut = async() => {
        setUser(await signOut(user))
    }
  return (
    <>
        <ul style={{display:"flex", justifyContent:'space-around'}}>
            <li><Link to='/'>Home</Link></li>
            {user ? (
                <>
                    <Button onClick={logOut}>Sign Out</Button>
                </>
            ) : (
                <li><Link to='/signin'>Sign In/Sign Up</Link></li>
            )}
        </ul>
    </>
  )
}

export default NavBar
