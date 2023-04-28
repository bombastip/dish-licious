import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ErrorPage from './pages/ErrorPage';
import Dashboard from './pages/Dashboard';
import Auth from './components/Auth';
import { signOutLoader } from './route/loader';
const router = createBrowserRouter([
    {
        path: '/',
        element: <Dashboard />,
        errorElement: <ErrorPage />,
        // loader: authLoader,
    },
    {
        path: '/authentication',
        element: <Auth />,
        // loader: signOutLoader,
    },
    {
        path: '/profile',
        //element: <Profile />,
        loader: signOutLoader,
    },
]);

const App = () => <RouterProvider router={router} />;

export default App;
