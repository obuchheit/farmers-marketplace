import { Link } from "react-router-dom";
import { Container, Nav, Navbar, NavDropdown, Button } from "react-bootstrap"
import { signOut } from "../utilities";




const NavBar = ({ user, setUser }) => {
    const signOut = async() => {
        setUser(await signOut(user))
    }
  return (
    <>
        <ul style={{display:"flex", justifyContent:'space-around'}}>
            <li><Link to='/'>Home</Link></li>
            {user ? (
                <>
                    <Button onClick={signOut}>Sign Out</Button>
                </>
            ) : (
                <li><Link to='/signin'>Sign In/Sign Up</Link></li>
            )}
        </ul>
    </>
  )
}

export default NavBar
