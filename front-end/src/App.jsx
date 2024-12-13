import { Outlet, useLoaderData, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { getInfo } from "../utilities";

function App() {
  const [user, setUser] = useState(useLoaderData());
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(()=> {
    let nullUserUrl = ['/signin', '/register']
    let isAllowed = nullUserUrl.includes(location.pathname)
    if(user && isAllowed) {
      navigate('/')
    }
    else if (!user && !isAllowed) {
      navigate('/signin')
    }
  }, [location.pathname, user, navigate])
  
  return (
    <>
      <NavBar user={user} setUser={setUser}/>
      <Outlet context={{user, setUser}}/>
    </>
  )
}

export default App
