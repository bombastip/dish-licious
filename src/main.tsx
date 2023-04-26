import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { NextUIProvider } from '@nextui-org/react';
import { Navbar } from './components/Navbar.tsx';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <NextUIProvider>
            <Navbar />
            <App />
        </NextUIProvider>
    </React.StrictMode>,
);
