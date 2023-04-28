import { createTheme } from '@nextui-org/react';

const lightRetroTheme = createTheme({
    type: 'light',
    className: 'light-retro',
    theme: {
        colors: {
            primary: '#ec9127',
            primaryLight: 'transparent',
            error: '#EE457E',
        },
    },
});
export default lightRetroTheme;
