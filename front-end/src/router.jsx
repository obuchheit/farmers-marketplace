import { createBrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import RegistrationPage from "../pages/RegistrationPage.jsx";
import LogInPage from "../pages/LogInPage.jsx";
import { getInfo } from "../utilities.jsx";


const router = ([
    {
        path: "/",
        element: <App/>, 
        loader: getInfo,
        children: [
            {
                index: true,
                element: <LogInPage />
            },
            {
                path: '/register',
                element: <RegistrationPage />
            },
        ]
    }
])

export default router