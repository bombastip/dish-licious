import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ErrorPage, Dashboard, Login, Register, Settings, AddPostPage, Profile, Followers, Following } from './pages';
import { PrivateRoute } from './route';

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
                        path: 'settings',
                        element: <Settings />,
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
