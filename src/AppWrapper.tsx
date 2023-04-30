import { NextUIProvider } from '@nextui-org/react';
import { AuthContextProvider } from './context/provider';
import App from './App';
import useDarkMode from 'use-dark-mode';
import { darkTheme, mainTheme } from './themes/mainTheme';

const AppWrapper = () => {
    const darkMode = useDarkMode(false);
    return (
        <AuthContextProvider>
            <NextUIProvider theme={darkMode.value ? darkTheme : mainTheme}>
                <App />
            </NextUIProvider>
        </AuthContextProvider>
    );
};

export default AppWrapper;
