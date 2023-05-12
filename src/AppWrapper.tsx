import { NextUIProvider } from '@nextui-org/react';
import { AuthContextProvider, RegisterContextProvider } from './context/provider';
import App from './App';
import useDarkMode from 'use-dark-mode';
import lightTheme from './themes/lightTheme';
import darkTheme from './themes/darkTheme';
import UserDataProvider from './context/provider/UserDataProvider';

const AppWrapper = () => {
    const darkMode = useDarkMode(false);
    return (
        <RegisterContextProvider>
            <AuthContextProvider>
                <UserDataProvider>
                    <NextUIProvider theme={darkMode.value ? darkTheme : lightTheme}>
                        <App />
                    </NextUIProvider>
                </UserDataProvider>
            </AuthContextProvider>
        </RegisterContextProvider>
    );
};

export default AppWrapper;
