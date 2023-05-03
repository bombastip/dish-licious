import React from 'react';
import ReactDOM from 'react-dom/client';
import { NextUIProvider } from '@nextui-org/react';
import { AuthContextProvider } from './context/provider';
import { mainTheme } from './themes';
import App from './App';
import FromRegisterProvider from './context/provider/FromRegisterContextProvider';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <AuthContextProvider>
            <FromRegisterProvider>
                <NextUIProvider theme={mainTheme}>
                    <App />
                </NextUIProvider>
            </FromRegisterProvider>
        </AuthContextProvider>
    </React.StrictMode>,
);
