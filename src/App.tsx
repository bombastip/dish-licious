import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import {
    ErrorPage,
    Dashboard,
    Login,
    Register,
    Settings,
    Profile,
    Followers,
    Following,
    SearchRecipe,
    SearchPeople,
} from './pages';
import { Navbar } from './components';
import { PrivateRoute } from './route';

const router = createBrowserRouter([
    {
        element: (
            <>
                <Navbar />
                <Outlet />
            </>
        ),
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
                        path: 'settings',
                        element: <Settings />,
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
                        path: 'followers',
                        element: <Followers />,
                    },
                    {
                        path: 'following',
                        element: <Following />,
                    },
                ],
            },
        ],
    },
]);

const App = () => <RouterProvider router={router} />;

export default App;
