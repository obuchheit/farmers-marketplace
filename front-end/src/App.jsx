import { Outlet, useLoaderData } from "react-router-dom";
import { useState } from "react";
import NavBar from "../components/NavBar";

function App() {
  const [user, setUser] = useState(useLoaderData());
  
  return (
    <>
      <NavBar user={user}/>
      <Outlet context={{user, setUser}}/>
    </>
  )
}

export default App
