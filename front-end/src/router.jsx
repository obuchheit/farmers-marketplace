import { createBrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import RegistrationPage from "../pages/RegistrationPage/RegistrationPage.jsx";
import LogInPage from "../pages/LogInPage/LogInPage.jsx";
import HomePage from "../pages/HomePage/HomePage.jsx";
import ProfilePage from "../pages/ProfilePage/ProfilePage.jsx";
import GardenPage from "../pages/GardenPage/GardenPage.jsx";
import CropDetailPage from "../pages/CropDetailPage/CropDetailPage.jsx";
import NotFoundPage from "../pages/NotFoundPage.jsx";
import UserPostPortalPage from "../pages/UserPostPortal/UserPostPortalPage.jsx";
import SinglePostPage from "../pages/SinglePostPage/SinglePostPage.jsx";
import PublicProfilePage from "../pages/PublicProfilePage/PublicProfilePage.jsx";
import SavedPostsPage from "../pages/SavedPostsPage/SavedPostsPage.jsx";
import FindGroupPage from "../pages/GroupPages/FindGroupPage/FindGroupPage.jsx";
import GroupPublicPage from "../pages/GroupPages/GroupPublicPage/GroupPublicPage.jsx";
import UserGroupsPage from "../pages/GroupPages/UserGroupsPage/UserGroupsPage.jsx";
import GroupMemberPage from "../pages/GroupPages/GroupMemberPage/GroupMemberPage.jsx";
import AdminPortalPage from "../pages/GroupPages/adminPortalPage/AdminPortalPage.jsx";
import ErrorPage from "../pages/ErrorPage.jsx";
import ChatsPage from "../pages/ChatsPage/ChatsPage.jsx";
import SingleConvoPage from "../pages/SingleConvoPage/SingleConvoPage.jsx";
import SearchFarmsPage from "../pages/SearchFarmsPage/SearchFarmsPage.jsx";
import { getInfo } from "../utilities.jsx";
import NewMessagePage from "../pages/NewMessagePage.jsx/NewMessagePage.jsx";



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
                path: '/user-post-portal',
                element: <UserPostPortalPage />
            },
            {
                path: '/post/:postId',
                element: <SinglePostPage />
            },
            {
                path: '/public-profile-page/:userId',
                element: < PublicProfilePage />
            },
            {
                path: '/saved-posts',
                element: <SavedPostsPage />
            },
            {
                path: '/find-groups',
                element: <FindGroupPage/>
            },
            {
                path: '/group-public-view/:pk',
                element: <GroupPublicPage />
            },
            {
                path: '/users-groups',
                element: < UserGroupsPage />
            },
            {
                path: '/group-member-page/:pk',
                element: <GroupMemberPage />
            },
            {
                path: '/groups/:pk/admin-portal',
                element: <AdminPortalPage />
            },
            {
                path: '/chats',
                element: <ChatsPage />
            },
            {
                path: '/chats/:conversationId',
                element: <SingleConvoPage />
            },
            {
                path: '/chats/new-message/:userFullName/:otherUserId',
                element: <NewMessagePage />
            },
            {
                path: '/search-farms',
                element: <SearchFarmsPage />
            },
            {
                path: '*',
                element: <NotFoundPage />
            },
        ],
        errorElement: <ErrorPage />
    }
])

export default router;