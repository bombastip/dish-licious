import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { NextUIProvider } from '@nextui-org/react';
import { AuthContextProvider } from './context/provider';
import { mainTheme } from './themes';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <AuthContextProvider>
            <NextUIProvider theme={mainTheme}>
                <App />
            </NextUIProvider>
        </AuthContextProvider>
    </React.StrictMode>,
);
