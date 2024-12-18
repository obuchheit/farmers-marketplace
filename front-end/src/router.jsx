import { createBrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import RegistrationPage from "../pages/RegistrationPage.jsx";
import LogInPage from "../pages/LogInPage.jsx";
import HomePage from "../pages/HomePage/HomePage.jsx";
import ProfilePage from "../pages/ProfilePage/ProfilePage.jsx";
import GardenPage from "../pages/GardenPage/GardenPage.jsx";
import CropDetailPage from "../pages/CropDetailPage.jsx";
import Error404Page from "../pages/Error404Page.jsx";
import SavedPostPage from "../pages/SavedPostPage.jsx";
import UserPostPortalPage from "../pages/UserPostPortalPage.jsx";
import SinglePostPage from "../pages/SinglePostPage/SinglePostPage.jsx";
import { getInfo } from "../utilities.jsx";


const router = createBrowserRouter([
    {
        path: "/",
        element: <App />, 
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
            {
                path: '/profile',
                element: <ProfilePage />
            },
            {
                path: '/garden',
                element: <GardenPage />
            },
            {
                path: '/garden/:cropId',
                element: <CropDetailPage />
            },
            {
                path: '/saved-posts',
                element: <SavedPostPage />
            },
            {
                path: '/user-post-portal',
                element: <UserPostPortalPage />
            },
            {
                path: '/post/:postId',
                element: <SinglePostPage />
            }
        ],
        errorElement: <Error404Page />
    }
])

export default router;