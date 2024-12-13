import { createBrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import RegistrationPage from "../pages/RegistrationPage.jsx";
import LogInPage from "../pages/LogInPage.jsx";
import HomePage from "../pages/HomePage.jsx";
import { getInfo } from "../utilities.jsx";


const router = ([
    {
        path: "/",
        element: <App/>, 
        loader: getInfo,
        children: [
            {
                index: true,
                element: <HomePage />
            },
            {
                path: '/register',
                element: <RegistrationPage />
            },
            {
                path: '/signin',
                element: <LogInPage />
            },
        ]
    }
])

export default router