import { createTheme } from '@nextui-org/react';

const darkTheme = createTheme({
    type: 'dark',
    theme: {
        colors: {
            // brand colors
            primaryLight: 'transparent',
            primaryLightHover: '$green300',
            primaryLightActive: '$green400',
            primaryLightContrast: '$green600',
            primary: '#ec9127',
            primaryBorder: '$green500',
            primaryBorderHover: '$green600',
            primarySolidHover: '$yellow500',
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
        },
        space: {},
        fonts: {},
    },
});

export default darkTheme;
