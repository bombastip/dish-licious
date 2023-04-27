import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { NextUIProvider, createTheme } from '@nextui-org/react';
import  NavbarF  from './components/Navbar.tsx';

const theme = createTheme({
    type: "light", // it could be "light" or "dark"
    theme: {
      colors: {
        // brand colors
        primaryLight: '$green200',
        primaryLightHover: '$green300',
        primaryLightActive: '$green400',
        primaryLightContrast: '$green600',
        primary: '#4ADE7B',
        primaryBorder: '$green500',
        primaryBorderHover: '$green600',
        primarySolidHover: '$green700',
        primarySolidContrast: '$white',
        primaryShadow: '$green500',
        // create secondary colors
        secondary: '$yellow500',
        secondaryLight: '$yellow200',
        secondaryLightHover: '$yellow300',
        secondaryLightActive: '$yellow400',
        secondaryLightContrast: '$yellow600',
        secondaryBorder: '$yellow500',
        secondaryBorderHover: '$yellow600',
        secondarySolidHover: '$yellow700',
        secondarySolidContrast: '$white',
        secondaryShadow: '$yellow500',

  
        gradient: 'linear-gradient(112deg, $yellow100 -25%, $pink500 -10%, $purple500 80%)',
        link: '#5E1DAD',
  
        // you can also create your own color
        myColor: '#ff4ecd'
  
        // ...  more colors
      },
      space: {},
      fonts: {}
    }
  })

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <NextUIProvider theme={theme}>
            <NavbarF />
            <App />
        </NextUIProvider>
    </React.StrictMode>,
);
