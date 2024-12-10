import { Outlet, useLoaderData } from "react-router-dom";
import { useState } from "react";

function App() {
  const [user, setUser] = useState(useLoaderData());
  
  return (
    <>
      <Outlet />
    </>
  )
}

export default App
