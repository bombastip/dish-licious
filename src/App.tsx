import Auth from './components/Auth';
import { NextUIProvider } from '@nextui-org/react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ErrorPage from './pages/ErrorPage';
import { lightRetroTheme } from './assets/themes';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Auth />,
        errorElement: <ErrorPage />,
    },
]);


function App() {
    return (
        <NextUIProvider theme={lightRetroTheme}>
            <RouterProvider router={router} />
        </NextUIProvider>
    );
}

export default App;
