import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import {
    ErrorPage,
    Dashboard,
    Login,
    Register,
    Settings,
    AddPostPage,
    Profile,
    ProfileQueryParam,
    Followers,
    FollowersQueryParam,
    Following,
    FollowingQueryParam,
    SearchRecipe,
    SearchPeople,
    Recipe,
    FavoriteRecipes,
    SearchGroups,
} from './pages';
import { GroupSettings } from './pages/Groups';
import { PrivateRoute } from './route';
import { Groups, Group, CreateGroup, EditGroup } from './pages/Groups';

const router = createBrowserRouter([
    {
        errorElement: <ErrorPage />,
        children: [
            {
                path: 'login',
                element: <Login />,
            },
            {
                path: 'register',
                element: <Register />,
            },
            {
                element: <PrivateRoute />,
                children: [
                    {
                        path: '/',
                        element: <Dashboard />,
                    },
                    {
                        path: 'profile',
                        element: <Profile />,
                    },
                    {
                        path: 'user-profile',
                        element: <ProfileQueryParam />,
                    },
                    {
                        path: 'settings',
                        element: <Settings />,
                    },
                    {
                        path: 'favourites',
                        element: <FavoriteRecipes />,
                    },
                    {
                        path: 'add-post',
                        element: <AddPostPage />,
                    },
                    {
                        path: 'followers',
                        element: <Followers />,
                    },
                    {
                        path: 'user-followers',
                        element: <FollowersQueryParam />,
                    },
                    {
                        path: 'following',
                        element: <Following />,
                    },
                    {
                        path: 'user-following',
                        element: <FollowingQueryParam />,
                    },
                    {
                        path: 'search/recipes',
                        element: <SearchRecipe />,
                    },
                    {
                        path: 'search/people',
                        element: <SearchPeople />,
                    },
                    {
                        path: 'search/groups',
                        element: <SearchGroups />,
                    },
                    {
                        path: 'post',
                        element: <Recipe />,
                    },
                    {
                        path: 'groups',
                        element: <Groups />,
                    },
                    {
                        path: 'group',
                        element: <Group />,
                    },
                    {
                        path: 'group/create',
                        element: <CreateGroup />,
                    },
                    {
                        path: 'group/edit',
                        element: <EditGroup />,
                    },
                    {
                        path: 'group/settings',
                        element: <GroupSettings />,
                    },
                ],
            },
        ],
    },
]);

const App = () => <RouterProvider router={router} />;

export default App;
