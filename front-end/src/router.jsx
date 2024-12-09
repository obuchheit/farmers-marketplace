import { createBrowserRouter } from "react-router-dom";
import App from "./App.jsx";

const router = ([
    {
        path: "/",
        element: <App/>, 
        children: [
        ]
    }
])

export default router