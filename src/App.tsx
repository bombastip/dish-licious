import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import { ErrorPage, Dashboard, Login, Register } from './pages';
import { Navbar } from './components';

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
                path: '/',
                element: <Dashboard />,
            },
            {
                path: 'login',
                element: <Login />,
            },
            {
                path: 'register',
                element: <Register />,
            },
            {
                path: 'profile',
                //element: <Profile />,
            },
        ],
    },
]);

const App = () => <RouterProvider router={router} />;

export default App;
