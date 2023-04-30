import { NextUIProvider } from '@nextui-org/react';
import { AuthContextProvider } from './context/provider';
import App from './App';
import useDarkMode from 'use-dark-mode';
import lightTheme from './themes/lightTheme';
import darkTheme from './themes/darkTheme';

const AppWrapper = () => {
    const darkMode = useDarkMode(false);
    return (
        <AuthContextProvider>
            <NextUIProvider theme={darkMode.value ? darkTheme : lightTheme}>
                <App />
            </NextUIProvider>
        </AuthContextProvider>
    );
};

export default AppWrapper;
